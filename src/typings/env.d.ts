declare module "*.css" {
  const content: { [className: string]: string }
  export default content
}

declare module "*.png" {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const content: any
  export default content
}
