const evalWithContext = require('@testx/eval');

module.exports = ctx => variable => {
  const resolveOne = v => {
    if (v) {
      let m, result;
      switch (typeof v) {
        case 'string':
          if ((m = v.match(/(\{\{(.+?)\}\})/) || v.match(/(\$\{(.+?)\})/))) {
            const [full, withCurlies, varname] = Array.from(m);
            result = evalWithContext(ctx, varname);
            result =
              typeof result === 'function' ? result(ctx) : resolveOne(result);
            if (withCurlies === v) {
              return resolveOne(result);
            } else {
              return resolveOne(v.replace(withCurlies, result));
            }
          } else {
            return v;
          }
        case 'object':
          if (Array.isArray(v)) {
            return v.map(val => resolveOne(val));
          } else {
            result = {};
            for (let key in v) {
              const val = v[key];
              result[resolveOne(key)] = resolveOne(val);
            }
            return result;
          }
        default:
          return v;
      }
    } else {
      return v;
    }
  };

  return resolveOne(variable);
};
