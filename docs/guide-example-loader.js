module.exports = function guideExampleLoader(source) {
  source = source.replace(/export default/g, "const $component =")

  return `
    ${source}
    ;
    const $source = ${JSON.stringify(source)};

    $component.$source = $source;
    $component.$component = $component;
    export default $component;
  `
}
