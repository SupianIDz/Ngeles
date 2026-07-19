<script lang="ts">
  import { fly } from "svelte/transition";
  import { t } from "../lib/i18n";
  import type { Lang } from "../lib/types";

  let {
    generatedCount,
    lang,
    manifest,
    activeLang,
    isDarkMode,
    onLangSelect,
    onToggleDarkMode,
    onOpenStats,
  }: {
    generatedCount: number;
    lang: Lang;
    manifest: any;
    activeLang: any;
    isDarkMode: boolean;
    onLangSelect: (id: string) => void;
    onToggleDarkMode: () => void;
    onOpenStats: () => void;
  } = $props();

  let langDropdownOpen = $state(false);

  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest("#langDropdownWrapper")) langDropdownOpen = false;
  }

  function selectLang(id: string) {
    langDropdownOpen = false;
    onLangSelect(id);
  }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="mb-8 flex items-center justify-between sm:mb-10">
  <!-- Left: Stats -->
  <button 
    type="button"
    onclick={onOpenStats}
    class="flex cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition hover:scale-105 items-center gap-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 text-xs shadow-sm ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-md"
  >
    <i class="fa-solid fa-chart-line text-emerald-500"></i>
    <span class="font-bold text-slate-800 dark:text-slate-200">{generatedCount.toLocaleString()}</span>
    <span class="hidden sm:inline font-medium text-slate-500 dark:text-slate-400">{t(lang, "generatedStat")}</span>
  </button>

  <!-- Right: Controls -->
  <div class="flex items-center gap-3">
    <div class="relative" id="langDropdownWrapper">
      <button
        class="flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 px-4 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-md transition hover:bg-white dark:hover:bg-slate-800 hover:shadow-md"
        onclick={() => (langDropdownOpen = !langDropdownOpen)}
      >
        <i class="fa-solid fa-globe text-[#ff6f61]"></i>
        <span>{activeLang?.label || "Loading..."}</span>
        <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200 {langDropdownOpen ? 'rotate-180' : ''}"></i>
      </button>

      {#if langDropdownOpen}
        <div 
          transition:fly={{ y: -10, duration: 200 }}
          class="absolute top-[calc(100%+6px)] right-0 z-50 overflow-hidden rounded-2xl w-44 bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 shadow-xl backdrop-blur-md"
        >
          <ul class="max-h-44 overflow-y-auto p-1.5">
            {#each manifest?.languages || [] as l}
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
              <li 
                class="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 {l.id === lang ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30' : ''}"
                onclick={() => selectLang(l.id)}
              >
                <span>{l.label}</span>
                {#if l.id === lang}
                  <i class="fa-solid fa-check ml-auto text-xs text-emerald-500"></i>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>

    <button 
      onclick={onToggleDarkMode}
      class="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-md transition hover:bg-white dark:hover:bg-slate-800 hover:shadow-md"
      aria-label="Toggle Dark Mode"
    >
      <i class={isDarkMode ? "fa-solid fa-moon text-xs" : "fa-solid fa-sun text-xs"}></i>
    </button>
  </div>
</div>
