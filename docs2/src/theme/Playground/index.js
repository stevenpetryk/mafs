import * as React from "react"
import BrowserOnly from "@docusaurus/BrowserOnly"
import { usePrismTheme } from "@docusaurus/theme-common"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live"
import styles from "./styles.module.css"

function LivePreviewLoader() {
  return <div>Loading...</div>
}

function ResultWithHeader() {
  return (
    <BrowserOnly fallback={<LivePreviewLoader />}>
      {() => (
        <>
          <LivePreview />
          <LiveError />
        </>
      )}
    </BrowserOnly>
  )
}

function ThemedLiveEditor() {
  const isBrowser = useIsBrowser()
  return (
    <LiveEditor
      // We force remount the editor on hydration,
      // otherwise dark prism theme is not applied
      key={String(isBrowser)}
      className={styles.playgroundEditor}
    />
  )
}

export default function Playground({ children, transformCode, ...props }) {
  const prismTheme = usePrismTheme()

  return (
    <div className={styles.playgroundContainer}>
      <LiveProvider
        code={children.replace(/\n$/, "")}
        transformCode={transformCode ?? ((code) => `${code};`)}
        theme={prismTheme}
        {...props}
      >
        <ResultWithHeader />
        <ThemedLiveEditor />
      </LiveProvider>
    </div>
  )
}
