import * as React from "react"
interface TestContextShape {
  overrideHeight?: number
}

export const TestContext = React.createContext<TestContextShape>({
  overrideHeight: undefined,
})

export const TestContextProvider = TestContext.Provider
