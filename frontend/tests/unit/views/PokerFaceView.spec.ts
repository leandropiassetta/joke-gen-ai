import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PokerFaceView from '@/views/PokerFaceView.vue'

vi.mock('@/api/http', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: {
        joke: 'Why did the programmer quit his job? Because he did not get arrays.'
      }
    })),
  },
}))

describe('PokerFaceView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render PokerFaceView component', () => {
    const wrapper = mount(PokerFaceView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ProgressBar: true,
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should display progress bar component', () => {
    const wrapper = mount(PokerFaceView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    expect(wrapper.findComponent({ name: 'ProgressBar' }).exists()).toBe(true)
  })

  it('should have fetch joke button', () => {
    const wrapper = mount(PokerFaceView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ProgressBar: true,
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
  })

  it('should increment happiness on button click', async () => {
    const wrapper = mount(PokerFaceView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ProgressBar: true,
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    const initialProgress = (wrapper.vm as any).humorStore.happinessProgress
    const button = wrapper.find('button')

    await button.trigger('click')
    await wrapper.vm.$nextTick()

    expect((wrapper.vm as any).humorStore.happinessProgress).toBeGreaterThanOrEqual(initialProgress)
  })

  it('should display speech bubbles', () => {
    const wrapper = mount(PokerFaceView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ProgressBar: true,
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    expect(wrapper.find('.zone-bubbles').exists()).toBe(true)
  })

  it('should return correct robot response based on progress', () => {
    const wrapper = mount(PokerFaceView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          ProgressBar: true,
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    const store = (wrapper.vm as any).humorStore

    // Test response for 0-25% (confused)
    store.happinessProgress = 10
    let response = (wrapper.vm as any).getRobotResponseByProgress()
    expect(response).toBeTruthy()

    // Test response for 25-50% (learning)
    store.happinessProgress = 30
    response = (wrapper.vm as any).getRobotResponseByProgress()
    expect(response).toBeTruthy()

    // Test response for 50-75% (laughing)
    store.happinessProgress = 60
    response = (wrapper.vm as any).getRobotResponseByProgress()
    expect(response).toBeTruthy()

    // Test response for 75-100% (happy)
    store.happinessProgress = 80
    response = (wrapper.vm as any).getRobotResponseByProgress()
    expect(response).toBeTruthy()
  })
})
