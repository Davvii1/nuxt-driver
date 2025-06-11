<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div ref="tour-root">
    <slot
      v-bind="{
        drive: driverInstance.drive,
        highlight: driverInstance.highlight,
        state: driverInstance.state.value,
        isActive: driverInstance.isActive.value,
        hasNextStep: driverInstance.hasNextStep.value,
        hasPreviousStep: driverInstance.hasPreviousStep.value,
        isFirstStep: driverInstance.isFirstStep.value,
        isLastStep: driverInstance.isLastStep.value,
        activeIndex: driverInstance.activeIndex.value,
        activeStep: driverInstance.activeStep.value,
        previousStep: driverInstance.previousStep.value,
        activeElement: driverInstance.activeElement.value,
        previousElement: driverInstance.previousElement.value,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, ref, isRef, useAttrs } from 'vue'
import type { DriveStep, Popover, State } from 'driver.js'
import 'driver.js/dist/driver.css'
import useDriver from '../composables/useDriver'
import type { ExtendedDriveStep, UseDriverOptions } from '../composables/useDriver'

const props = defineProps<UseDriverOptions>()
const steps = ref<ExtendedDriveStep[]>([])
const tourRoot = useTemplateRef('tour-root')

onMounted(() => {
  if (props.steps) {
    steps.value = isRef(props.steps) ? props.steps.value : props.steps
    return
  }
  if (!tourRoot.value) return
  const mapped = Array.from(tourRoot.value.children).map((child) => {
    const attributes = child.attributes
    const stepAttr = attributes.getNamedItem('driver-step-popover')
    const stepOrderAttr = attributes.getNamedItem('driver-step-order')
    if (!stepAttr) return null
    const stepData = JSON.parse(stepAttr.value)
    const order = stepOrderAttr ? Number(stepOrderAttr.value) : undefined
    return {
      element: child,
      popover: stepData,
      _order: order,
    }
  }).filter((step): step is { element: Element, popover: Popover, _order: number | undefined } => step !== null)
    .sort((a, b) => {
      if (a._order === undefined && b._order === undefined) return 0
      if (a._order === undefined) return 1
      if (b._order === undefined) return -1
      return a._order - b._order
    })
    .map(({ _order, ...rest }) => rest)

  steps.value = mapped
})

const attrs = useAttrs()
const driverProps = Object.fromEntries(
  Object.entries(props).filter(([key]) => key in attrs),
)
const driverInstance = useDriver({ ...driverProps, steps })

defineExpose({ ...driverInstance })

type SlotProps = {
  drive: (stepIndex?: number) => void
  highlight: (step: ExtendedDriveStep) => void
  state: State
  isActive: boolean
  hasNextStep: boolean
  hasPreviousStep: boolean
  isFirstStep: boolean
  isLastStep: boolean
  activeIndex: number | undefined
  activeStep: DriveStep | undefined
  previousStep: DriveStep | undefined
  activeElement: Element | undefined
  previousElement: Element | undefined
}

type Slots = {
  default: (props: SlotProps) => unknown
}

defineSlots<Slots>()
</script>
