<template>
  <div class="happy-wrapper">
    <picture class="bg">
      <source srcset="/happy_screen_mobile.png" media="(max-width: 599px)" />
      <source srcset="/happy_screen_ipad.png" media="(max-width: 1024px)" />
      <img src="/happy_screen.png" alt="Happy Screen" />
    </picture>
    
    <div class="happy-content">
      <div class="emoji-celebration">😄</div>
      <h1 class="happy-title">AI 100% Happy! 🎉</h1>
      <p class="happy-subtitle">Redirecting to restart the journey...</p>
      <div class="loading-indicator">
        <div class="spinner" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHumorStore } from '../stores/humor'

const router = useRouter()
const humorStore = useHumorStore()

onMounted(async () => {
  humorStore.setState('happy')

  // Redirect to /inicial after 5 seconds
  setTimeout(() => {
    humorStore.resetProgress()
    router.push('/inicial')
  }, 5000)
})
</script>

<style scoped>
.happy-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 9999;
  background: #000; /* Ensure black background behind image */
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.happy-content {
  position: relative;
  z-index: 10;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: clamp(1.5rem, 6vw, 3rem);
  border-radius: 20px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.emoji-celebration {
  font-size: clamp(4rem, 15vw, 8rem);
  margin-bottom: 1rem;
  animation: bounce 0.8s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.happy-title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  color: #ffd700;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.happy-subtitle {
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  color: rgba(255, 255, 255, 0.8);
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 215, 0, 0.3);
  border-top: 4px solid #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsividade */
@media (max-width: 599px) {
  .happy-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .emoji-celebration {
    font-size: 5rem;
  }

  .happy-title {
    font-size: 1.75rem;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .happy-content {
    padding: 2rem;
  }

  .emoji-celebration {
    font-size: 6rem;
  }

  .happy-title {
    font-size: 2.25rem;
  }
}

@media (min-width: 1024px) {
  .happy-content {
    padding: 3rem;
  }

  .emoji-celebration {
    font-size: 8rem;
  }

  .happy-title {
    font-size: 3rem;
  }
}
</style>
