<script lang="ts">
  import { t } from "../lib/i18n";
  import type { Lang } from "../lib/types";

  let {
    lang,
    isOpen,
    onClose
  }: {
    lang: Lang;
    isOpen: boolean;
    onClose: () => void;
  } = $props();

  function parseMarkup(text: string) {
    return (text || "").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm transition-all" onclick={onClose}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="w-full max-w-md scale-100 rounded-3xl bg-white p-6 opacity-100 shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-white/10"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="mb-4 flex items-center gap-3 text-[#ff6f61]">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff6f61]/10">
          <i class="fa-solid fa-user-secret text-lg"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">{t(lang, "privacyTitle")}</h3>
      </div>
      
      <div class="mb-6 max-h-[60vh] overflow-y-auto pr-2 text-sm text-slate-600 dark:text-slate-400">
        {#each (t(lang, "privacyContent") as unknown as string[]) as paragraph}
          <p class="mb-3 leading-relaxed last:mb-0">
            {@html parseMarkup(paragraph)}
          </p>
        {/each}
      </div>
      
      <button 
        class="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        onclick={onClose}
      >
        {t(lang, "btnUnderstand")}
      </button>
    </div>
  </div>
{/if}
