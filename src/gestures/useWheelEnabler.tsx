import * as React from "react"
/**
 * A custom hook that makes the `wheel` event not interrupt scrolling. It will
 * only allow the Mafs viewport to be zoomed using the wheel if the user hasn't
 * scrolled the page for 500ms, or if they are hovering over the Mafs viewport.
 */
export function useWheelEnabler(zoomEnabled: boolean) {
  const [wheelEnabled, setWheelEnabled] = React.useState(false)

  const timer = React.useRef<number>(0)

  React.useEffect(() => {
    if (!zoomEnabled) return

    function handleWindowScroll() {
      setWheelEnabled(false)

      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setWheelEnabled(true)
      }, 500) as unknown as number
    }

    window.addEventListener("scroll", handleWindowScroll)
    return () => window.removeEventListener("scroll", handleWindowScroll)
  }, [zoomEnabled])

  return {
    wheelEnabled: zoomEnabled ? wheelEnabled : false,
    handleMouseMove() {
      setWheelEnabled(true)
    },
  }
}
