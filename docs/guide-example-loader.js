/* eslint-disable no-undef */
module.exports = function guideExampleLoader(source) {
  source = source.replace(/export default/g, "const $default =")

  return `
    ${source}
    ;
    const $source = ${JSON.stringify(source)};

    $default.$source = $source;
    $default.$component = $default;
    export default $default;
  `
}
