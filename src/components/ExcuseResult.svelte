<script lang="ts">
  import { slide, fly } from "svelte/transition";
  import { t, levelLabel } from "../lib/i18n";
  import { getTopicTitle } from "../lib/excuses";
  import type { Lang, Context, Level } from "../lib/types";
  import DocumentExport from "./DocumentExport.svelte";

  let {
    currentExcuse,
    targetName,
    generatorName,
    lang,
    context,
    level,
    cacheVersion,
    onRegenerate,
    onShowToast,
  }: {
    currentExcuse: string;
    lang: Lang;
    context: Context;
    level: Level;
    cacheVersion: number;
    onRegenerate: () => void;
    onShowToast: (msg: string) => void;
  } = $props();

  let documentExportRef: any = $state(null);

  let copied = $state(false);
  let flyThumbsUp = $state(false);
  let isExporting = $state(false);
  let copyResetTimer: ReturnType<typeof setTimeout> | null = null;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(currentExcuse);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = currentExcuse;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    copied = true;
    flyThumbsUp = true;

    if (copyResetTimer) clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      copied = false;
      flyThumbsUp = false;
    }, 2000);

    onShowToast(t(lang, "toastCopied"));
  }

  async function handleExport() {
    if (isExporting) return;
    isExporting = true;
    try {
      await documentExportRef?.downloadImage();
    } finally {
      isExporting = false;
    }
  }
</script>

{#if currentExcuse}
  <div id="resultArea" transition:slide={{ duration: 300 }} class="pt-6">
    <div class="rounded-2xl sm:rounded-[1.5rem] p-4 sm:p-6 border border-[#7668d9]/15 bg-gradient-to-b from-white/85 to-white/65 dark:from-slate-800/85 dark:to-slate-800/65 shadow-sm">
      <div class="mb-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
          <p class="text-xs font-black tracking-[0.24em] text-[#7668d9] uppercase">
            {t(lang, "resultLabel")}
          </p>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[0.65rem] font-bold tracking-[0.02em] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
            {getTopicTitle(lang, context, cacheVersion)}
          </span>
          <span class="text-[0.65rem] font-bold tracking-[0.02em] px-2 py-0.5 rounded-full {level === 'normal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : level === 'ridiculous' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400'}">
            {levelLabel(lang, level)}
          </span>
        </div>
      </div>
      <div class="mb-4 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 p-4 shadow-inner">
        <p class="text-[15px] leading-relaxed font-semibold text-slate-800 dark:text-slate-100 sm:text-lg">
          {currentExcuse}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          onclick={copyText}
          class="relative flex items-center gap-2 rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-sm font-black text-white transition hover:-translate-y-px {copied ? 'bg-emerald-600' : 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600'}"
        >
          <i class="fa-solid {copied ? 'fa-check' : 'fa-copy'}"></i>
          <span>{copied ? t(lang, "btnCopied") : t(lang, "btnCopy")}</span>
          
          {#if flyThumbsUp}
            <span 
              transition:fly={{ y: -30, duration: 800 }} 
              class="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md pointer-events-none"
            >
              👍
            </span>
          {/if}
        </button>
        <a
          href="https://wa.me/?text={encodeURIComponent(currentExcuse)}"
          target="_blank"
          rel="noopener noreferrer"
          title={t(lang, "btnWhatsApp")}
          class="flex items-center justify-center w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white transition hover:-translate-y-px"
        >
          <i class="fa-brands fa-whatsapp text-[1.1rem]"></i>
        </a>
        <button
          type="button"
          title={t(lang, "btnExport")}
          onclick={handleExport}
          disabled={isExporting}
          class="flex items-center justify-center w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-2xl bg-amber-500 hover:bg-amber-600 text-white transition hover:-translate-y-px disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0"
        >
          {#if isExporting}
            <i class="fa-solid fa-spinner animate-spin text-[1.1rem]"></i>
          {:else}
            <i class="fa-solid fa-file-arrow-down text-[1.1rem]"></i>
          {/if}
        </button>
        <button
          type="button"
          onclick={onRegenerate}
          class="ml-auto flex items-center gap-2 rounded-2xl border border-slate-400/20 dark:border-slate-600/30 bg-white/70 dark:bg-slate-800/70 px-3.5 py-2 sm:px-4 sm:py-2.5 text-sm font-black text-slate-800 dark:text-slate-200 transition hover:-translate-y-[1px]"
        >
          <i class="fa-solid fa-rotate-right"></i>
          <span>{t(lang, "btnRegenerate")}</span>
        </button>
      </div>
    </div>
  </div>
{/if}

<DocumentExport
  bind:this={documentExportRef}
  {lang}
  {targetName}
  {generatorName}
  excuseText={currentExcuse}
/>
