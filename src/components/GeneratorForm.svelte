<script lang="ts">
  import { fly } from "svelte/transition";
  import { t } from "../lib/i18n";
  import { getTopicTitle } from "../lib/excuses";
  import type { Lang, Context, Level } from "../lib/types";

  let {
    lang,
    context = $bindable(),
    level = $bindable(),
    targetName = $bindable(),
    generatorName = $bindable(),
    activeLang,
    cacheVersion,
    isGenerating,
    loadingText,
    btnColorClasses,
    onGenerate,
    onSurprise
  }: {
    lang: Lang;
    context: Context;
    level: Level;
    targetName: string;
    generatorName: string;
    activeLang: any;
    cacheVersion: number;
    isGenerating: boolean;
    loadingText: string;
    btnColorClasses: string;
    onGenerate: () => void;
    onSurprise: () => void;
  } = $props();

  let contextDropdownOpen = $state(false);
  let contextSearchQuery = $state("");

  let filteredContexts = $derived(
    (activeLang?.topics || []).filter((topic: any) => {
      const label = getTopicTitle(lang, topic.id, cacheVersion).toLowerCase();
      return label.includes(contextSearchQuery.toLowerCase().trim());
    })
  );

  let activeContextTopic = $derived(activeLang?.topics.find((t: any) => t.id === context));

  function handleContextSelect(id: string) {
    context = id as Context;
    contextDropdownOpen = false;
  }

  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('#contextDropdownWrapper')) contextDropdownOpen = false;
  }
</script>

<svelte:window onclick={handleClickOutside} />

