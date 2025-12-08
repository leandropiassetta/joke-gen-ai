<template>
  <div class="login-page">

    <!-- Background responsivo -->
    <picture class="bg">
      <source srcset="/ai-robot-login-mobile.png" media="(max-width: 599px)" />
      <source srcset="/ai-robot-login-ipad.png" media="(min-width: 600px) and (max-width: 1023px)" />
      <source srcset="/ai-robot-login-desktop.png" media="(min-width: 1024px) and (max-width: 1599px)" />
      <img src="/ai-robot-ultrawide.png" alt="AI Robot" />
    </picture>

    <!-- Container de conteúdo -->
    <div class="content-container">
      <!-- Texto de boas-vindas -->
      <h1 class="welcome">
        <span>🤖</span> Olá! Faça login para começar o show.
      </h1>

      <!-- Card de Login -->
      <div class="login-card">
      <h2>Login</h2>

      <!-- Mensagem de erro -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Formulário -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="inputs">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Email" 
            required
            :disabled="loading"
          />

          <input 
            v-model="password" 
            type="password" 
            placeholder="Senha (mínimo 8 caracteres)" 
            required
            minlength="8"
            :disabled="loading"
          />
        </div>

        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? 'ENTRANDO...' : 'ENTRAR' }}
        </button>
      </form>
    </div>

    </div>

  </div> 
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Validação
function validateForm(): boolean {
  errorMessage.value = ''

  // Validar email
  if (!email.value) {
    errorMessage.value = 'Por favor, insira um email válido.'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Email inválido.'
    return false
  }

  // Validar senha
  if (!password.value) {
    errorMessage.value = 'Por favor, insira uma senha.'
    return false
  }

  if (password.value.length < 8) {
    errorMessage.value = 'A senha deve ter no mínimo 8 caracteres.'
    return false
  }

  return true
}

// Handle Login
async function handleLogin() {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/inicial')
  } catch (error: any) {
    console.error('Erro no login:', error)
    errorMessage.value = error.response?.data?.message || 
                         'Erro ao fazer login. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ------------- LAYOUT GERAL ------------- */
.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
}

.bg picture {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.bg picture img,
.bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ------------- CONTENT CONTAINER ------------- */

.content-container {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 40px;
  gap: 0;
  grid-column: 1;
}

/* ------------- TEXTO DE BOAS-VINDAS ------------- */

.welcome {
  color: #fff;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.7);
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  z-index: 2;
  text-align: center;
  width: 100%;
  max-width: 90%;
  margin: 0 0 32px 0;
  padding: 0 20px;
  letter-spacing: 0.3px;
  line-height: 1.3;
  font-size: 32px;
  display: block;
}

.welcome span {
  margin-right: 8px;
  font-size: 1.1em;
}

/* ------------- LOGIN CARD ------------- */

.login-card {
  background: rgba(20, 20, 20, 0.55);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 28px 24px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 10;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.login-card h2 {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
  text-align: center;
}

/* ------------- FORM STYLES ------------- */

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

input {
  width: 100%;
  height: 40px;
  padding: 12px 16px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(216, 143, 58, 0.3);
  border-radius: 8px;
  color: #fff;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(216, 143, 58, 0.6);
  box-shadow: 0 0 0 3px rgba(216, 143, 58, 0.15);
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ------------- BUTTON STYLES ------------- */

.btn {
  height: 44px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #D88F3A 0%, #E7A14C 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(216, 143, 58, 0.3);
  margin-top: 8px;
}

.btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #E7A14C 0%, #F0B55E 100%);
  box-shadow: 0 6px 20px rgba(216, 143, 58, 0.4);
  transform: translateY(-2px);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(216, 143, 58, 0.3);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ------------- ERROR MESSAGE ------------- */

.error-message {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.5);
  color: #fca5a5;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.4;
  font-family: 'Poppins', sans-serif;
}

/* ------------- RESPONSIVE: TABLET/IPAD ------------- */

@media (min-width: 600px) and (max-width: 1023px) {
  .login-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 40px;
  }

  .content-container {
    gap: 8px;
    grid-column: auto;
    padding: 0 20px;
  }

  .welcome {
    display: block;
    font-size: 22px;
    margin-bottom: 0;
  }

  .login-card {
    max-width: 320px;
    margin-top: 0;
    padding: 20px 20px;
    background: rgba(0, 0, 0, 0.60);
  }

  .login-card h2 {
    font-size: 1.75rem;
    margin-bottom: 4px;
  }

  input {
    height: 36px;
    font-size: 13px;
    padding: 10px 14px;
  }

  .btn {
    height: 40px;
    font-size: 13px;
    padding: 10px 20px;
  }

  .login-form {
    gap: 12px;
  }

  .inputs {
    gap: 12px;
  }
}

/* ------------- RESPONSIVE: MOBILE ------------- */

@media (max-width: 599px) {
  .login-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 30px 20px 0 20px;
  }

  .content-container {
    gap: 10px;
    grid-column: auto;
    padding: 0;
    width: 100%;
    max-width: 300px;
  }

  .welcome {
    display: block;
    font-size: 18px;
    margin-bottom: 0;
    line-height: 1.3;
    padding: 0 5px;
  }

  .login-card {
    max-width: 100%;
    margin-top: 0;
    padding: 16px 16px;
    background: rgba(20, 20, 20, 0.75);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .login-card h2 {
    font-size: 1.5rem;
    margin-bottom: 5px;
  }

  input {
    height: 38px;
    font-size: 13px;
    padding: 8px 12px;
  }

  .btn {
    height: 40px;
    font-size: 13px;
    padding: 8px 16px;
    margin-top: 6px;
  }

  .login-form {
    gap: 12px;
  }

  .inputs {
    gap: 10px;
  }

  .error-message {
    font-size: 12px;
    padding: 10px 12px;
  }
}

</style>
