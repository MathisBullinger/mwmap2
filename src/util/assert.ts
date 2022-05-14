export const assert = (
  condition: unknown,
  message?: string | (() => string),
  type = Error
) => {
  if (!(typeof condition === 'function' ? condition() : condition))
    throw new type(typeof message === 'function' ? message() : message)
}

export const notNull = <T>(
  data: T,
  msg?: string
): Exclude<T, null | undefined> => {
  if (data === null || data === undefined) throw TypeError(msg)
  return data as Exclude<T, null | undefined>
}
