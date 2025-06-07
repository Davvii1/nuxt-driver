import { driver } from 'driver.js'
import type { Driver, Config, DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'
import { getCurrentInstance, isRef, onMounted, ref, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { createError } from '#app'

type ExtendedDriveStep = Omit<DriveStep, 'element'> & {
  element: string | Element | (() => Element) | Ref<HTMLElement | null> | null
}

type UseDriverOptions = Omit<Config, 'steps'> & {
  autoRun?: boolean
  steps: ExtendedDriveStep[]
}

export default function useDriver(options: UseDriverOptions = {} as UseDriverOptions) {
  const instance = getCurrentInstance()
  const driverInstance: Driver = driver()

  // Map of method names to their aliases (if any)
  const driverComputed = [
    { method: 'getState', alias: 'state' },
    { method: 'hasNextStep', alias: 'hasNextStep' },
    { method: 'hasPreviousStep', alias: 'hasPreviousStep' },
    { method: 'isFirstStep', alias: 'isFirstStep' },
    { method: 'isLastStep', alias: 'isLastStep' },
    { method: 'getActiveIndex', alias: 'activeIndex' },
    { method: 'getActiveStep', alias: 'activeStep' },
    { method: 'getPreviousStep', alias: 'previousStep' },
    { method: 'getActiveElement', alias: 'activeElement' },
    { method: 'getPreviousElement', alias: 'previousElement' },
    { method: 'isActive', alias: 'isActive' },
  ] as const

  type DriverComputedItem = typeof driverComputed[number]
  type DriverMethodReturnTypes = {
    [K in DriverComputedItem as K['alias']]: Ref<ReturnType<Driver[K['method']]> | null>
  }
  const driverRefs = driverComputed.reduce((acc, { method, alias }) => {
    const r = ref<ReturnType<Driver[typeof method]> | null>(null)
    watchEffect(() => {
      r.value = (driverInstance[method as keyof Driver] as () => unknown)?.()
    })
    return { ...acc, [alias]: r }
  }, {} as DriverMethodReturnTypes)

  if (!instance) {
    throw createError('useDriver must be called in a setup function')
  }

  onMounted(() => {
    options.steps = options.steps.map((step, idx) => {
      if (!isRef(step.element)) return step
      if (step.element.value === null) {
        console.warn(`Element in step index ${idx} is null after mount and will be skipped`)
      }
      return {
        ...step,
        element: step.element.value,
      }
    })
    driverInstance.setConfig(options as Config)
    if (options && options.autoRun) {
      driverInstance.drive()
    }
  }, instance)

  return {
    instance: driverInstance,
    ...driverRefs,
  }
}

// {
//   from: 'driver.js/dist/driver.css',
//     imports: ['default'],
//     }, {
//   from: 'driver.js',
//     type: true,
//       imports: ['Config', 'Driver'],
//     }
