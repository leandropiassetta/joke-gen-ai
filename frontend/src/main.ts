import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";
import './assets/global.css'


async function bootstrap() {
	const app = createApp(App);
	const pinia = createPinia();

	app.use(pinia);
	app.use(router);
	app.use(vuetify);

	// Validate token before mounting to avoid flash between /login and /initial
	const { useAuthStore } = await import('./stores/auth')
	const authStore = useAuthStore();
	try {
		await authStore.validateToken()
	} catch (e) {
		// ignore
	}

	app.mount('#app')
}

bootstrap()
