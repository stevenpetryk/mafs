import { PointAngle } from "./Line/PointAngle"
import { PointSlope } from "./Line/PointSlope"
import { ThroughPoints } from "./Line/ThroughPoints"
import { Segment } from "./Line/Segment"
import { Bezier } from "./Line/Bezier"
import { Vertical } from "./Line/Vertical"
import { Horizontal } from "./Line/Horizontal"

export const Line = {
  PointAngle,
  PointSlope,
  ThroughPoints,
  Segment,
  Bezier,
  Vertical,
  Horizontal,
}

import type { PointAngleProps } from "./Line/PointAngle"
import type { PointSlopeProps } from "./Line/PointSlope"
import type { ThroughPointsProps } from "./Line/ThroughPoints"
import type { SegmentProps } from "./Line/Segment"
import type { BezierProps } from "./Line/Bezier"
import type { VerticalProps } from "./Line/Vertical"
import type { HorizontalProps } from "./Line/Horizontal"
export type {
  PointAngleProps,
  PointSlopeProps,
  ThroughPointsProps,
  SegmentProps,
  BezierProps,
  VerticalProps,
  HorizontalProps,
}
