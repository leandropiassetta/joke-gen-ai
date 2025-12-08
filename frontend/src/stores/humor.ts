import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type HumorState = 'initial' | 'sad' | 'poker-face' | 'happy'

export const useHumorStore = defineStore('humor', () => {
  // State
  const currentState = ref<HumorState>('initial')
  const happinessProgress = ref(0)
  const currentJoke = ref<string | null>(null)
  const jokeCount = ref(0)

  // Getters
  const isFull = computed(() => happinessProgress.value >= 100)

  // Actions
  function setState(state: HumorState) {
    currentState.value = state
  }

  function setJoke(joke: string) {
    currentJoke.value = joke
    jokeCount.value += 1
  }

  function incrementHappiness(amount: number = 25) {
    const newProgress = Math.min(happinessProgress.value + amount, 100)
    happinessProgress.value = newProgress
  }

  function reset() {
    currentState.value = 'initial'
    happinessProgress.value = 0
    currentJoke.value = null
    jokeCount.value = 0
  }

  function resetProgress() {
    happinessProgress.value = 0
    currentJoke.value = null
    jokeCount.value = 0
  }

  return {
    // State
    currentState,
    happinessProgress,
    currentJoke,
    jokeCount,

    // Getters
    isFull,

    // Actions
    setState,
    setJoke,
    incrementHappiness,
    reset,
    resetProgress
  }
})
