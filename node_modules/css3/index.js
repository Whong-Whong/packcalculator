
exports.parse = content => {
  function kv(prop){
    return prop
    .split(/;/g)
    .filter(x => !!x.trim())
    .reduce((obj, rule) => {
      const [ k, v ] = rule.split(':');
      obj[k] = v;
      return obj;
    }, {});
  }
  return content
    .replace(/\n/g, '')
    .replace(/\/\*(.|[\r\n])*?\*\//g, '')
    .replace(/\}/g, '}\n')
    .split(/\n/g)
    .filter(x => !!x.trim())
    .map(line => {
      const tokens = line.match(/^(.+)\{(.+)\}$/);
      if(!tokens) return new SyntaxError(`Unexpected error: ${line}`);
      let [ _, selector, content ] = tokens;
      selector = selector.split(',').map(s => s.trim());
      content = content.replace(/\s/g, '');
      return {
        raw: _, selector, content, props: kv(content)
      };
  });
};