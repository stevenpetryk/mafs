module.exports = {
  launch: {
    defaultViewport: {
      width: 500,
      height: 500,
    },
    args: [
      "--font-render-hinting=none",
      "--disable-gpu",
      "--force-device-scale-factor=1",
      "--window-size=500,500",
    ],
  },
  browserContext: "default",
}
