<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { t, levelLabel } from "../lib/i18n";
  import { getTopicTitle } from "../lib/excuses";
  import type { Lang, HistoryEntry } from "../lib/types";

  let {
    history,
    lang,
    cacheVersion,
    onUseHistory,
    onShowToast,
  }: {
    history: HistoryEntry[];
    lang: Lang;
    cacheVersion: number;
    onUseHistory: (entry: HistoryEntry) => void;
    onShowToast: (msg: string) => void;
  } = $props();

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    onShowToast(t(lang, "toastCopied"));
  }
</script>

<section class="mt-8">
  <div class="mb-3 flex items-center justify-between px-1">
    <div class="flex items-center gap-2">
      <h3 class="font-bold text-slate-800 dark:text-slate-200">
        {t(lang, "historyHeading")}
      </h3>
      <span class="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border border-slate-400/20 dark:border-slate-600/30 bg-white/70 dark:bg-slate-800/70 px-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
        {history.length}
      </span>
    </div>
    <div class="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-100 dark:border-emerald-800/50">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      LIVE
    </div>
  </div>

  {#if history.length > 0}
    <div class="max-h-56 space-y-2 overflow-y-auto pr-1" transition:fade>
      {#each history as entry (entry.id || entry.ts)}
        <div 
          transition:fly={{ y: 10, duration: 200 }}
          class="group flex items-start gap-3 rounded-2xl px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-400/10 dark:border-slate-600/20 transition-all hover:translate-x-[3px] hover:shadow-[0_4px_12px_rgba(78,91,122,0.08)] dark:hover:shadow-none"
        >
          <div class="min-w-0 flex-1 pt-px">
            <div class="mb-1 flex flex-wrap items-center gap-1">
              <span class="text-[0.65rem] font-bold tracking-[0.02em] px-2 py-[1px] rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
                {getTopicTitle(lang, entry.context, cacheVersion)}
              </span>
              <span class="text-[0.65rem] font-bold tracking-[0.02em] px-2 py-[1px] rounded-full {entry.level === 'normal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : entry.level === 'ridiculous' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400'}">
                {levelLabel(lang, entry.level)}
              </span>
            </div>
            <p class="text-sm leading-snug text-slate-600 dark:text-slate-300">
              {entry.text.length > 90 ? entry.text.slice(0, 90) + "…" : entry.text}
            </p>
            {#if entry.generator_name}
              <p class="mt-1 text-[10px] font-medium text-emerald-500">
                <i class="fa-solid fa-user-astronaut mr-1"></i>Dibuat oleh: {entry.generator_name}
              </p>
            {/if}
          </div>
          <div class="flex shrink-0 flex-col gap-1 pt-0.5 opacity-60 transition group-hover:opacity-100">
            <button 
              onclick={() => copyText(entry.text)}
              class="rounded-lg p-1.5 text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-50 dark:hover:bg-emerald-900/30" 
              title="Copy"
            >
              <i class="fa-solid fa-copy text-xs pointer-events-none"></i>
            </button>
            <button 
              onclick={() => onUseHistory(entry)}
              class="rounded-lg p-1.5 text-sky-500 dark:text-sky-400 transition hover:bg-sky-50 dark:hover:bg-sky-900/30" 
              title="Use"
            >
              <i class="fa-solid fa-rotate-right text-xs pointer-events-none"></i>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div 
      transition:fade
      class="rounded-2xl border border-dashed border-slate-400/20 dark:border-slate-600/30 bg-white/40 dark:bg-slate-900/40 px-4 py-4 text-center text-xs font-medium text-slate-400 dark:text-slate-500"
    >
      {t(lang, "historyEmpty")}
    </div>
  {/if}
</section>
