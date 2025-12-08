<template>
  <div class="happiness-container">
    <div class="happiness-label">
      <span class="label-text">AI Happiness</span>
      <span class="progress-text">{{ progress }}%</span>
    </div>
    <div class="happiness-bar-wrapper">
      <div class="happiness-bar">
        <div 
          class="happiness-fill" 
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0
})

const progress = computed(() => Math.min(Math.max(props.progress, 0), 100))
</script>

<style scoped>
.happiness-container {
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.happiness-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  color: #ffffff;
}

.label-text {
  letter-spacing: 0.5px;
}

.progress-text {
  font-weight: 700;
  color: #ffd700;
}

.happiness-bar-wrapper {
  width: 100%;
  height: auto;
}

.happiness-bar {
  width: 100%;
  height: clamp(8px, 2vw, 16px);
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.happiness-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ffd700, #4ecdc4);
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

/* Mobile: ≤599px */
@media (max-width: 599px) {
  .happiness-container {
    padding: 0.75rem;
  }

  .happiness-label {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .happiness-bar {
    height: 8px;
  }
}

/* Tablet: 600-1023px */
@media (min-width: 600px) and (max-width: 1023px) {
  .happiness-container {
    padding: 1rem;
  }

  .happiness-label {
    font-size: 1rem;
  }

  .happiness-bar {
    height: 12px;
  }
}

/* Desktop: >1024px */
@media (min-width: 1024px) {
  .happiness-container {
    padding: 1.25rem;
  }

  .happiness-label {
    font-size: 1.125rem;
  }

  .happiness-bar {
    height: 16px;
  }
}
</style>
