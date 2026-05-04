<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLang } from '@/shared/composables/useLang';
import { FormatService } from '@/shared/utils/format';
import { ApprovalFlowService } from '../services/ApprovalFlowService';
import type { ApprovalToken } from '../interface/MedServiceTypes';

const lang = useLang();
const t = computed(() => lang.value.periods.medservice.approvalFlow);

const tokens = ref<ApprovalToken[]>([]);
const processed = ref(247);
let nextId = 1;
let rafId = 0;

function tick(now: number): void {
  const result = ApprovalFlowService.advance(tokens.value, now, () => nextId++);
  tokens.value = result.tokens;
  processed.value += result.archived;
  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  rafId = requestAnimationFrame(tick);
});
onBeforeUnmount(() => cancelAnimationFrame(rafId));
</script>

<template>
  <div class="flow">
    <header class="flow__head">
      <span class="flow__label">{{ t.label }}</span>
      <span class="flow__counter">{{ t.processed }} <strong>{{ FormatService.thousands(processed) }}</strong></span>
    </header>

    <div class="flow__diploma" aria-label="Diploma badge">
      <span class="flow__diploma-icon">★</span>
      <span class="flow__diploma-text">{{ t.diploma }}</span>
    </div>

    <div class="flow__chain">
      <template v-for="(stage, idx) in t.stages" :key="stage">
        <div class="flow__stage" :class="`flow__stage--${idx}`">
          <span class="flow__stage-num">{{ FormatService.stepNumber(idx) }}</span>
          <span class="flow__stage-name">{{ stage }}</span>
          <span
            v-for="tk in tokens.filter((x) => x.stage === idx)"
            :key="tk.id"
            class="flow__token"
          />
        </div>
        <span v-if="idx < t.stages.length - 1" class="flow__arrow" aria-hidden="true">→</span>
      </template>
    </div>

    <p class="flow__note">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped src="@/domains/period-medservice/styles/ApprovalFlow.scss"></style>
