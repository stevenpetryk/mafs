/* eslint-disable no-undef */
module.exports = function guideExampleLoader(source) {
  return `
    ${source.replace(/export default/g, "const $default =")}
    ;
    const $source = ${JSON.stringify(source)};

    $default.$source = $source;
    $default.$component = $default;
    export default $default;
  `
}
