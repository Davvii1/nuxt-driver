<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div ref="tour-root">
    <h1 v-step:1="{ title: 'Step 1', description: 'Description' }">
      DriverJS Tour 1
    </h1>
    <h1 v-step:2="{ title: 'Step 2', description: 'Description' }">
      DriverJS Tour 2
    </h1>
    <h1 v-step:4="{ title: 'Step 3', description: 'Description' }">
      DriverJS Tour 3
    </h1>
    <h1 v-step:3="{ title: 'Step 4', description: 'Description' }">
      DriverJS Tour 4
    </h1>
    <h1>
      DriverJS Tour 5
    </h1>
    <slot :drive="() => driverInstance.drive()" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, ref, isRef } from 'vue'
import type { Popover } from 'driver.js'
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

const driverProps = Object.fromEntries(Object.entries(props).filter(([_, v]) => v !== undefined))
const driverInstance = useDriver({ ...driverProps, steps })

defineExpose({ ...driverInstance })
defineSlots<{
  default(props: { drive: () => void }): void
}>()
</script>
