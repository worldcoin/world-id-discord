/* eslint-disable @typescript-eslint/no-explicit-any */
export type SafeCallSuccess<T> = { success: true; data: T; error?: never }
export type SafeCallError = { success: false; error: Error; data?: never }
export type SafeCallOutput<T> = SafeCallSuccess<T> | SafeCallError

const handleError = (error: unknown): SafeCallError => ({
  success: false,
  error: error instanceof Error ? error : new Error('Unknown error', { cause: error }),
})

/**
 * Wraps a function to provide safe error handling and type-safe results.
 *
 * @example Async function with args
 * ```ts
 * const fetchUser = async (id: number) => {
 *   const response = await fetch(`/api/user/${id}`);
 *   return response.json();
 * };
 *
 * const result = await safeCall(fetchUser)(123);
 * ```
 *
 * @example Sync function with multiple args
 * ```ts
 * const add = (a: number, b: number) => a + b;
 * const result = safeCall(add)(2, 2);
 * ```
 */

export function safeCall<F extends (...args: any[]) => any>(
  fn: F
): (
  ...args: Parameters<F>
) => ReturnType<F> extends never
  ? SafeCallOutput<never>
  : ReturnType<F> extends Promise<any>
    ? Promise<SafeCallOutput<Awaited<ReturnType<F>>>>
    : SafeCallOutput<ReturnType<F>> {
  return (...args) => {
    try {
      const result = fn(...args)
      if (result instanceof Promise) {
        return result.then(data => ({ success: true, data })).catch(handleError) as any
      }
      return { success: true, data: result }
    } catch (error) {
      return handleError(error)
    }
  }
}
