<template>
  <div class="progress-container">
    <div class="progress-header">
      <h3 class="progress-title">AI SENSE OF HUMOR</h3>
      <span class="progress-status">{{ progress === 100 ? 'COMPLETE!' : 'LOADING...' }}</span>
    </div>
    
    <div class="progress-bar-wrapper">
      <div class="progress-bar-background">
        <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="progress-percentage">{{ progress }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  progress: { 
    type: Number, 
    required: true, 
    validator: (value: number) => value >= 0 && value <= 100 
  }
});
</script>

<style scoped>
.progress-container {
  position: fixed;
  top: 20px;
  right: 30px;
  width: 200px;
  height: auto;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 12px 16px;
  border: 1px solid rgba(76, 205, 196, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

/* Mobile adjustments for Progress Bar */
@media (max-width: 599px) {
  .progress-container {
    top: 16px;
    right: 16px;
    left: auto;
    width: 180px; /* Slightly smaller on mobile but consistent style */
  }
}

.progress-container:hover {
  border-color: rgba(76, 205, 196, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(76, 205, 196, 0.2);
}

.progress-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  margin-bottom: 8px;
}

.progress-title {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin: 0;
  padding: 0;
  color: #4CCDC4;
  text-transform: uppercase;
  text-shadow: 0 0 5px rgba(76, 205, 196, 0.5);
}

.progress-status {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #fff;
  opacity: 0.75;
  text-transform: uppercase;
  display: block; /* Ensure it's visible */
}

.progress-bar-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar-background {
  flex: 1;
  height: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CCDC4, #556270);
  border-radius: 10px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(76, 205, 196, 0.5);
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-20deg) translateX(-150%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: skewX(-20deg) translateX(-150%); }
  100% { transform: skewX(-20deg) translateX(150%); }
}

.progress-percentage {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  min-width: 40px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* Animação de entrada */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.progress-container {
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Desktop adjustments for Progress Bar */
@media (min-width: 1024px) {
  .progress-container {
    width: 320px;
    padding: 16px 24px;
    top: 30px;
    right: 40px;
  }
  
  .progress-title {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }
  
  .progress-status {
    font-size: 0.75rem;
  }

  .progress-bar-background {
    height: 16px;
  }
}
</style>
