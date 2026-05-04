<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useThemeStore } from '@/domains/theming/stores/ThemeStore';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { useLang } from '@/shared/composables/useLang';
import { THEME_LABELS, Theme } from '@/shared/types/Theme';
import { LANG_LABELS, Lang } from '@/shared/types/Lang';

const themeStore = useThemeStore();
const i18nStore = useI18nStore();
const lang = useLang();
const t = computed(() => lang.value.header);

const themeOpen = ref<boolean>(false);
const themeRoot = ref<HTMLElement | null>(null);

function pickTheme(t: Theme): void {
  themeStore.set(t);
  themeOpen.value = false;
}

function onDocClick(e: MouseEvent): void {
  if (!themeOpen.value) return;
  if (themeRoot.value && !themeRoot.value.contains(e.target as Node)) {
    themeOpen.value = false;
  }
}
function onKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') themeOpen.value = false;
}
onMounted(() => {
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKey);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
  document.removeEventListener('keydown', onKey);
});

function downloadCV(): void {
  const lang = i18nStore.current;
  const file = lang === Lang.UK ? 'cv-shmakov-ua.pdf' : 'cv-shmakov-en.pdf';
  const url = `${import.meta.env.BASE_URL}${file}`;
  window.open(url, '_blank', 'noopener');
}
</script>

<template>
  <header class="hdr">
    <RouterLink
      to="/"
      class="hdr__brand"
      :data-tooltip="t.home"
      :aria-label="t.home"
    >
      <span class="hdr__name">Olexander Shmakov</span>
      <span class="hdr__role">Senior Full-Stack · Laravel + Vue · 10+ years · Tech Lead</span>
    </RouterLink>

    <nav class="hdr__contacts" aria-label="Contact">
      <a
        class="hdr__contact"
        href="https://linkedin.com/in/shmakov-laravel"
        target="_blank"
        rel="noopener noreferrer"
        :data-tooltip="t.linkedin"
        :aria-label="t.linkedin"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.13 1.45-2.13 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.78A1.77 1.77 0 0 0 0 1.75v20.5C0 23.21.79 24 1.78 24h20.44c.99 0 1.78-.79 1.78-1.75V1.75A1.78 1.78 0 0 0 22.22 0z"
          />
        </svg>
        LinkedIn
      </a>
      <a
        class="hdr__contact"
        href="mailto:blucinonyx@gmail.com"
        :data-tooltip="t.email"
        :aria-label="t.email"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 6h18v12H3z M3 6l9 7 9-7"
          />
        </svg>
        blucinonyx@gmail.com
      </a>
    </nav>

    <div class="hdr__actions">
      <div class="hdr__lang">
        <button
          v-for="l in i18nStore.available"
          :key="l"
          type="button"
          class="hdr__lang-btn"
          :class="{ 'hdr__lang-btn--on': l === i18nStore.current }"
          :data-tooltip="t.langBtn(l)"
          :aria-label="t.langBtn(l)"
          @click="i18nStore.set(l)"
        >
          {{ LANG_LABELS[l] }}
        </button>
      </div>

      <div
        ref="themeRoot"
        class="hdr__theme"
        :class="{ 'hdr__theme--open': themeOpen }"
      >
        <button
          type="button"
          class="hdr__theme-toggle"
          :data-tooltip="t.themeBtn(themeStore.current)"
          :aria-label="t.themeBtn(themeStore.current)"
          aria-haspopup="listbox"
          :aria-expanded="themeOpen"
          @click="themeOpen = !themeOpen"
        >
          <span class="hdr__theme-dot" />
          {{ THEME_LABELS[themeStore.current] }}
          <svg class="hdr__theme-caret" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </button>
        <ul
          v-if="themeOpen"
          class="hdr__theme-list"
          role="listbox"
          aria-label="Theme"
        >
          <li
            v-for="th in themeStore.available"
            :key="th"
            class="hdr__theme-item"
            :class="[
              `hdr__theme-item--${th}`,
              { 'hdr__theme-item--active': th === themeStore.current },
            ]"
            role="option"
            :aria-selected="th === themeStore.current"
            :data-tooltip="t.themeOption(th)"
            :aria-label="t.themeOption(th)"
            @click="pickTheme(th)"
          >
            <span class="hdr__theme-item-dot" />
            {{ THEME_LABELS[th] }}
          </li>
        </ul>
      </div>

      <button
        type="button"
        class="hdr__download"
        :data-tooltip="t.download"
        :aria-label="t.download"
        @click="downloadCV"
      >
        <svg
          class="hdr__download-icon"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"
          />
        </svg>
        download CV
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped src="@/shared/styles/AppHeader.scss"></style>
