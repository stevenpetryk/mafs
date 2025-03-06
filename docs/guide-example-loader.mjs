// @ts-check
/* eslint-disable no-undef, @typescript-eslint/no-var-requires */

import { createStarryNight, all } from "@wooorm/starry-night"

const starryNightPromise = createStarryNight(all)

/**
 * This loader is what powers Mafs' guide examples. It takes the default export
 * of all the code in components/guide-examples and makes sure that the source
 * code is also exported, and also takes care of syntax highlighting
 * at build time.
 *
 * Since all the guide-examples are maintained in this repo, I didn't bother
 * bringing in a proper parser. I just find and replace the default export.
 *
 * @type {import('webpack').LoaderDefinition}
 */
export default async function guideExampleLoader(source) {
  let cleanedSource = source

  const heightRegex = /\s+height=\{([^}]*)\}/g
  const widthRegex = /\s+width=\{([^}]*)\}/g

  const remove = [
    heightRegex,
    widthRegex,
    /.*prettier-ignore.*\n/gm,
    /^import React.* from "react"/gm,
    /"use client"/m,
  ]

  const height = parseFloat(heightRegex.exec(cleanedSource)?.[1] || "300");
  const width = parseFloat(widthRegex.exec(cleanedSource)?.[1] || "NaN");

  remove.forEach((regex) => {
    cleanedSource = cleanedSource.replace(regex, "")
  })

  cleanedSource = cleanedSource.replaceAll(/import \{(.|\n)*?\} from "mafs"/gm, (match) => {
    return match.replaceAll(/\s+/g, " ").replace(", }", " }")
  })

  cleanedSource = cleanedSource.trim()

  const starryNight = await starryNightPromise
  const scope = starryNight.flagToScope(this.resourcePath)
  const tree = starryNight.highlight(cleanedSource, scope ?? "tsx")

  const useClientRegex = /'use client'|"use client"/
  const usesClient = useClientRegex.test(source)
  
  const transformedSource = source
    .replace(/export default/g, "const $default =")
    .replace(useClientRegex, "")

  return `
    ${usesClient ? "'use client';" : ""}

    import {Fragment, jsx, jsxs} from 'react/jsx-runtime';
    import {toJsxRuntime} from 'hast-util-to-jsx-runtime';

    ${transformedSource};

    $default.$source = ${JSON.stringify(cleanedSource)};
    $default.$component = $default;
    $default.$highlightedSource = toJsxRuntime(${JSON.stringify(tree)}, { Fragment, jsx, jsxs });
    $default.$width = ${isNaN(width) ? "undefined" : JSON.stringify(width)};
    $default.$height = ${isNaN(width) ? "300" : JSON.stringify(height)};
    export default $default;
  `
}
