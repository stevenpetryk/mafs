// Imagine a function like this
function xy(t) {
  return [t, t ** 2]
}

// Shoelace formula
function triangleArea(a, b, c) {
  return Math.abs((a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1])) / 2
}

// Just picking a really low area threshold for performance testing
const areaThreshold = 0.001

function smartSmooth(points, min, max, isLeft) {
  const mid = (min + max) / 2

  const xyMin = xy(min)
  const xyMid = xy(mid)
  const xyMax = xy(max)

  const area = triangleArea(xyMin, xyMid, xyMax)

  if (area > areaThreshold) {
    smartSmooth(points, min, mid, true)
    smartSmooth(points, mid, max, false)
  } else {
    if (isLeft) points.push([min, xyMin])
    points.push([mid, xy(mid)])
    if (!isLeft) points.push([max, xyMax])
  }
}

const points = []
smartSmooth(points, 0, Math.PI * 10)
