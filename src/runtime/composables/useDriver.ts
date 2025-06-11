import { driver } from 'driver.js'
import type { Config, DriveStep, State } from 'driver.js'
import 'driver.js/dist/driver.css'
import { getCurrentInstance, isRef, ref, unref } from 'vue'
import type { Ref } from 'vue'
import { createError } from '#app'

export type ExtendedDriveStep = Omit<DriveStep, 'element'> & {
  element: string | Element | (() => Element) | Ref<HTMLElement | null> | null
}

export type UseDriverOptions = Omit<Config, 'steps'> & {
  autoRun?: boolean
  steps?: ExtendedDriveStep[] | Ref<ExtendedDriveStep[]>
}

let interval: ReturnType<typeof setInterval> | null = null

const initialState = {
  state: {},
  isActive: false,
  hasNextStep: false,
  hasPreviousStep: false,
  isFirstStep: false,
  isLastStep: false,
  activeIndex: undefined as number | undefined,
  activeStep: undefined as DriveStep | undefined,
  previousStep: undefined as DriveStep | undefined,
  activeElement: undefined as Element | undefined,
  previousElement: undefined as Element | undefined,
}

export default function useDriver(options: UseDriverOptions) {
  const driverJS = driver()

  const state = ref<State>({ ...initialState.state })
  const isActive = ref(initialState.isActive)
  const hasNextStep = ref(initialState.hasNextStep)
  const hasPreviousStep = ref(initialState.hasPreviousStep)
  const isFirstStep = ref(initialState.isFirstStep)
  const isLastStep = ref(initialState.isLastStep)
  const activeIndex = ref<number | undefined>(initialState.activeIndex)
  const activeStep = ref<DriveStep | undefined>(initialState.activeStep)
  const previousStep = ref<DriveStep | undefined>(initialState.previousStep)
  const activeElement = ref<Element | undefined>(initialState.activeElement)
  const previousElement = ref<Element | undefined>(initialState.previousElement)

  const resetState = () => {
    state.value = { ...initialState.state }
    isActive.value = initialState.isActive
    hasNextStep.value = initialState.hasNextStep
    hasPreviousStep.value = initialState.hasPreviousStep
    isFirstStep.value = initialState.isFirstStep
    isLastStep.value = initialState.isLastStep
    activeIndex.value = initialState.activeIndex
    activeStep.value = initialState.activeStep
    previousStep.value = initialState.previousStep
    activeElement.value = initialState.activeElement
    previousElement.value = initialState.previousElement
  }

  const instance = getCurrentInstance()
  if (!instance) {
    throw createError('useDriver must be called within a component setup function')
  }

  function resolveSteps(steps: UseDriverOptions['steps']) {
    const stepsArray = unref(steps)
    if (!stepsArray) return []
    return stepsArray.map((step, idx) => {
      if (!isRef(step.element)) return step
      if (step.element.value === null) {
        console.warn(`Element in step index ${idx} is null after mount and will be skipped`)
      }
      return {
        ...step,
        element: step.element.value,
      }
    })
  }

  const startPolling = () => {
    interval = setInterval(() => {
      state.value = driverJS.getState()
      isActive.value = state.value.isInitialized || false
      activeIndex.value = state.value.activeIndex
      hasNextStep.value = driverJS.hasNextStep()
      hasPreviousStep.value = driverJS.hasPreviousStep()
      isFirstStep.value = activeIndex.value === 0
      isLastStep.value = driverJS.isLastStep()
      activeStep.value = state.value.activeStep
      previousStep.value = state.value.previousStep
      activeElement.value = state.value.activeElement
      previousElement.value = state.value.previousElement
    }, 200)
  }

  const stopPolling = () => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  const drive = (stepIndex: number = 0) => {
    startPolling()
    const { onDestroyed, ...rest } = options
    driverJS.setConfig({
      ...rest,
      steps: resolveSteps(options.steps) as DriveStep[],
      onDestroyed: (element, step, options) => {
        stopPolling()
        resetState()
        onDestroyed?.(element, step, options)
      },
    })
    driverJS.drive(stepIndex)
  }

  const highlight = (step: ExtendedDriveStep) => {
    const stepElement = unref(step.element)
    if (!stepElement) return console.warn(`Element in highlight is null`)
    driverJS.highlight({ element: stepElement, popover: step.popover })
  }

  return {
    drive,
    highlight,
    state,
    isActive,
    hasNextStep,
    hasPreviousStep,
    isFirstStep,
    isLastStep,
    activeIndex,
    activeStep,
    previousStep,
    activeElement,
    previousElement,
  }
}
