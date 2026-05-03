<script setup lang="ts">
import { useThemeStore } from '@/domains/theming/stores/ThemeStore';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { THEME_LABELS } from '@/shared/types/Theme';
import { LANG_LABELS, Lang } from '@/shared/types/Lang';

const themeStore = useThemeStore();
const i18nStore = useI18nStore();

function downloadCV(): void {
  const lang = i18nStore.current;
  const file = lang === Lang.UK ? 'cv-shmakov-uk.pdf' : 'cv-shmakov-en.pdf';
  const url = `${import.meta.env.BASE_URL}${file}`;
  window.open(url, '_blank', 'noopener');
}
</script>

<template>
  <header class="hdr">
    <RouterLink to="/" class="hdr__brand">
      <span class="hdr__name">Olexander Shmakov</span>
      <span class="hdr__role">Senior Full-Stack · Tech Lead</span>
    </RouterLink>

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
        ⤓ download CV
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.hdr {
  position: sticky;
  top: 0;
  z-index: $z-sticky;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
  padding: $space-3 $space-5;
  background: color-mix(in srgb, var(--color-bg) 85%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);

  @media (max-width: $bp-tablet) {
    flex-wrap: wrap;
    padding: $space-3 $space-4;
  }
}

.hdr__brand {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-decoration: none;
  color: var(--color-text);

  &:hover { color: var(--color-text); }
}

.hdr__name {
  font-weight: $fw-bold;
  font-size: $fs-base;
  letter-spacing: -0.01em;
}

.hdr__role {
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-muted);
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
  padding: $space-2 $space-3;
  background: transparent;
  border: 0;
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-muted);
  transition: all $transition-fast;

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
  padding: $space-2 $space-3;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  font-family: $font-mono;
  font-size: $fs-xs;
  color: var(--color-text);
  transition: all $transition-fast;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}

.hdr__theme-dot {
  width: 10px;
  height: 10px;
  border-radius: $radius-full;
  background: var(--color-accent);
  box-shadow: var(--glow-accent);
}

.hdr__download {
  padding: $space-2 $space-4;
  background: var(--color-accent);
  color: var(--color-bg);
  border: 1px solid var(--color-accent);
  border-radius: $radius-md;
  font-family: $font-mono;
  font-size: $fs-xs;
  font-weight: $fw-semibold;
  transition: all $transition-fast;

  &:hover {
    background: var(--color-accent-hover);
    border-color: var(--color-accent-hover);
  }
}
</style>
