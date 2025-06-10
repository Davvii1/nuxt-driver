import type { DirectiveBinding } from 'vue'
import type { Popover } from 'driver.js'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('step', {
    mounted(el: HTMLElement, binding: DirectiveBinding<Popover>) {
      el.setAttribute('driver-step-popover', JSON.stringify(binding.value))
      const hasArg = binding.arg !== undefined
      const isArgNumber = !Number.isNaN(Number(binding.arg))
      if (!hasArg) return
      if (!isArgNumber) return console.warn(`Invalid step order ${binding.arg}, not a number`)
      el.setAttribute('driver-step-order', String(binding.arg))
    },
    getSSRProps() { return {} },
  })
})
