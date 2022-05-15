export type SizedArray<
  N extends number,
  T extends number[] = []
> = SizeOf<T> extends N ? T : SizedArray<N, [...T, number]>

export type SizeOf<T extends unknown[]> = T extends { length: infer I }
  ? I extends number
    ? I
    : never
  : never

type AppendArray<A extends unknown[], B extends unknown[]> = B extends [
  infer H,
  ...infer T
]
  ? AppendArray<[...A, H], T>
  : A

export type Add<A extends number, B extends number> = SizeOf<
  AppendArray<SizedArray<A>, SizedArray<B>>
>

export type Subtract<A extends number, B extends number> = SubtractHelper<
  SizedArray<A>,
  SizedArray<B>
>

type SubtractHelper<A extends unknown[], B extends unknown[]> = B extends [
  infer H,
  ...infer T
]
  ? SubtractHelper<A extends [infer _, ...infer AT] ? AT : never, T>
  : SizeOf<A>
