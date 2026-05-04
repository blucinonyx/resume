<script setup lang="ts">
import { useThemeStore } from '@/domains/theming/stores/ThemeStore';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { THEME_LABELS } from '@/shared/types/Theme';
import { LANG_LABELS, Lang } from '@/shared/types/Lang';

const themeStore = useThemeStore();
const i18nStore = useI18nStore();

function downloadCV(): void {
  const lang = i18nStore.current;
  const file = lang === Lang.UK ? 'cv-shmakov-ua.pdf' : 'cv-shmakov-en.pdf';
  const url = `${import.meta.env.BASE_URL}${file}`;
  window.open(url, '_blank', 'noopener');
}
</script>

<template>
  <header class="hdr">
    <RouterLink to="/" class="hdr__brand">
      <span class="hdr__name">Olexander Shmakov</span>
      <span class="hdr__role">Senior Full-Stack · Laravel + Vue · 10+ years · Tech Lead</span>
    </RouterLink>

    <nav class="hdr__contacts" aria-label="Contact">
      <a
        class="hdr__contact"
        href="https://linkedin.com/in/shmakov-laravel"
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn — preferred contact"
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
        title="Send email"
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
          @click="i18nStore.set(l)"
        >
          {{ LANG_LABELS[l] }}
        </button>
      </div>

      <button
        type="button"
        class="hdr__theme"
        :title="`Theme: ${THEME_LABELS[themeStore.current]} · click to cycle`"
        @click="themeStore.cycle()"
      >
        <span class="hdr__theme-dot" />
        {{ THEME_LABELS[themeStore.current] }}
      </button>

      <button type="button" class="hdr__download" @click="downloadCV">
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

.hdr__theme {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-4;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  font-family: $font-mono;
  font-size: $fs-sm;
  color: var(--color-text);
  transition: all $transition-fast;
  cursor: pointer;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
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
