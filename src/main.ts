import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import { useThemeStore } from './domains/theming/stores/ThemeStore';
import { useI18nStore } from './domains/i18n/stores/I18nStore';
import './styles/global.scss';

const app = createApp(App);
app.use(createPinia());
app.use(router);

useThemeStore().init();
useI18nStore().init();

app.mount('#app');
