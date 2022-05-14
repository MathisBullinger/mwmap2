import { assert } from '../util/assert'

export default class Matrix {
  constructor(
    public readonly rows: number,
    public readonly columns: number,
    values: number[] = []
  ) {
    if (values.length) assert(values.length === rows * columns)

    this.values = values.length
      ? new Float32Array(values)
      : new Float32Array(rows * columns).fill(0)

    if (!values.length)
      for (let i = 0; i < Math.min(rows, columns); i++)
        this.values[i * columns + i] = 1
  }

  public readonly values: Float32Array
}
