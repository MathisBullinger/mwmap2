import type { SizedArray } from '../util/types'

export default class Vector<T extends number = number> {
  constructor(...values: SizedArray<T>) {
    this.values = values
  }

  public static from<T extends number>(
    dimensions: T,
    vector?: Vector | null,
    fill = 0
  ): Vector<T> {
    const result = new Vector<0>()
    for (let i = 0; i < dimensions; i++)
      result.values.push(vector?.values[i] ?? fill)
    return result as Vector<T>
  }

  public add(rhs: Vector<T>): Vector<T> {
    const result = Vector.from(this.dimensions)
    for (let i = 0; i < this.dimensions; i++)
      result.values[i] = this.values[i] + rhs.values[i]
    return result
  }

  public subtract(rhs: Vector<T>): Vector<T> {
    const result = Vector.from(this.dimensions)
    for (let i = 0; i < this.dimensions; i++)
      result.values[i] = this.values[i] - rhs.values[i]
    return result
  }

  public multiply(n: number): Vector<T> {
    const result = Vector.from(this.dimensions)
    for (let i = 0; i < this.dimensions; i++)
      result.values[i] = this.values[i] * n
    return result
  }

  public divide = (n: number): Vector<T> => this.multiply(1 / n)

  public readonly values: number[]
  public get dimensions(): T {
    return this.values.length as T
  }
}
