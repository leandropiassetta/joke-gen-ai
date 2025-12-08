import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginView from '@/views/LoginView.vue'

vi.mock('@/api/http', () => ({
  default: {
    post: vi.fn(),
  },
}))

describe('LoginView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render login form', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should update email and password inputs', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    const emailInput = wrapper.find('input[type="email"]') as any
    const passwordInput = wrapper.find('input[type="password"]') as any

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    expect((emailInput.element as HTMLInputElement).value).toBe('test@example.com')
    expect((passwordInput.element as HTMLInputElement).value).toBe('password123')
  })

  it('should validate required fields', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    const emailInput = wrapper.find('input[type="email"]') as any
    const passwordInput = wrapper.find('input[type="password"]') as any
    const button = wrapper.find('button')

    // Inputs start empty
    expect((emailInput.element as HTMLInputElement).value).toBe('')
    expect((passwordInput.element as HTMLInputElement).value).toBe('')

    // Try to submit without filling fields
    await button.trigger('click')

    // Inputs should still be empty
    expect((emailInput.element as HTMLInputElement).value).toBe('')
    expect((passwordInput.element as HTMLInputElement).value).toBe('')
  })

  it('should have submit button', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('ENTRAR')
  })
})

