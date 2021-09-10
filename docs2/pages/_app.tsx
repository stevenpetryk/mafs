// import "../styles/base.css"
// import "../styles/components.css"
// import "tailwindcss/tailwind.css"
import "../styles/global.css"
import type { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
