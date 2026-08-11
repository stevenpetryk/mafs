const reactGlobals = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean
}

reactGlobals.IS_REACT_ACT_ENVIRONMENT = true
