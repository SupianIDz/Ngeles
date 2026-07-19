<script lang="ts">
  import { t } from "../lib/i18n";
  import type { Lang } from "../lib/types";

  let {
    lang,
    isOpen,
    count,
    onClose
  }: {
    lang: Lang;
    isOpen: boolean;
    count: number;
    onClose: () => void;
  } = $props();

  function parseMarkup(text: string) {
    return (text as string || "").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>').replace(/\{count\}/g, `<span class="text-emerald-500 font-black tracking-tight text-xl mx-1">${count.toLocaleString()}</span>`);
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm transition-all" onclick={onClose}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="w-full max-w-sm scale-100 rounded-3xl bg-white p-6 opacity-100 shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-white/10 text-center"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="mb-4 flex justify-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <i class="fa-solid fa-earth-americas text-3xl animate-[spin_10s_linear_infinite]"></i>
        </div>
      </div>
      <h3 class="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">{t(lang, "statsTitle")}</h3>
      
      <p class="mb-6 leading-relaxed text-sm text-slate-600 dark:text-slate-400">
        {@html parseMarkup(t(lang, "statsMessage") as unknown as string)}
      </p>
      
      <button 
        class="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        onclick={onClose}
      >
        {t(lang, "btnUnderstand")}
      </button>
    </div>
  </div>
{/if}
