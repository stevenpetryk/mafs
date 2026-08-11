import { useEffect } from "react"
import { Circle, Coordinates, Line, Mafs, Text, Theme, useStopwatch } from "mafs"

export function AnimationDemo() {
  const { rawTime, time, playing, start, pause, setTime } = useStopwatch({
    endTime: 4,
    repeat: true,
    ease: (value) => value * value * (3 - 2 * value),
  })

  useEffect(() => {
    start()
  }, [start])

  const angle = (time / 4) * Math.PI * 2
  const point: [number, number] = [Math.cos(angle) * 1.8, Math.sin(angle) * 1.8]

  return (
    <div className="animation-demo">
      <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }}>
        <Coordinates.Cartesian subdivisions={2} />
        <Circle center={[0, 0]} radius={1.8} color={Theme.blue} fillOpacity={0.05} />
        <Line.Segment point1={[0, 0]} point2={point} color={Theme.pink} weight={3} />
        <Circle center={point} radius={0.13} color={Theme.yellow} />
        <Text x={0} y={2.55} size={16} color={Theme.foreground}>
          {playing ? "playing" : "paused"} · t={time.toFixed(2)}s
        </Text>
      </Mafs>
      <div className="control-row">
        <button type="button" onClick={playing ? pause : start}>
          {playing ? "Pause" : "Resume"}
        </button>
        <input
          aria-label="Animation key frame"
          type="range"
          min="0"
          max="4"
          step="0.01"
          value={rawTime}
          onPointerDown={pause}
          onChange={(event) => setTime(Number(event.target.value))}
        />
      </div>
    </div>
  )
}
