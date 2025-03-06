import { PropTable } from "components/PropTable"

import CodeAndExample from "components/CodeAndExample"
import ImageExample from "guide-examples/display/images/ImageExample"
import ImageAnchorExample from "guide-examples/display/images/ImageAnchorExample"
import type { Metadata } from "next"

import mafsImage from "../../../../components/guide-examples/display/images/mafs.png"

export const metadata: Metadata = {
  title: "Images",
}

function Images() {
  return (
    <>
      <p>
        Images in Mafs are just wrappers around the SVG <code>image</code> element, with some
        quality of life improvements tacked on (see below).
      </p>

      <CodeAndExample
        example={ImageExample}
        extraImports={{
          "./mafs.png": mafsImage,
        }}
      />

      <PropTable of={"Image"} />

      <h2>
        Comparison with SVG <code>&lt;image&gt;</code>
      </h2>

      <p>
        The SVG <code>image</code> element is a low-level way to include external images in an SVG.
        It has a few downsides:
      </p>

      <ul>
        <li>Negative widths and heights lead to undefined behavior.</li>
        <li>
          The x and y attributes correspond to the top left of the image and is not configurable.
        </li>
      </ul>

      <p>
        Mafs handles negative heights and widths the way you'd expect; by making the image grow in
        the <code>-x</code> and <code>-y</code> directions.
      </p>

      <p>
        Additionally, the <code>anchor</code> attribute of <code>Image</code> allows you to declare
        whether the image's x and y coordinates refer to the corners, center of edges, or center of
        the image.
      </p>

      <CodeAndExample
        example={ImageAnchorExample}
        extraImports={{
          "./mafs.png": mafsImage,
        }}
      />
    </>
  )
}

export default Images
