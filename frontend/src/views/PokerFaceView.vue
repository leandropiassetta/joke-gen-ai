<template>
  <div class="poker-face-wrapper">
    <!-- Background Image -->
    <picture class="bg">
      <source srcset="/poker_face_screen_mobile.png" media="(max-width: 599px)" />
      <source srcset="/pokerface_screen_ipad.png" media="(max-width: 1024px)" />
      <img src="/pokerface_screen.jpeg" alt="Poker Face Scene" />
    </picture>

    <!-- PROGRESS BAR INDEPENDENTE (Canto Superior Direito) -->
    <ProgressBarComponent :progress="humorStore.happinessProgress" />

    <!-- ZONA CENTRAL: BALÕES DE CONVERSA -->
    <div class="zone-bubbles" ref="jokesContainer">
      <!-- Balão inicial do humorista -->
      <div v-if="showInitialBubble && !currentJoke" class="bubble-wrapper bubble-left">
        <div class="bubble bubble-human">
          {{ initialMessage }}
        </div>
      </div>

      <!-- Resposta do robô inicial -->
      <div v-if="showRobotResponse && !currentJoke" class="bubble-wrapper bubble-right">
        <div class="bubble bubble-robot">
          {{ robotResponse }}
        </div>
      </div>

      <!-- Piada ATUAL (uma por vez) -->
      <div v-if="currentJoke" class="bubble-wrapper bubble-left">
        <div class="bubble bubble-human">
          {{ currentJoke.text }}
        </div>
      </div>

      <!-- Resposta do robô para piada atual -->
      <div v-if="currentJoke && showCurrentResponse" class="bubble-wrapper bubble-right">
        <div class="bubble bubble-robot">
          {{ currentRobotResponse }}
        </div>
      </div>

      <!-- Mensagem de 100% felicidade -->
      <div v-if="humorStore.isFull" class="bubble-wrapper bubble-celebration">
        <div class="bubble bubble-celebration">
          <p class="celebration-text">🎉 You made me 100% Happy! 🎉</p>
        </div>
      </div>
    </div>

    <!-- ZONA 3: BOTÃO E ESPAÇO INFERIOR -->
    <div v-if="!humorStore.isFull" class="zone-button">
      <button
        class="btn-next-joke"
        @click="fetchNextJoke"
        :disabled="loading"
        aria-label="Fetch next joke"
      >
        {{ loading ? "Loading..." : "Tell Me Another Joke!" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useHumorStore } from "../stores/humor";
import http from "../api/http";
import ProgressBarComponent from "../components/ProgressBarComponent.vue";

const router = useRouter();
const humorStore = useHumorStore();
const jokesContainer = ref<HTMLElement | null>(null);

// State
const loading = ref(false);
const showInitialBubble = ref(false);
const showRobotResponse = ref(false);
const currentJoke = ref<{ text: string } | null>(null);
const showCurrentResponse = ref(false);
const currentRobotResponse = ref("");
const initialMessage = ref(
  "I've come to tell you some jokes and make you happier, AI!"
);
const robotResponse = ref(
  "Oh really? I'm ready... let's see if you can make me laugh! 🤖"
);

// Respostas do robô conforme progresso de felicidade
const robotResponsesByProgress = {
  // 0-25%: confuso, não entende
  confused: [
    "Hmmm... I don't quite get it. Can you explain?",
    "Error 404: Humor not found. Tell me another?",
    "I'm still learning... more jokes please!",
    "That's... interesting? I think? More please!",
    "I don't understand, but I'll keep trying!",
  ],
  // 25-50%: começa a entender
  learning: [
    "Oh! I think I'm starting to get it!",
    "That one made more sense. Nice!",
    "Haha... I think? Tell me another!",
    "Getting warmer! More jokes, please!",
    "I'm learning! Keep them coming!",
  ],
  // 50-75%: ri e pede mais
  laughing: [
    "Haha! That was funny! 😄",
    "Now THAT'S a good one!",
    "You're making me laugh! More!",
    "Excellent! Tell me another!",
    "I like this! Keep going!",
  ],
  // 75-100%: muito feliz
  happy: [
    "This is amazing! I LOVE jokes now! 🎉",
    "You're hilarious! More, more, more!",
    "I'm having the best time ever!",
    "These jokes are incredible!",
    "You've made me the happiest AI alive!",
  ],
};

function getRobotResponseByProgress(jokeIndex: number): string {
  const progress = humorStore.happinessProgress;
  let responseList: string[] = [];

  if (progress <= 25) {
    responseList = robotResponsesByProgress.confused;
  } else if (progress <= 50) {
    responseList = robotResponsesByProgress.learning;
  } else if (progress <= 75) {
    responseList = robotResponsesByProgress.laughing;
  } else {
    responseList = robotResponsesByProgress.happy;
  }

  const selectedResponse = responseList[jokeIndex % responseList.length];
  return selectedResponse || "That's interesting!";
}

async function initializeConversation() {
  showInitialBubble.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  showRobotResponse.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await scrollToBottom();
}

async function scrollToBottom() {
  await nextTick();
  if (jokesContainer.value) {
    jokesContainer.value.scrollTop = jokesContainer.value.scrollHeight;
  }
}

async function fetchJoke() {
  loading.value = true;

  try {
    const response = await http.get("/joke");
    const newJoke = { text: response.data.joke };

    // Mostrar piada
    currentJoke.value = newJoke;
    showCurrentResponse.value = false;
    await scrollToBottom();
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mostrar resposta do robô
    const jokeIndex = Math.floor(humorStore.happinessProgress / 25);
    currentRobotResponse.value = getRobotResponseByProgress(jokeIndex);
    showCurrentResponse.value = true;
    await scrollToBottom();
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Incrementar felicidade
    humorStore.incrementHappiness();

    // Não limpar balões para que o usuário possa ler
    // currentJoke.value = null;
    // showCurrentResponse.value = false;

    if (humorStore.isFull) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await router.push("/feliz");
    }
  } catch (error) {
    console.error("Error fetching joke:", error);
  } finally {
    loading.value = false;
  }
}

