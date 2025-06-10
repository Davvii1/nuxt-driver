import type { DirectiveBinding } from 'vue'
import { driver, type Popover } from 'driver.js'
import { defineNuxtPlugin } from '#app'

interface HighlightDirectiveValue extends Popover {
  active?: boolean
}

export default defineNuxtPlugin((nuxtApp) => {
  const { highlight } = driver()

  const highlightFn = (el: HTMLElement, binding: DirectiveBinding<HighlightDirectiveValue>) => {
    if (binding.value.active === false) return
    highlight({ element: el, popover: binding.value })
  }

  nuxtApp.vueApp.directive('highlight', {
    mounted(el: HTMLElement, binding: DirectiveBinding<HighlightDirectiveValue>) {
      highlightFn(el, binding)
    },
    updated(el: HTMLElement, binding: DirectiveBinding<HighlightDirectiveValue>) {
      highlightFn(el, binding)
    },
    getSSRProps() { return {} },
  })
})
