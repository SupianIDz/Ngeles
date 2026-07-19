<script lang="ts">
  import { t } from "../lib/i18n";
  import type { Lang } from "../lib/types";

  let {
    lang,
    onSurprise,
  }: {
    lang: Lang;
    onSurprise: () => void;
  } = $props();
</script>

<header class="mb-12 flex flex-col items-center text-center">
  <div class="mb-2 flex items-center gap-3">
    <div class="h-px w-6 bg-gradient-to-r from-transparent to-[#ff6f61]/30"></div>
    <span class="text-[10px] font-black tracking-[0.3em] text-[#ff6f61] uppercase">
      {t(lang, "appTagline")}
    </span>
    <div class="h-px w-6 bg-gradient-to-l from-transparent to-[#ff6f61]/30"></div>
  </div>
  <button onclick={onSurprise} class="brand-mark animate-gentle-tilt hover:scale-105 transition-transform duration-300">
    <h1 class="mb-4 font-display text-4xl font-black leading-none tracking-tight text-slate-800 dark:text-slate-100 sm:text-[3.25rem]">
      Ngeles
    </h1>
  </button>
  <p class="max-w-md text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
    {t(lang, "appSubtitle")}
  </p>
</header>