async function fetchNextJoke() {
  await fetchJoke();
}

onMounted(async () => {
  humorStore.setState("poker-face");
  await initializeConversation();
});
</script>

<style scoped>
/* ============================================
   ROOT CONTAINER (100vh fullscreen)
   ============================================ */
.poker-face-wrapper {
  position: fixed; /* Changed from relative to fixed to prevent scrolling issues */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile browsers */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #000;
  margin: 0;
  padding: 0;
}

/* Background image (lowest z-index) */
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
}

.bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Mobile Background Adjustment */
@media (max-width: 599px) {
  .bg img {
    object-position: 65% center; /* Shift view to the right to show robot */
  }
}

/* ============================================
   ZONA CENTRAL: BALÕES DE CONVERSA (Scrollável)
   ============================================ */
.zone-bubbles {
  position: relative;
  z-index: 50;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(1.5rem, 4vw, 2.5rem) clamp(0.75rem, 3vw, 1.5rem);
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Push bubbles to the bottom */
  gap: clamp(1rem, 2vw, 1.5rem);
  scroll-behavior: smooth;
}

/* Custom scrollbar */
.zone-bubbles::-webkit-scrollbar {
  width: 8px;
}

.zone-bubbles::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.zone-bubbles::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 4px;
}

.zone-bubbles::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.6);
}

/* Wrapper para cada balão */
.bubble-wrapper {
  display: flex;
  animation: fadeInBubble 0.4s ease-in-out;
}

@keyframes fadeInBubble {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bubble-left {
  justify-content: flex-start;
}

.bubble-right {
  justify-content: flex-end;
}

.bubble-celebration {
  justify-content: center;
}

/* Estilo base dos balões */
.bubble {
  background: rgba(255, 255, 255, 0.95);
  border-radius: clamp(16px, 4vw, 24px);
  padding: clamp(1rem, 2.5vw, 1.5rem);
  max-width: clamp(70%, 85%, 100%);
  word-wrap: break-word;
  line-height: 1.6;
  color: #222;
  font-size: clamp(0.875rem, 2vw, 1rem);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.9);
  position: relative;
}

/* Balão do humorista (esquerda - branco) */
.bubble-human {
  position: absolute;
  bottom: 630px;
  left: 20px;
  max-width: 60%;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.97);
  margin-right: auto;
  margin-left: clamp(0.5rem, 3vw, 1rem);
  border: 1px solid rgba(200, 200, 200, 0.5);
}

/* Rabinho do balão (humorista esquerda) - aponta para a boca dele (embaixo à esquerda) */
.bubble-human::after {
  content: "";
  position: absolute;
  left: 20px;
  bottom: -10px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid rgba(255, 255, 255, 0.97);
}

/* Balão do robô (direita) - mais baixo saindo da cabeça */
.bubble-robot {
  background: rgba(240, 248, 255, 0.97);
  margin-left: auto;
  margin-right: clamp(0.5rem, 3vw, 1rem);
  margin-top: 650px;
  margin-bottom: 4.5rem;
  border: 1px solid rgba(100, 180, 220, 0.5);
  color: #1a3a52;
  max-width: clamp(65%, 90%, 100%);
  line-height: 1.6;
}

