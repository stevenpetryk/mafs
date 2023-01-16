import { ViewportInfo } from "./ViewportInfo"
import { TransformWidget } from "./TransformWidget"

export const Debug = {
  ViewportInfo,
  TransformWidget,
}

// @ts-expect-error - setting these here to avoid invalid .d.ts output
Debug.ViewportInfo.displayName = "Debug.ViewportInfo"

// @ts-expect-error - setting these here to avoid invalid .d.ts output
Debug.TransformWidget.displayName = "Debug.TransformWidget"
