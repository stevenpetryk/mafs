/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import * as React from "react"

interface UseControlledProps<T = unknown> {
  /**
   * Holds the component value when it's controlled.
   */
  controlled: T | undefined
  /**
   * The default value when uncontrolled.
   */
  default: T | undefined
  /**
   * The component name displayed in warnings.
   */
  name: string
  /**
   * The name of the state variable displayed in warnings.
   */
  state?: string
}

// Copied from @mui/utils the 06/05/2023
// perma link: https://github.com/mui/material-ui/blob/b48f0e8fec48461d254f01502f3bb1abd70ed420/packages/mui-utils/src/useControlled.js
export default function useControlled<T>({
  controlled,
  default: defaultProp,
  name,
  state = "value",
}: UseControlledProps<T>): [
  T,
  (newValue: T | undefined | ((prevValue: T | undefined) => T | undefined)) => void
] {
  // isControlled is ignored in the hook dependency lists as it should never change.
  const { current: isControlled } = React.useRef(controlled !== undefined)
  const [valueState, setValue] = React.useState(defaultProp)
  const value = isControlled ? controlled : valueState

  if (process.env.NODE_ENV !== "production") {
    React.useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          [
            `MUI: A component is changing the ${
              isControlled ? "" : "un"
            }controlled ${state} state of ${name} to be ${isControlled ? "un" : ""}controlled.`,
            "Elements should not switch from uncontrolled to controlled (or vice versa).",
            `Decide between using a controlled or uncontrolled ${name} ` +
              "element for the lifetime of the component.",
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            "More info: https://fb.me/react-controlled-components",
          ].join("\n")
        )
      }
    }, [state, name, controlled])

    const { current: defaultValue } = React.useRef(defaultProp)

    React.useEffect(() => {
      if (!isControlled && defaultValue !== defaultProp) {
        console.error(
          [
            `MUI: A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. ` +
              `To suppress this warning opt to use a controlled ${name}.`,
          ].join("\n")
        )
      }
    }, [JSON.stringify(defaultProp)])
  }

  const setValueIfUncontrolled = React.useCallback(
    (newValue: React.SetStateAction<T | undefined>) => {
      if (!isControlled) {
        setValue(newValue)
      }
    },
    []
  )

  return [value as T, setValueIfUncontrolled]
}
