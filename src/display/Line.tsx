import { PointAngle } from "./Line/PointAngle"
import { PointSlope } from "./Line/PointSlope"
import { ThroughPoints } from "./Line/ThroughPoints"
import { Segment } from "./Line/Segment"

export const Line = {
  PointAngle,
  PointSlope,
  ThroughPoints,
  Segment,
}

import type { PointAngleProps } from "./Line/PointAngle"
import type { PointSlopeProps } from "./Line/PointSlope"
import type { ThroughPointsProps } from "./Line/ThroughPoints"
import type { SegmentProps } from "./Line/Segment"
export type { PointAngleProps, PointSlopeProps, ThroughPointsProps, SegmentProps }

// @ts-expect-error - setting these here to avoid invalid .d.ts output
Line.PointAngle.displayName = "Line.PointAngle"
// @ts-expect-error - setting these here to avoid invalid .d.ts output
Line.PointSlope.displayName = "Line.PointSlope"
// @ts-expect-error - setting these here to avoid invalid .d.ts output
Line.Segment.displayName = "Line.Segment"
// @ts-expect-error - setting these here to avoid invalid .d.ts output
Line.ThroughPoints.displayName = "Line.ThroughPoints"
