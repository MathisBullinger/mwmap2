import Vector from './vector'
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

  public translate(translation: Vector) {
    for (let i = 0; i < this.columns; i++) {
      this.values[(this.rows - 1) * this.columns + i] +=
        translation.values[i] ?? 0
    }
  }

  public scale(factor: Vector | number) {
    const vec =
      typeof factor === 'number'
        ? Vector.from(Math.min(this.columns, this.rows), null, factor)
        : factor

    for (let i = 0; i < Math.min(this.columns, this.rows); i++)
      this.values[i * this.columns + i] *= vec.values[i] ?? 1
  }

  public readonly values: Float32Array
}
