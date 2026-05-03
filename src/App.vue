<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppHeader from '@/shared/ui/AppHeader.vue';

const router = useRouter();

router.afterEach(() => {
  // After every navigation, return focus to the top of the page so keyboard
  // users don't have to Tab back from the previous interactive element.
  requestAnimationFrame(() => {
    const brand = document.querySelector<HTMLElement>('.hdr__brand');
    brand?.focus();
  });
});
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="app__main">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app__main {
  flex: 1;
  width: 100%;
  max-width: $container-default;
  margin: 0 auto;
  padding: $space-5 $space-5 $space-8;

  @media (max-width: $bp-tablet) {
    padding: $space-4;
  }
}
</style>
