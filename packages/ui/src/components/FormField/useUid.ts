let counter = 0

/** Id estable por instancia para enlazar label/hint/error con su control (Vue ^3.4 no trae useId). */
export function useUid(prefix: string): string {
  counter += 1
  return `${prefix}-${counter}`
}
