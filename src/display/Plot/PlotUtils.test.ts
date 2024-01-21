import { sample } from "./PlotUtils"

test("sample", () => {
  const ts: number[] = []

  sample<number>({
    domain: [0, 8],
    minDepth: 3,
    maxDepth: 3,
    error: () => Number.POSITIVE_INFINITY,
    fn: (t) => t,
    lerp: () => 0,
    onPoint(t) {
      ts.push(t)
    },
    threshold: 0,
  })

  // Since the sample function deliberately introduces randomness, we round to test.
  const roundedTs = ts.map(Math.round)

  expect(roundedTs).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
})
