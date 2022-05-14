import Matrix from './matrix'

export const orthogonal = (
  opts: (
    | {
        left: number
        right: number
        top: number
        bottom: number
      }
    | { center: [x: number, y: number]; width: number; height: number }
  ) & { near: number; far: number }
) => {
  const { near, far } = opts
  const { left, right, top, bottom } =
    'left' in opts
      ? opts
      : {
          left: opts.center[0] - opts.width / 2,
          right: opts.center[0] + opts.width / 2,
          top: opts.center[1] + opts.height / 2,
          bottom: opts.center[1] - opts.height / 2,
        }

  const cx = (left + right) / 2
  const cy = (bottom + top) / 2
  const cz = (-near + -far) / 2
  const sx = 2.0 / (right - left)
  const sy = 2.0 / (top - bottom)
  const sz = 2.0 / (far - near)

  return new Matrix(
    4,
    4,
    // prettier-ignore
    [
       sx,   0,   0, 0,
        0,  sy,   0, 0,
        0,   0,  sz, 0,
      -cx, -cy, -cz, 1
    ]
  )
}

export const perspective = (
  fov: number,
  aspect: number,
  near: number,
  far: number
) => {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * (fov * (Math.PI / 180)))
  const rangeInv = 1.0 / (near - far)
  return new Matrix(
    4,
    4,
    // prettier-ignore
    [
      f / aspect,  0,                          0,   0,
               0,  f,                          0,   0,
               0,  0,    (near + far) * rangeInv,  -1,
               0,  0,  near * far * rangeInv * 2,   0
    ]
  )
}
