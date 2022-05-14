import Vector from './vector'
import { assert } from '../util/assert'
import type { Add } from '../util/types'

export default class Matrix<R extends number, C extends number> {
  constructor(
    public readonly rows: R,
    public readonly columns: C,
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

  public fill(n: number): Matrix<R, C> {
    this.values.fill(n)
    return this
  }

  static translate<T extends number>(
    translation: Vector<T>
  ): Matrix<Add<T, 1>, Add<T, 1>> {
    const result = new Matrix(
      translation.dimensions + 1,
      translation.dimensions + 1
    )

    for (let i = 0; i < translation.dimensions; i++)
      result.set(result.columns - 1, i, translation.values[i])

    return result as any
  }

  static scale<T extends number>(
    scaling: Vector<T>
  ): Matrix<Add<T, 1>, Add<T, 1>> {
    const result = new Matrix(scaling.dimensions + 1, scaling.dimensions + 1)

    for (let i = 0; i < scaling.dimensions; i++)
      result.set(i, i, scaling.values[i])

    return result as any
  }

  public multiply<BC extends number>(rhs: Matrix<C, BC>): Matrix<R, BC> {
    assert(
      this.rows === (rhs.columns as any),
      () =>
        `matrices must have compatible sizes for multiplication\n${this.toString()}\n${rhs.toString()}`
    )
    const result = new Matrix(this.rows, rhs.columns).fill(0)

    for (let rowA = 0; rowA < this.rows; rowA++) {
      for (let columnB = 0; columnB < rhs.columns; columnB++) {
        for (let i = 0; i < this.columns; i++) {
          result.set(
            rowA,
            columnB,
            result.at(rowA, columnB) + this.at(rowA, i) * rhs.at(i, columnB)
          )
        }
      }
    }

    return result
  }

  public at(row: number, column: number): number {
    assert(row * this.columns + column < this.values.length)
    return this.values[row * this.columns + column]
  }

  public set(row: number, column: number, value: number) {
    assert(row * this.columns + column < this.values.length)
    this.values[row * this.columns + column] = value
  }

  public toString() {
    let longest = ''
    const rows = [...Array(this.rows)].map((_, row) =>
      [...this.values]
        .slice(row * this.columns, (row + 1) * this.columns)
        .map((n) => {
          const str = n.toString()
          if (str.length > longest.length) longest = str
          return str
        })
    )
    return `Matrix<${this.rows}, ${this.columns}>(\n${rows
      .map(
        (row) =>
          `  ${row
            .map((v) => ' '.repeat(longest.length - v.length) + v)
            .join(', ')}`
      )
      .join('\n')}\n)`
  }

  public readonly values: Float32Array
}
