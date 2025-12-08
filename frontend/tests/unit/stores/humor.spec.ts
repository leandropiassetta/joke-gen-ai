import { describe, it, expect, beforeEach } from 'vitest'
import { useHumorStore } from '@/stores/humor'
import { setActivePinia, createPinia } from 'pinia'

describe('useHumorStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with 0% happiness', () => {
    const store = useHumorStore()
    expect(store.happinessProgress).toBe(0)
    expect(store.isFull).toBe(false)
  })

  it('should increment happiness by 25%', () => {
    const store = useHumorStore()

    store.incrementHappiness()
    expect(store.happinessProgress).toBe(25)

    store.incrementHappiness()
    expect(store.happinessProgress).toBe(50)

    store.incrementHappiness()
    expect(store.happinessProgress).toBe(75)

    store.incrementHappiness()
    expect(store.happinessProgress).toBe(100)
  })

  it('should set isFull to true when happiness reaches 100%', () => {
    const store = useHumorStore()

    expect(store.isFull).toBe(false)

    store.incrementHappiness()
    store.incrementHappiness()
    store.incrementHappiness()
    store.incrementHappiness()

    expect(store.happinessProgress).toBe(100)
    expect(store.isFull).toBe(true)
  })

  it('should reset progress to 0%', () => {
    const store = useHumorStore()

    store.incrementHappiness()
    store.incrementHappiness()
    expect(store.happinessProgress).toBe(50)

    store.resetProgress()

    expect(store.happinessProgress).toBe(0)
    expect(store.isFull).toBe(false)
  })

  it('should set current state', () => {
    const store = useHumorStore()

    store.setState('poker-face')
    expect(store.currentState).toBe('poker-face')

    store.setState('happy')
    expect(store.currentState).toBe('happy')
  })

  it('should not increment beyond 100%', () => {
    const store = useHumorStore()

    for (let i = 0; i < 10; i++) {
      store.incrementHappiness()
    }

    expect(store.happinessProgress).toBeLessThanOrEqual(100)
  })
})
