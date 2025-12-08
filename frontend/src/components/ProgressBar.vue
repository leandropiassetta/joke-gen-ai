<template>
  <div class="progress-container">
    <div class="progress-label">
      <span class="label-text">AI HAPPINESS</span>
      <span class="progress-percentage">{{ progress }}%</span>
    </div>
    
    <!-- Progress Bar com Imagem de Fundo -->
    <div class="progress-bar-wrapper">
      <img src="/progress-bar.png" alt="Progress Bar" class="progress-bar-image" />
      
      <!-- Preenchimento em Vermelho sobre a imagem -->
      <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 100,
  },
});
</script>

<style scoped>
.progress-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 280px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 700;
}

.progress-percentage {
  color: #ffeb3b;
  font-weight: 700;
  font-size: 1.25rem;
}

.progress-bar-wrapper {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 8px;
}

.progress-bar-image {
  display: block;
  width: 100%;
  height: auto;
  position: relative;
  z-index: 1;
}

.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    #ff4444,
    #ff6666
  );
  border-radius: 0;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 0;
  box-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
}

/* Efeito de brilho animado */
@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
