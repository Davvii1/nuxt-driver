import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'

interface BindingValue {
  active?: boolean
  title?: string
  [key: string]: unknown
}

interface Binding {
  value: BindingValue
  arg?: string | number
}

type DirectiveHook = (el: HTMLElement, binding: Binding) => void

interface DirectiveOptions {
  mounted?: DirectiveHook
  updated?: DirectiveHook
}

interface App {
  directive: (name: string, directive: DirectiveOptions) => void
}

const mockHighlight = vi.fn()
const mockDriver = vi.fn(() => ({
  highlight: mockHighlight,
  getHighlightedElement: vi.fn(),
  refresh: vi.fn(),
  hasHighlightedElement: vi.fn(),
  destroy: vi.fn(),
}))

vi.mock('driver.js', () => ({
  driver: () => mockDriver(),
  default: { driver: mockDriver },
}))

function createTestApp() {
  const plugin = {
    install: (app: App) => {
      app.directive('step', {
        mounted: (el: HTMLElement, binding: Binding) => {
          el.setAttribute('driver-step-popover', JSON.stringify(binding.value))
          if (binding.arg !== undefined) {
            const isNumber = !Number.isNaN(Number(binding.arg))
            if (isNumber) {
              el.setAttribute('driver-step-order', String(binding.arg))
            }
            else {
              console.warn(`Invalid step order ${binding.arg}, not a number`)
            }
          }
        },
      })

      app.directive('highlight', {
        mounted: (el: HTMLElement, binding) => {
          if (binding.value.active !== false) {
            mockHighlight({ element: el, popover: binding.value })
          }
        },
        updated: (el: HTMLElement, binding) => {
          if (binding.value.active !== false) {
            mockHighlight({ element: el, popover: binding.value })
          }
        },
      })
    },
  }

  return { plugin }
}

describe('Directives', () => {
  let testApp: ReturnType<typeof createTestApp>

  beforeEach(() => {
    vi.clearAllMocks()
    testApp = createTestApp()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('v-step', () => {
    it('should set driver-step-popover attribute with value', async () => {
      const TestComponent = defineComponent({
        template: '<div v-step="{ title: \'Test\' }"></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [testApp.plugin],
        },
      })

      await nextTick()

      const div = wrapper.find('div')
      expect(div.attributes('driver-step-popover')).toBe('{"title":"Test"}')
      expect(div.attributes('driver-step-order')).toBeUndefined()
    })

    it('should set driver-step-order when arg is a number', async () => {
      const TestComponent = defineComponent({
        template: '<div v-step:2="{ title: \'Test\' }"></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [testApp.plugin],
        },
      })

      await nextTick()

      const div = wrapper.find('div')
      expect(div.attributes('driver-step-order')).toBe('2')
    })

    it('should not set driver-step-order when arg is not a number', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

      const TestComponent = defineComponent({
        template: '<div v-step:abc="{ title: \'Test\' }"></div>',
      })

      mount(TestComponent, {
        global: {
          plugins: [testApp.plugin],
        },
      })

      await nextTick()

      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid step order abc, not a number')
      consoleWarnSpy.mockRestore()
    })
  })

  describe('v-highlight', () => {
    it('should call driver().highlight when mounted with default options', async () => {
      const TestComponent = defineComponent({
        template: '<div v-highlight="{ title: \'Test\' }"></div>',
      })

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [testApp.plugin],
        },
      })

      await nextTick()

      expect(mockHighlight).toHaveBeenCalledWith({
        element: wrapper.find('div').element,
        popover: { title: 'Test' },
      })
    })

    it('should not call highlight when active is false', async () => {
      const TestComponent = defineComponent({
        template: '<div v-highlight="{ title: \'Test\', active: false }"></div>',
      })

      mount(TestComponent, {
        global: {
          plugins: [testApp.plugin],
        },
      })

      await nextTick()

      expect(mockHighlight).not.toHaveBeenCalled()
    })
  })
})
