import type { Driver } from 'driver.js'
import { createError } from '#app'

export default function exposeAPI(instance: Driver | undefined) {
  if (!instance) {
    throw createError('Driver instance not found')
  }

  const proto = Object.getPrototypeOf(instance)
  const methodNames = Object.getOwnPropertyNames(proto)
    .filter(
      name => name !== 'constructor' && typeof proto[name as keyof typeof proto] === 'function',
    )

  const api: Record<string, unknown> = {}

  for (const name of methodNames) {
    if (name in instance) {
      api[name] = (...args: unknown[]) => {
        const fn = instance[name as keyof Driver]
        if (typeof fn === 'function') {
          return (fn as (...args: unknown[]) => unknown).apply(instance, args)
        }
        throw createError(`Property ${name} is not a function on Driver instance`)
      }
    }
  }

  return api as {
    [K in keyof Driver]: Driver[K] extends (...args: infer A) => infer R
      ? (...args: A) => R
      : never
  }
}
