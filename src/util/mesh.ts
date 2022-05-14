type Rect = { left: number; right: number; top: number; bottom: number }

export const gridMesh = (
  divX: number,
  divY: number,
  { left = 0, right = 1, top = 0, bottom = 1 }: Partial<Rect> = {}
) => {
  const width = right - left
  const height = bottom - top
  const coords: number[] = []

  const coord = (x: number, y: number) => [
    x,
    y,
    (x - left) / width,
    (y - top) / height,
  ]

  for (let y = 0; y <= divY; y++) {
    for (let x = 0; x <= divX; x++) {
      const x0 = left + width * (x / (divX + 1))
      const x1 = left + width * ((x + 1) / (divX + 1))
      const y0 = top + height * (y / (divY + 1))
      const y1 = top + height * ((y + 1) / (divY + 1))

      // prettier-ignore
      coords.push(
        ...coord(x0, y1),
        ...coord(x0, y0),
        ...coord(x1, y0),
        ...coord(x1, y0),
        ...coord(x1, y1),
        ...coord(x0, y1),
      )
    }
  }

  return coords
}
