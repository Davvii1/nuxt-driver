import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import useDriver from '../src/runtime/composables/useDriver'

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>()
  return {
    ...actual,
    getCurrentInstance: vi.fn(),
  } as typeof actual
})

vi.mock('#app', () => ({
  createError: vi.fn((msg: string) => new Error(msg)),
}))

const mockDriverInstance = {
  setConfig: vi.fn(),
  drive: vi.fn(),
  highlight: vi.fn(),
  getState: vi.fn(),
  hasNextStep: vi.fn(),
  hasPreviousStep: vi.fn(),
  isLastStep: vi.fn(),
  isFirstStep: vi.fn(),
}

vi.mock('driver.js', () => ({
  driver: vi.fn(() => mockDriverInstance),
}))

describe('useDriver', () => {
  let driver: ReturnType<typeof useDriver>
  let mockGetCurrentInstance: ReturnType<typeof vi.fn>

  beforeAll(async () => {
    const vue = await import('vue')
    mockGetCurrentInstance = vue.getCurrentInstance as ReturnType<typeof vi.fn>
  })

  beforeEach(() => {
    mockGetCurrentInstance.mockReturnValue({})
    document.body.innerHTML = `
      <div id="test-element">Test Element</div>
    `
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    driver = useDriver({})
    expect(driver.state.value).toEqual({})
    expect(driver.isActive.value).toBe(false)
    expect(driver.hasNextStep.value).toBe(false)
    expect(driver.hasPreviousStep.value).toBe(false)
    expect(driver.isFirstStep.value).toBe(false)
    expect(driver.isLastStep.value).toBe(false)
    expect(driver.activeIndex.value).toBeUndefined()
    expect(driver.activeStep.value).toBeUndefined()
    expect(driver.previousStep.value).toBeUndefined()
    expect(driver.activeElement.value).toBeUndefined()
    expect(driver.previousElement.value).toBeUndefined()
  })

  it('should update refs when driver state changes', async () => {
    const activeEl = document.createElement('div')
    const previousEl = document.createElement('div')

    const testState = {
      activeIndex: 1,
      activeStep: { element: '#test', popover: { title: 'Test' } },
      previousStep: { element: '#previous', popover: { title: 'Previous' } },
      activeElement: activeEl,
      previousElement: previousEl,
      isInitialized: true,
    }

    mockDriverInstance.getState.mockReturnValue(testState)
    mockDriverInstance.hasNextStep.mockReturnValue(true)
    mockDriverInstance.hasPreviousStep.mockReturnValue(false)
    mockDriverInstance.isLastStep.mockReturnValue(false)
    mockDriverInstance.isFirstStep = vi.fn(() => false)

    type PollingCallback = () => void
    let pollingCallback: PollingCallback | null = null

    const originalSetInterval = global.setInterval

    const mockSetInterval = vi.fn()
    mockSetInterval.mockImplementation((callback: TimerHandler) => {
      pollingCallback = callback as PollingCallback
      return 123 as unknown as NodeJS.Timeout
    })

    global.setInterval = mockSetInterval as typeof setInterval

    const driver = useDriver({
      steps: [
        { element: '#test', popover: { title: 'Test' } },
        { element: '#test2', popover: { title: 'Test 2' } },
      ],
    })

    mockDriverInstance.drive = vi.fn((index) => {
      const updatedState = {
        ...testState,
        activeIndex: index,
        isInitialized: true,
      }

      mockDriverInstance.getState.mockReturnValue(updatedState)

      if (pollingCallback) {
        pollingCallback()
      }

      return mockDriverInstance
    })

    expect(driver.isActive.value).toBe(false)

    driver.drive(1)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(driver.isActive.value).toBe(true)
    expect(driver.hasNextStep.value).toBe(true)
    expect(driver.hasPreviousStep.value).toBe(false)
    expect(driver.isFirstStep.value).toBe(false)
    expect(driver.isLastStep.value).toBe(false)
    expect(driver.activeIndex.value).toBe(1)
    expect(driver.activeStep.value).toEqual(testState.activeStep)
    expect(driver.previousStep.value).toEqual(testState.previousStep)
    expect(driver.activeElement.value).toBe(testState.activeElement)
    expect(driver.previousElement.value).toBe(testState.previousElement)

    global.setInterval = originalSetInterval
  })

  it('should call drive with the correct step index', () => {
    const { drive } = useDriver({})
    drive(1)
    expect(mockDriverInstance.drive).toHaveBeenCalledWith(1)
  })

  it('should call drive without a step index', () => {
    const { drive } = useDriver({})
    drive()
    expect(mockDriverInstance.drive).toHaveBeenCalled()
  })

  it('should call highlight with the correct element', () => {
    const { highlight } = useDriver({})
    const element = document.getElementById('test-element')
    if (!element) throw new Error('Test element not found')

    highlight({ element })

    expect(mockDriverInstance.highlight).toHaveBeenCalledWith({
      element,
      popover: undefined,
    })
  })

  it('should throw an error when not used in a component setup', () => {
    mockGetCurrentInstance.mockReturnValueOnce(null)
    expect(() => useDriver({})).toThrow(
      'useDriver must be called within a component setup function',
    )
  })

  it('should handle null element in steps gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { drive } = useDriver({
      steps: [
        { element: null, popover: { title: 'Null element step' } },
      ],
    })

    expect(() => drive(0)).not.toThrow()
    expect(mockDriverInstance.drive).toHaveBeenCalledWith(0)
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Element in step index 0 is null after mount and will be skipped'),
    )

    consoleWarnSpy.mockRestore()
  })
})
