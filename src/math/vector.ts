export default class Vector<T extends number = number> {
  constructor(...values: SizedArray<T>) {
    this.values = values
  }

  public static from<T extends number>(
    dimensions: T,
    vector?: Vector,
    fill = 0
  ): Vector<T> {
    const result = new Vector<0>()
    for (let i = 0; i < dimensions; i++)
      result.values.push(vector?.values[i] ?? fill)
    return result
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
  public get dimensions() {
    return this.values.length
  }
}

type SizedArray<N extends number, T extends number[] = []> = SizeOf<T> extends N
  ? T
  : SizedArray<N, [...T, number]>

type SizeOf<T extends unknown[]> = T extends { length: infer I } ? I : never
