<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLang } from '@/shared/composables/useLang';
import type { IdeTab } from '../interface/IdeTab';

const lang = useLang();

const TABS: readonly IdeTab[] = Object.freeze([
  {
    key: 'vb6',
    filename: 'PropCalc.bas',
    lang: 'VB6',
    code: `' Property area calculator — final-year project, 2015
Public Function CalcArea(width As Double, height As Double) As Double
    If width <= 0 Or height <= 0 Then
        Err.Raise 100, , "invalid dimensions"
    End If
    CalcArea = width * height
End Function

Private Sub btnCompute_Click()
    Dim m2 As Double
    m2 = CalcArea(CDbl(txtW.Text), CDbl(txtH.Text))
    lblResult.Caption = Format(m2, "0.00") & " m²"
End Sub`,
  },
  {
    key: 'cpp',
    filename: 'sort.cpp',
    lang: 'C++',
    code: `#include <vector>
#include <algorithm>

template <typename T>
void quicksort(std::vector<T>& v, int lo, int hi) {
    if (lo < hi) {
        T pivot = v[hi];
        int i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (v[j] < pivot) std::swap(v[++i], v[j]);
        }
        std::swap(v[i + 1], v[hi]);
        quicksort(v, lo, i);
        quicksort(v, i + 2, hi);
    }
}`,
  },
  {
    key: 'cs',
    filename: 'Account.cs',
    lang: 'C#',
    code: `public class Account {
    public string Holder { get; }
    public decimal Balance { get; private set; }

    public Account(string holder, decimal opening) {
        Holder = holder;
        Balance = opening;
    }

    public void Deposit(decimal amount) {
        if (amount <= 0) throw new ArgumentException("amount > 0");
        Balance += amount;
    }
}`,
  },
  {
    key: 'sql',
    filename: 'select.sql',
    lang: 'SQL',
    code: `SELECT
    p.id,
    p.title,
    SUM(o.qty * o.price) AS revenue
FROM products p
LEFT JOIN orders o ON o.product_id = p.id
WHERE p.status = 'active'
GROUP BY p.id, p.title
HAVING SUM(o.qty * o.price) > 1000
ORDER BY revenue DESC
LIMIT 20;`,
  },
]);

const t = computed(() => lang.value.periods.stepAcademy);

const activeKey = ref<string>(TABS[0].key);
const active = computed(() => TABS.find((tab) => tab.key === activeKey.value) ?? TABS[0]);
</script>

<template>
  <div class="ide">
    <header class="ide__head">
      <span class="ide__title">{{ t.title }}</span>
    </header>

    <div class="ide__chrome">
      <div class="ide__tabs" role="tablist">
        <button
          v-for="tab in TABS"
          :key="tab.key"
          type="button"
          role="tab"
          class="ide__tab"
          :class="{ 'ide__tab--on': tab.key === activeKey }"
          :aria-selected="tab.key === activeKey"
          @click="activeKey = tab.key"
        >
          <span class="ide__tab-name">{{ tab.filename }}</span>
        </button>
      </div>

      <div class="ide__editor">
        <pre class="ide__code"><code>{{ active.code }}</code></pre>
        <div class="ide__statusbar">
          <span>{{ active.lang }}</span>
          <span class="ide__cursor" aria-hidden="true">_</span>
        </div>
      </div>
    </div>

    <p class="ide__note">{{ t.note }}</p>
  </div>
</template>

<style lang="scss" scoped src="@/domains/period-step-academy/styles/RetroIDE.scss"></style>
