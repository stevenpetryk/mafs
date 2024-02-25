import * as React from "react"
import { vec } from "../vec"
import { Theme } from "../display/Theme"
import { useMovablePoint } from "../interaction/useMovablePoint"
import { Transform } from "../display/Transform"
import { Circle } from "../display/Circle"
import { Polygon } from "../display/Polygon"

export interface TransformWidgetProps {
  /** The components to transform */
  children: React.ReactNode
}

export function TransformWidget({ children }: TransformWidgetProps) {
  const t = useMovablePoint([0, 0])
  const s = useMovablePoint([1, 1], { color: Theme.blue })
  const r = useMovablePoint([1, 0], {
    color: Theme.green,
    constrain: (p) => vec.normalize(p),
  })
  const angle = Math.atan2(r.point[1], r.point[0])

  return (
    <>
      <Transform translate={t.point}>
        <Transform rotate={angle}>
          <Transform scale={s.point}>
            {children}

            <Polygon
              points={[
                [0, 0],
                [0, 1],
                [1, 1],
                [1, 0],
              ]}
              color={Theme.blue}
            />
          </Transform>

          <Circle
            center={[0, 0]}
            radius={1}
            strokeStyle="dashed"
            strokeOpacity={0.5}
            fillOpacity={0}
            color={Theme.green}
          />

          {s.element}
        </Transform>

        {r.element}
      </Transform>

      {t.element}
    </>
  )
}

TransformWidget.displayName = "Debug.TransformWidget"