<section class="w-full rounded-[1.75rem] sm:rounded-[2rem] p-5 sm:p-7 bg-white/70 dark:bg-slate-900/70 border border-white/80 dark:border-slate-800/80 shadow-[0_24px_70px_rgba(78,91,122,0.13)] dark:shadow-none backdrop-blur-[18px]">
  <div class="mb-6">
    <h2 class="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
      {t(lang, "buildHeading")}
    </h2>
    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
      {t(lang, "buildSubheading")}
    </p>
  </div>

  <form class="space-y-5" onsubmit={(e) => { e.preventDefault(); onGenerate(); }}>
    <!-- Target Name -->
    <div>
      <label for="targetNameInput" class="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-200">
        <span>{t(lang, "labelTargetName")}</span>
        <span class="font-semibold text-slate-400 dark:text-slate-500">{t(lang, "labelNameOptional")}</span>
      </label>
      <div class="relative">
        <input
          id="targetNameInput"
          type="text"
          maxlength="40"
          bind:value={targetName}
          placeholder={t(lang, "labelTargetPlaceholder")}
          class="w-full rounded-2xl py-2.5 sm:py-3 pr-10 pl-4 text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:border-[#ff6f61]/75 focus:ring-4 focus:ring-[#ff6f61]/10 transition-all"
        />
        <i class="fa-solid fa-bullseye pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-300 dark:text-slate-600"></i>
      </div>
    </div>

    <!-- Generator Name -->
    <div>
      <label for="generatorNameInput" class="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-200">
        <span>{t(lang, "labelGeneratorName")}</span>
        <span class="font-semibold text-slate-400 dark:text-slate-500">{t(lang, "labelNameOptional")}</span>
      </label>
      <div class="relative">
        <input
          id="generatorNameInput"
          type="text"
          maxlength="40"
          bind:value={generatorName}
          placeholder={t(lang, "labelGeneratorPlaceholder")}
          class="w-full rounded-2xl py-2.5 sm:py-3 pr-10 pl-4 text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:border-[#ff6f61]/75 focus:ring-4 focus:ring-[#ff6f61]/10 transition-all"
        />
        <i class="fa-solid fa-user pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-300 dark:text-slate-600"></i>
      </div>
    </div>

    <!-- Context search -->
    <div>
      <label class="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">
        {t(lang, "labelContext")}
      </label>
      <div class="relative" id="contextDropdownWrapper">
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-2.5 sm:py-3 text-base font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:border-[#ff6f61]/75 focus:ring-4 focus:ring-[#ff6f61]/10 transition-all"
          onclick={() => { contextDropdownOpen = !contextDropdownOpen; contextSearchQuery = ""; }}
        >
          <div class="flex items-center gap-2">
            <i class="{activeContextTopic?.icon || 'fa-solid fa-briefcase'} w-4 text-[#ff6f61]"></i>
            <span>{getTopicTitle(lang, context, cacheVersion)}</span>
          </div>
          <i class="fa-solid fa-chevron-down text-xs text-slate-400 transition-transform duration-200 {contextDropdownOpen ? 'rotate-180' : ''}"></i>
        </button>
        
        {#if contextDropdownOpen}
          <div 
            transition:fly={{ y: -10, duration: 200 }}
            class="absolute top-[calc(100%+6px)] right-0 left-0 z-50 overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 shadow-[0_16px_40px_rgba(78,91,122,0.15)] dark:shadow-none backdrop-blur-md"
          >
            <div class="p-2 pb-1">
              <div class="relative">
                <input
                  type="text"
                  bind:value={contextSearchQuery}
                  placeholder={t(lang, "searchPlaceholder")}
                  class="w-full rounded-xl py-2 pr-3 pl-8 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:border-[#ff6f61]/75 focus:ring-2 focus:ring-[#ff6f61]/10 transition-all"
                />
                <i class="fa-solid fa-magnifying-glass pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-slate-400"></i>
              </div>
            </div>
            <ul class="max-h-44 overflow-y-auto p-2 pt-1">
              {#each filteredContexts as topic}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <li 
                  class="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 {topic.id === context ? 'bg-[#ff6f61]/10 dark:bg-[#ff6f61]/20 font-bold' : ''}"
                  onclick={() => handleContextSelect(topic.id)}
                >
                  <i class="{topic.icon} w-4 text-[#ff6f61]"></i>
                  <span>{getTopicTitle(lang, topic.id, cacheVersion)}</span>
                  {#if topic.id === context}
                    <i class="fa-solid fa-check ml-auto text-xs text-[#ff6f61]"></i>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>

    <!-- Absurdity level -->
    <fieldset>
      <legend class="mb-3 block text-sm font-bold text-slate-800 dark:text-slate-200">
        {t(lang, "labelLevel")}
      </legend>
      <div class="rounded-3xl bg-white/60 dark:bg-slate-900/60 p-2 border border-slate-200/50 dark:border-slate-700/50">
        <div class="relative grid grid-cols-3 gap-2" style="--active-idx: {level === 'normal' ? 0 : level === 'ridiculous' ? 1 : 2};">
          <!-- Animated Pill -->
          <div 
            class="absolute top-0 bottom-0 left-0 rounded-2xl bg-gradient-to-br from-[#ff6f61] to-[#7668d9] shadow-[0_10px_24px_rgba(255,111,97,0.22)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style="width: calc((100% - 1rem) / 3); transform: translateX(calc(var(--active-idx) * 100% + var(--active-idx) * 0.5rem));"
          ></div>

          <!-- Normal -->
          <label class="relative z-10 cursor-pointer">
            <input class="sr-only peer" type="radio" name="absurdity" value="normal" bind:group={level} />
            <span class="flex flex-col items-center gap-1 rounded-2xl px-3 py-2 sm:py-3 text-center text-[11px] font-extrabold transition sm:flex-row sm:justify-center sm:gap-2 sm:text-sm text-slate-500 dark:text-slate-400 peer-checked:text-white peer-checked:-translate-y-[1px]">
              <i class="fa-solid fa-shield-halved {level === 'normal' ? 'text-white' : 'text-emerald-500'}"></i>
              <span>{t(lang, "levelNormal")}</span>
            </span>
          </label>
          <!-- Ridiculous -->
          <label class="relative z-10 cursor-pointer">
            <input class="sr-only peer" type="radio" name="absurdity" value="ridiculous" bind:group={level} />
            <span class="flex flex-col items-center gap-1 rounded-2xl px-3 py-2 sm:py-3 text-center text-[11px] font-extrabold transition sm:flex-row sm:justify-center sm:gap-2 sm:text-sm text-slate-500 dark:text-slate-400 peer-checked:text-white peer-checked:-translate-y-[1px]">
              <i class="fa-solid fa-face-grin-beam {level === 'ridiculous' ? 'text-white' : 'text-amber-500'}"></i>
              <span>{t(lang, "levelRidiculous")}</span>
            </span>
          </label>
          <!-- Reality Bending -->
          <label class="relative z-10 cursor-pointer">
            <input class="sr-only peer" type="radio" name="absurdity" value="realityBending" bind:group={level} />
            <span class="flex flex-col items-center gap-1 rounded-2xl px-3 py-2 sm:py-3 text-center text-[11px] font-extrabold transition sm:flex-row sm:justify-center sm:gap-2 sm:text-sm text-slate-500 dark:text-slate-400 peer-checked:text-white peer-checked:-translate-y-[1px]">
              <i class="fa-solid fa-globe {level === 'realityBending' ? 'text-white' : 'text-[#7668d9]'}"></i>
              <span>{t(lang, "levelRealityBending")}</span>
            </span>
          </label>
        </div>
      </div>
    </fieldset>

    <!-- Action buttons -->
    <div class="flex flex-col gap-3 pt-1 sm:flex-row">
      <button
        type="submit"
        disabled={isGenerating}
        class="relative flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-base font-black bg-gradient-to-br {btnColorClasses} shadow-[0_18px_32px_rgba(0,0,0,0.1)] hover:-translate-y-[2px] hover:saturate-[1.1] active:translate-y-0 transition-all disabled:opacity-75 disabled:cursor-wait overflow-hidden"
      >
        {#if isGenerating}
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <span class="animate-pulse">{loadingText}</span>
        {:else}
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>{t(lang, "btnGenerate")}</span>
        {/if}
      </button>
      <button
        type="button"
        onclick={onSurprise}
        class="flex items-center justify-center gap-2 rounded-2xl border border-slate-400/20 dark:border-slate-600/30 bg-white/70 dark:bg-slate-800/70 px-4 py-3 sm:px-5 sm:py-4 text-sm font-black text-slate-800 dark:text-slate-200 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 hover:-translate-y-[1px] transition-all sm:flex-none"
      >
        <i class="fa-solid fa-dice text-[#7668d9]"></i>
        <span>{t(lang, "btnSurprise")}</span>
      </button>
    </div>
  </form>
</section>
