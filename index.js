(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.curry = factory());
}(this, (function () { 'use strict';

  function op_sequential(operator, count) {
    function next(a, index) {
      return function (...b) {
        let sum = a;

        if (b.length === 0) {
          return sum;
        }

        for (; index < count && b.length > 0; index++) {
          sum = operator(sum, b.shift(), index);
        }

        if (index < count) {
          return next(sum, index);
        }

        return sum;
      };
    }

    return function (...a) {
      if (a.length === 0) {
        return;
      }

      let sum = a.shift();
      let index = 1;

      for (; index < count && a.length > 0; index++) {
        sum = operator(sum, a.shift(), index);
      }

      if (index < count) {
        return next(sum, index);
      }

      return sum;
    };
  }

  function op_lazy(operator, count) {
    return function next(...a) {
      if (a.length < count) {
        return function (...b) {
          if (b.length !== 0) {
            return next(...a, ...b);
          }

          return a.reduce(operator);
        };
      }

      return a.reduce(operator);
    };
  }

  function op(operator, count = Infinity, lazy = false) {
    if (lazy) {
      return op_lazy(operator, count);
    }

    return op_sequential(operator, count);
  }

  function fixed(f) {
    return function next(...a) {
      if (a.length < f.length) {
        return function (...b) {
          return next(...a, ...b);
        };
      }

      return f(...a);
    };
  }

  function deCurry(curry) {
    return function (...args) {
      let f = curry;

      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        f = f(arg);
      }

      return f;
    };
  }

  var index = {
    op,
    fixed,
    deCurry
  };

  return index;

})));
