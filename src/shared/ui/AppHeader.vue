<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useThemeStore } from '@/domains/theming/stores/ThemeStore';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { THEME_LABELS, Theme } from '@/shared/types/Theme';
import { LANG_LABELS, Lang } from '@/shared/types/Lang';

const themeStore = useThemeStore();
const i18nStore = useI18nStore();

// Localised tooltip strings — same pattern as RoleLayout.vue (a frozen
// dictionary keyed by Lang). Add a key here when you introduce a new
// non-obvious control whose function isn't clear from its visual alone.
const tooltips = {
  [Lang.EN]: {
    home: 'Home — back to the career timeline',
    linkedin: 'LinkedIn — preferred way to reach me',
    email: 'Send email · blucinonyx@gmail.com',
    langBtn: (l: Lang) => `Switch interface to ${l === Lang.EN ? 'English' : 'Ukrainian'}`,
    themeBtn: (t: Theme) => `Theme: ${THEME_LABELS[t]} · click to choose another`,
    themeOption: (t: Theme) => `Switch to ${THEME_LABELS[t]} theme`,
    download: 'Download CV as PDF',
  },
  [Lang.UK]: {
    home: 'На головну — повернутись до career-timeline',
    linkedin: 'LinkedIn — основний канал звʼязку',
    email: 'Написати email · blucinonyx@gmail.com',
    langBtn: (l: Lang) => `Переключити інтерфейс на ${l === Lang.EN ? 'англійську' : 'українську'}`,
    themeBtn: (t: Theme) => `Тема: ${THEME_LABELS[t]} · клік щоб обрати іншу`,
    themeOption: (t: Theme) => `Переключити на тему ${THEME_LABELS[t]}`,
    download: 'Завантажити CV у PDF',
  },
} as const;
const t = computed(() => tooltips[i18nStore.current]);

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

<style lang="scss" scoped>
.hdr {
  position: sticky;
  top: 0;
  z-index: $z-sticky;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: $space-4;
  padding: $space-4 $space-5;
  background: color-mix(in srgb, var(--color-bg) 85%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);

  @media (max-width: $bp-tablet) {
    grid-template-columns: 1fr auto;
    padding: $space-3 $space-4;
  }
}

.hdr__brand {
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-decoration: none;
  color: var(--color-text);
  border-radius: $radius-sm;
  outline: none;

  &:hover { color: var(--color-text); }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
  }
}

.hdr__name {
  font-weight: $fw-bold;
  font-size: $fs-md;
  letter-spacing: -0.01em;
}

.hdr__role {
  font-family: $font-mono;
  font-size: $fs-sm;
  color: var(--color-muted);
}

.hdr__contacts {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $space-2;
  flex-wrap: wrap;

  // On tablet/mobile the contacts row drops below the brand row instead of
  // squeezing into the centre column.
  @media (max-width: $bp-tablet) {
    grid-column: 1 / -1;
    order: 3;
    justify-content: flex-start;
  }
}

.hdr__contact {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-3;
  font-family: $font-mono;
  font-size: $fs-sm;
  color: var(--color-muted);
  border-radius: $radius-md;
  transition: color $transition-fast, background $transition-fast;

  &:hover {
    color: var(--color-accent);
    background: color-mix(in srgb, var(--color-panel) 70%, transparent);
  }

  svg { flex-shrink: 0; }
}

.hdr__actions {
  display: flex;
  align-items: center;
  gap: $space-2;
  flex-wrap: wrap;
}

.hdr__lang {
  display: inline-flex;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  overflow: hidden;
}

.hdr__lang-btn {
  padding: $space-2 $space-4;
  background: transparent;
  border: 0;
  font-family: $font-mono;
  font-size: $fs-sm;
  font-weight: $fw-semibold;
  color: var(--color-muted);
  transition: all $transition-fast;
  cursor: pointer;

  &--on {
    background: var(--color-accent);
    color: var(--color-bg);
  }

  &:hover:not(.hdr__lang-btn--on) {
    color: var(--color-text);
  }
}

// Theme picker — custom dropdown so we can render a coloured "preview dot"
// next to each theme name (native <option> elements can't hold styled
// children consistently across browsers).
.hdr__theme {
  position: relative;
  display: inline-block;
}

.hdr__theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-3 $space-2 $space-4;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  font-family: $font-mono;
  font-size: $fs-sm;
  color: var(--color-text);
  transition: border-color $transition-fast, color $transition-fast;
  cursor: pointer;

  &:hover,
  .hdr__theme--open & {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}

.hdr__theme-caret {
  flex-shrink: 0;
  color: var(--color-muted);
  transition: color $transition-fast, transform $transition-fast;

  .hdr__theme-toggle:hover &,
  .hdr__theme--open & {
    color: var(--color-accent);
  }
  .hdr__theme--open & {
    transform: rotate(180deg);
  }
}

.hdr__theme-dot {
  width: 12px;
  height: 12px;
  border-radius: $radius-full;
  background: var(--color-accent);
  box-shadow: var(--glow-accent);
  flex-shrink: 0;
}

.hdr__theme-list {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 100%;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  box-shadow: var(--shadow-panel);
  z-index: $z-overlay;
}

.hdr__theme-item {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-3;
  font-family: $font-mono;
  font-size: $fs-sm;
  color: var(--color-text);
  border-radius: $radius-sm;
  cursor: pointer;
  white-space: nowrap;
  transition: background $transition-fast, color $transition-fast;

  &:hover {
    background: var(--color-panel-2);
    color: var(--color-accent);
  }

  &--active {
    color: var(--color-accent);
    background: color-mix(in srgb, var(--color-panel-2) 80%, transparent);
  }
}

.hdr__theme-item-dot {
  width: 10px;
  height: 10px;
  border-radius: $radius-full;
  flex-shrink: 0;

  // Each theme's preview dot uses that theme's accent — hardcoded because
  // the page is currently rendered with a single theme's CSS vars active.
  .hdr__theme-item--dark   & { background: #38bdf8; }
  .hdr__theme-item--light  & { background: #0284c7; }
  .hdr__theme-item--cyber  & { background: #00ffaa; }
  .hdr__theme-item--indigo & { background: #e6a647; }
}

.hdr__download {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 $space-4;
  background: var(--color-accent);
  color: var(--color-bg);
  border: 1px solid var(--color-accent);
  border-radius: $radius-md;
  font-family: $font-mono;
  font-size: $fs-sm;
  font-weight: $fw-semibold;
  transition: all $transition-fast;
  cursor: pointer;

  &:hover {
    background: var(--color-accent-hover);
    border-color: var(--color-accent-hover);
  }
}

.hdr__download-icon {
  flex-shrink: 0;
}
</style>
