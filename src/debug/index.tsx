import { TransformWidget } from "./TransformWidget"

export const Debug = {
  TransformWidget,
}

// @ts-expect-error - setting these here to avoid invalid .d.ts output
Debug.TransformWidget.displayName = "Debug.TransformWidget"
