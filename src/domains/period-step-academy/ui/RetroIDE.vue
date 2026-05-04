<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18nStore } from '@/domains/i18n/stores/I18nStore';
import { Lang } from '@/shared/types/Lang';

interface Tab {
  key: string;
  filename: string;
  lang: string;
  code: string;
}

const i18n = useI18nStore();

const TABS: Tab[] = [
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
];

const labels = {
  [Lang.EN]: {
    title: 'Step IT Academy IDE · 2010—2015',
    note: 'Five years of evening classes covering JavaScript, C++, C#, CI, PHP, HTML and SQL. The VB6 calculator on the left tab eventually became the demo that landed me my first commercial role.',
  },
  [Lang.UK]: {
    title: 'Step IT Academy IDE · 2010—2015',
    note: 'П\'ять років вечірніх занять: JavaScript, C++, C#, CI, PHP, HTML, SQL. VB6-калькулятор у першій вкладці став демо що принесло першу комерційну роботу.',
  },
} as const;
const t = computed(() => labels[i18n.current]);

const activeKey = ref<string>(TABS[0].key);
const active = computed(() => TABS.find((t) => t.key === activeKey.value) ?? TABS[0]);
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

<style lang="scss" scoped>
.ide {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  font-family: $font-mono;
}

.ide__head {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: $space-2;
}

.ide__title {
  font-size: $fs-xs;
  color: var(--color-type-edu);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ide__chrome {
  background: #001a4b;
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  overflow: hidden;
  color: #e6e9f5;
}

.ide__tabs {
  display: flex;
  gap: 1px;
  background: #0a1f5e;
  padding: 4px 4px 0;
  flex-wrap: wrap;
}

.ide__tab {
  background: #001a4b;
  border: none;
  color: #aab2c8;
  padding: 6px 10px;
  font-family: $font-mono;
  font-size: 0.7rem;
  cursor: pointer;
  border-radius: 3px 3px 0 0;
  border-bottom: 2px solid transparent;
  transition: color $transition-fast;

  &--on {
    background: #002b7a;
    color: #ffeb3b;
    border-bottom-color: #ffeb3b;
  }

  &:hover:not(.ide__tab--on) {
    color: #e6e9f5;
  }
}

.ide__editor {
  background: #002b7a;
  padding: $space-3 $space-4;
  font-size: 0.72rem;
  line-height: 1.55;
  min-height: 220px;
  position: relative;
}

.ide__code {
  margin: 0;
  white-space: pre;
  overflow-x: auto;
  color: #ffffff;

  // Crude syntax highlighting via tokenisation in the eye
  font-family: $font-mono;
}

.ide__statusbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  background: #ffeb3b;
  color: #001a4b;
  padding: 2px 8px;
  font-size: 0.65rem;
  font-weight: $fw-bold;
  letter-spacing: 0.05em;
}

.ide__cursor {
  animation: ideBlink 1s steps(1) infinite;
}

@keyframes ideBlink {
  50% { opacity: 0; }
}

.ide__note {
  margin: 0;
  font-family: $font-sans;
  font-size: $fs-sm;
  color: var(--color-muted);
  line-height: 1.5;
}
</style>
