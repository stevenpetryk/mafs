import * as React from "react"
export interface StopwatchArguments {
  /** The start time in seconds */
  startTime?: number
  /** The end time in seconds */
  endTime?: number
}

export interface Stopwatch {
  /**
   * The amount of time that has passed since the timer started, in high-precision seconds.
   */
  time: number
  /** Starts the timer (resumes the timer if paused) */
  start: () => void
  /** Stops and resets the timer. */
  stop: () => void

  /** Sets the current time to a certain value.
   * @throws an error if the time is outside of the given range.
   */
  setTime: (time: number) => void
}

export function useStopwatch(options?: StopwatchArguments): Stopwatch {
  const { startTime = 0, endTime = Infinity } = options || {}

  const startClockTime = React.useRef<DOMHighResTimeStamp | null>(null)
  const [time, setTime] = React.useState(startTime)
  const [playing, setPlaying] = React.useState(false)

  React.useEffect(() => {
    let request = -1

    function tick(now: DOMHighResTimeStamp) {
      now = now / 1000

      if (!startClockTime.current) startClockTime.current = now
      const deltaTime = now - startClockTime.current

      if (deltaTime >= endTime) {
        startClockTime.current = null
        setTime(endTime)
        setPlaying(false)
        return
      }

      setTime(Math.min(deltaTime, endTime))
      request = window.requestAnimationFrame(tick)
    }

    if (playing) {
      request = window.requestAnimationFrame(tick)
    } else {
      window.cancelAnimationFrame(request)
    }

    return () => window.cancelAnimationFrame(request)
  }, [playing, endTime])

  const start = React.useCallback(() => setPlaying(true), [])
  const stop = React.useCallback(() => {
    startClockTime.current = null
    setPlaying(false)
    setTime(startTime)
  }, [startTime])

  return { time, setTime: (time) => setTime(time * 1000), start, stop }
}