/* Rabinho do balão (robô direita) - aponta para a cabeça dele (abaixo à direita) */
.bubble-robot::after {
  content: "";
  position: absolute;
  right: 20px;
  top: -10px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid rgba(240, 248, 255, 0.97);
}

/* Balão de celebração (100% happy) */
.bubble-celebration {
  background: linear-gradient(135deg, rgba(76, 205, 196, 0.95), rgba(255, 215, 0, 0.95));
  color: white;
  text-align: center;
  font-weight: 700;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  padding: clamp(1.25rem, 3vw, 2rem);
  min-width: 250px;
  border: none;
  animation: celebrationBounce 0.6s ease-in-out infinite;
}

.celebration-text {
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@keyframes celebrationBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* ============================================
   ZONA 3: BOTÃO E ESPAÇO INFERIOR
   ============================================ */
.zone-button {
  position: relative;
  z-index: 80;
  padding: clamp(1rem, 3vw, 1.5rem) clamp(1rem, 4vw, 2rem);
  padding-bottom: env(safe-area-inset-bottom, 20px); /* Add safe area padding */
  background: linear-gradient(
    to top,
    rgba(10, 10, 15, 0.95),
    rgba(10, 10, 15, 0.7),
    transparent
  );
  border-top: 1px solid rgba(76, 205, 196, 0.1);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0; /* Prevent button zone from shrinking */
}

/* Botão "Tell Me Another Joke!" */
.btn-next-joke {
  width: 100%;
  max-width: clamp(280px, 90vw, 400px);
  padding: clamp(1rem, 2.5vw, 1.25rem);
  background: rgba(255, 255, 255, 0.1);
  color: #4CCDC4;
  border: 1px solid rgba(76, 205, 196, 0.5);
  border-radius: 50px; /* Mais arredondado */
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 0 15px rgba(76, 205, 196, 0.1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.btn-next-joke::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(76, 205, 196, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-next-joke:hover:not(:disabled) {
  background: rgba(76, 205, 196, 0.15);
  border-color: #4CCDC4;
  box-shadow: 0 0 25px rgba(76, 205, 196, 0.4);
  transform: scale(1.05);
  color: #fff;
  text-shadow: 0 0 8px rgba(76, 205, 196, 0.8);
}

.btn-next-joke:hover:not(:disabled)::before {
  transform: translateX(100%);
}

.btn-next-joke:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-next-joke:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
}

/* ============================================
   RESPONSIVIDADE MOBILE-FIRST
   ============================================ */

/* Mobile (≤599px) */
@media (max-width: 599px) {
  .zone-progress {
    padding: 0.75rem 0.5rem;
  }

  .zone-bubbles {
    padding: 45vh 0.5rem 1rem 0.5rem; /* Push content down to start above human head */
    gap: 1rem;
    justify-content: space-between; /* Space out bubbles: one top, one bottom */
  }

  .bubble {
    padding: 0.75rem;
    font-size: 0.875rem;
    max-width: 85%;
  }



  .zone-button {
    padding: 0.75rem;
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .btn-next-joke {
    max-width: 100%;
    padding: 0.75rem;
    font-size: 0.8rem;
    border-radius: 25px;
  }
}

/* Tablet (600-1023px) */
@media (min-width: 600px) and (max-width: 1023px) {
  .bubble {
    max-width: 70%;
  }

  .zone-bubbles {
    padding: 1.5rem 1rem;
    gap: 1rem;
  }

  .btn-next-joke {
    max-width: 420px;
  }
}

/* Desktop (≥1024px) */
@media (min-width: 1024px) {
  .bubble {
    max-width: 60%;
  }

  .zone-bubbles {
    padding: 2rem 2rem;
    gap: 1.5rem;
  }

  .zone-button {
    padding: 1.5rem 2rem;
  }

  .btn-next-joke {
    max-width: 500px;
  }
}

/* ============================================
   ACESSIBILIDADE E DETALHES
   ============================================ */

/* Garante boa visibilidade da barra no top */
@supports (position: sticky) {
  .zone-progress {
    position: sticky;
    top: 0;
    z-index: 100;
  }
}

/* Transição suave entre estados */
button {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Focus visible para teclado */
.btn-next-joke:focus-visible {
  outline: 3px solid rgba(255, 215, 0, 0.8);
  outline-offset: 2px;
}
</style>
