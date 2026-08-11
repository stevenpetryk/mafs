import * as React from "react"

export interface StopwatchArguments {
  /** The start time in seconds */
  startTime?: number
  /** The end time in seconds */
  endTime?: number
  /**
   * Whether to loop the animation between `startTime` and `endTime` instead of
   * stopping once `endTime` is reached. Requires a finite `endTime` to have any
   * effect.
   */
  repeat?: boolean
  /** Whether to play the animation in reverse (from `endTime` to `startTime`). */
  reversed?: boolean
  /**
   * An easing function applied to the normalized progress of the animation. It
   * receives a value between 0 and 1 (0 being `startTime`, 1 being `endTime`)
   * and should return the eased value, also typically between 0 and 1. Requires
   * a finite `endTime` to have any effect.
   */
  ease?: (t: number) => number
}

export interface Stopwatch {
  /** The current position on the underlying, non-eased timeline. */
  rawTime: number
  /**
   * The current time of the stopwatch, in seconds, after any easing or
   * reversing has been applied.
   */
  time: number
  /** Whether the stopwatch is currently running. */
  playing: boolean
  /** Starts the stopwatch (or resumes it if it was paused). */
  start: () => void
  /** Pauses the stopwatch at its current time without resetting it. */
  pause: () => void
  /** Stops the stopwatch and resets it back to `startTime`. */
  stop: () => void
  /**
   * Jumps the stopwatch to a specific time (a "key frame"). Note that this sets
   * the position on the underlying timeline, so if an `ease` function is in use
   * the displayed `time` may differ slightly from the value passed here.
   *
   * @throws an error if the time is outside of the given range.
   */
  setTime: (time: number) => void
}

export function useStopwatch(options?: StopwatchArguments): Stopwatch {
  const {
    startTime = 0,
    endTime = Infinity,
    repeat = false,
    reversed = false,
    ease,
  } = options || {}

  const duration = endTime - startTime

  if (duration < 0) {
    throw new RangeError("endTime must be greater than or equal to startTime")
  }

  const [playing, setPlaying] = React.useState(false)
  /**
   * The elapsed time on the underlying (un-eased) timeline. This is the source
   * of truth for "where" the animation is; `time` is derived from it.
   */
  const [rawElapsed, setRawElapsed] = React.useState(0)

  /** The elapsed time that has been "committed" across pauses. */
  const committed = React.useRef(0)
  /** The clock time at which the current playing segment resumed. */
  const resumeClockTime = React.useRef<DOMHighResTimeStamp | null>(null)

  React.useEffect(() => {
    let request = -1

    function tick(now: DOMHighResTimeStamp) {
      // A zero-length animation has nowhere to advance to. This also avoids
      // the `value % 0` NaN case when repeat is enabled.
      if (duration === 0) {
        committed.current = 0
        resumeClockTime.current = null
        setRawElapsed(0)
        setPlaying(false)
        return
      }

      const nowSec = now / 1000
      if (resumeClockTime.current === null) resumeClockTime.current = nowSec
      const segment = nowSec - resumeClockTime.current
      let raw = committed.current + segment

      if (Number.isFinite(duration)) {
        if (!repeat && raw >= duration) {
          committed.current = duration
          resumeClockTime.current = null
          setRawElapsed(duration)
          setPlaying(false)
          return
        }
        if (repeat) raw %= duration
      }

      setRawElapsed(raw)
      request = window.requestAnimationFrame(tick)
    }

    if (playing) {
      resumeClockTime.current = null
      request = window.requestAnimationFrame(tick)
    } else {
      window.cancelAnimationFrame(request)
    }

    return () => window.cancelAnimationFrame(request)
  }, [playing, duration, repeat])

  // Derive the displayed time from the raw timeline position.
  const time = React.useMemo(() => {
    if (Number.isFinite(duration)) {
      let normalized = duration === 0 ? 1 : rawElapsed / duration
      if (reversed) normalized = 1 - normalized
      if (ease) normalized = ease(normalized)
      return startTime + normalized * duration
    }
    return reversed ? startTime - rawElapsed : startTime + rawElapsed
  }, [rawElapsed, duration, startTime, reversed, ease])

  const start = React.useCallback(() => {
    if (duration === 0) {
      committed.current = 0
      setRawElapsed(0)
      setPlaying(false)
      return
    }

    // If a non-repeating animation has finished, restart it from the beginning.
    if (Number.isFinite(duration) && committed.current >= duration) {
      committed.current = 0
      setRawElapsed(0)
    }
    setPlaying(true)
  }, [duration])

  const pause = React.useCallback(() => {
    committed.current = rawElapsed
    resumeClockTime.current = null
    setPlaying(false)
  }, [rawElapsed])

  const stop = React.useCallback(() => {
    committed.current = 0
    resumeClockTime.current = null
    setRawElapsed(0)
    setPlaying(false)
  }, [])

  const setTime = React.useCallback(
    (time: number) => {
      if (!Number.isFinite(time) || time < startTime || time > endTime) {
        throw new RangeError(`time must be between ${startTime} and ${endTime}`)
      }

      // Set the position on the underlying timeline. Reversing and easing are
      // applied when deriving the displayed `time`, not here, so that a jump to
      // a given timeline position behaves consistently.
      const raw = time - startTime

      committed.current = raw
      resumeClockTime.current = null
      setRawElapsed(raw)
    },
    [startTime, endTime],
  )

  return { rawTime: startTime + rawElapsed, time, playing, start, pause, stop, setTime }
}
