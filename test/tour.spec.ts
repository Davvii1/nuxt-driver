import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import Tour from '../src/runtime/components/Tour.vue'

// Simple mock for driver.js
const mockDriver = {
  setConfig: vi.fn(),
  drive: vi.fn(),
  highlight: vi.fn(),
  getState: vi.fn(() => ({
    isInitialized: true,
    activeIndex: 0,
    activeStep: {},
    previousStep: undefined,
    activeElement: document.createElement('div'),
    previousElement: undefined,
  })),
  hasNextStep: vi.fn(() => true),
  hasPreviousStep: vi.fn(() => false),
  isLastStep: vi.fn(() => false),
}

vi.mock('driver.js', () => ({
  driver: vi.fn(() => mockDriver),
  default: { driver: vi.fn(() => mockDriver) },
}))

describe('Tour.vue', () => {
  const TestComponent = defineComponent({
    components: { Tour },
    template: `
      <Tour :steps="steps">
        <template #default="{ drive, highlight, isActive, hasNextStep, hasPreviousStep, isFirstStep, isLastStep, activeIndex, activeStep, previousStep, activeElement, previousElement }">
          <div>
            <button @click="() => drive()">Start Tour</button>
            <button @click="() => highlight({ element: '#test', popover: { title: 'Test' }})">Highlight</button>
            <div data-testid="state">
              {{ { isActive, hasNextStep, hasPreviousStep, isFirstStep, isLastStep, activeIndex, activeStep: !!activeStep, previousStep: !!previousStep, activeElement: !!activeElement, previousElement: !!previousElement } }}
            </div>
          </div>
        </template>
      </Tour>
    `,
    props: {
      steps: {
        type: Array,
        default: () => [
          { element: '#step1', popover: { title: 'Step 1' } },
          { element: '#step2', popover: { title: 'Step 2' } },
        ],
      },
    },
  })

  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('renders the default slot with tour controls', async () => {
    wrapper = mount(TestComponent)
    await nextTick()

    expect(wrapper.find('button').text()).toBe('Start Tour')
    expect(wrapper.find('[data-testid="state"]').exists()).toBe(true)
  })

  it('initializes driver with provided steps when drive is called', async () => {
    const steps = [
      { element: '#test1', popover: { title: 'Test 1' } },
      { element: '#test2', popover: { title: 'Test 2' } },
    ]

    wrapper = mount(TestComponent, {
      props: { steps },
    })

    await nextTick()

    // Verify the driver is not initialized yet
    expect(mockDriver.setConfig).not.toHaveBeenCalled()

    // Start the tour
    await wrapper.find('button').trigger('click')

    // Now the driver should be initialized with the correct steps
    expect(mockDriver.setConfig).toHaveBeenCalledTimes(1)
    const configArg = (mockDriver.setConfig as Mock).mock.calls[0][0] as {
      steps: Array<{
        element: string
        popover: { title: string }
      }>
    }
    expect(configArg.steps).toEqual(expect.arrayContaining([
      expect.objectContaining({ element: '#test1', popover: { title: 'Test 1' } }),
      expect.objectContaining({ element: '#test2', popover: { title: 'Test 2' } }),
    ]))
  })

  it('starts the tour when drive is called', async () => {
    wrapper = mount(TestComponent)
    await nextTick()

    await wrapper.find('button').trigger('click')
    expect(mockDriver.drive).toHaveBeenCalledWith(0)
  })

  it('highlights an element when highlight is called', async () => {
    wrapper = mount(TestComponent)
    await nextTick()

    const highlightButton = wrapper.findAll('button')[1]
    await highlightButton.trigger('click')
    expect(mockDriver.highlight).toHaveBeenCalledWith({
      element: '#test',
      popover: { title: 'Test' },
    })
  })

  it('collects steps from children when steps prop is not provided', async () => {
    const WrapperComponent = defineComponent({
      components: { Tour },
      template: `
        <Tour ref="tourRef">
          <div driver-step-popover='{"title":"Dynamic Step"}'></div>
          <div driver-step-popover='{"title":"Step 2"}' driver-step-order="1"></div>
          <button @click="startTour">Start Tour</button>
        </Tour>
      `,
      setup() {
        const tourRef = ref()
        const startTour = () => {
          tourRef.value.drive()
        }
        return { tourRef, startTour }
      },
    })

    wrapper = mount(WrapperComponent)
    await nextTick()

    // Verify the driver is not initialized yet
    expect(mockDriver.setConfig).not.toHaveBeenCalled()

    // Start the tour
    await wrapper.find('button').trigger('click')

    // Now the driver should be initialized with the collected steps
    expect(mockDriver.setConfig).toHaveBeenCalled()
    const configArg = (mockDriver.setConfig as Mock).mock.calls[0][0] as {
      steps: Array<{
        popover: { title: string }
      }>
    }
    expect(configArg.steps).toEqual(expect.arrayContaining([
      expect.objectContaining({ popover: { title: 'Dynamic Step' } }),
      expect.objectContaining({ popover: { title: 'Step 2' } }),
    ]))
  })

  it('exposes driver instance via template ref', async () => {
    const WrapperComponent = defineComponent({
      components: { Tour },
      template: `
        <div>
          <Tour :steps="steps" ref="tourRef">
            <button @click="() => tourRef.drive()">Start</button>
          </Tour>
        </div>
      `,
      setup() {
        const tourRef = ref()
        return {
          tourRef,
          steps: [{ element: '#test', popover: { title: 'Test' } }],
        }
      },
    })

    wrapper = mount(WrapperComponent)
    await nextTick()

    await wrapper.find('button').trigger('click')
    expect(mockDriver.drive).toHaveBeenCalled()
  })
})
