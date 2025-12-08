<template>
  <div class="full-screen-button">
    <button class="image-button" @click="goToPokerFace">
      <picture>
        <source srcset="/sad_screen_mobile.png" media="(max-width: 599px)" />
        <source srcset="/sad_screen_ipad.png" media="(max-width: 1024px)" />
        <img src="/sad_screen.jpeg" alt="Go to Poker Face" />
      </picture>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHumorStore } from '../stores/humor'

const router = useRouter()
const humorStore = useHumorStore()

function goToPokerFace() {
  humorStore.setState('sad')
  router.push('/poker-face')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.full-screen-button {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-button {
  width: 100%;
  height: 100%;
  border: none;
  padding: 0;
  cursor: pointer;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: opacity 0.3s ease;
}

.image-button:hover {
  opacity: 0.9;
}

.image-button:active {
  opacity: 0.8;
}

.image-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-button picture {
  display: flex;
  width: 100%;
  height: 100%;
}

.image-button picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Responsividade */
@media (max-width: 599px) {
  .full-screen-button {
    height: 100dvh; /* 100% dynamic viewport height para mobile */
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .full-screen-button {
    height: 100vh;
  }
}

@media (min-width: 1024px) {
  .full-screen-button {
    height: 100vh;
  }
}
</style>
