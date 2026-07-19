<script lang="ts">
  import { onMount } from "svelte";
  import { t, LEVELS } from "./lib/i18n";
  import { pickExcuse, preloadLang, applyName } from "./lib/excuses";
  import { loadLang, saveLang } from "./lib/storage";
  import type { Lang, Context, Level, HistoryEntry } from "./lib/types";

  import Navbar from "./components/Navbar.svelte";
  import Hero from "./components/Hero.svelte";
  import GeneratorForm from "./components/GeneratorForm.svelte";
  import ExcuseResult from "./components/ExcuseResult.svelte";
  import HistoryList from "./components/HistoryList.svelte";
  import PrivacyModal from "./components/PrivacyModal.svelte";
  import StatsModal from "./components/StatsModal.svelte";
  import Footer from "./components/Footer.svelte";
  import Toast from "./components/Toast.svelte";

  // State
  let lang: Lang = $state(loadLang());
  let context: Context = $state("work");
  let level: Level = $state("normal");
  let targetName = $state("");
  let generatorName = $state("");
  let currentExcuse = $state("");
  let generatedCount = $state(0);
  let history: HistoryEntry[] = $state([]);
  let cacheVersion = $state(0);
  let manifest: any = $state(null);

  let isGenerating = $state(false);
  let isDarkMode = $state(false);

  let toastMessage = $state("");
  let toastIcon = $state("");
  let toastVisible = $state(false);
  let loadingText = $state("");
  let loadingInterval: ReturnType<typeof setInterval> | null = null;

  let activeLang = $derived(manifest?.languages.find((l: any) => l.id === lang));
  let isPrivacyModalOpen = $state(false);
  let isStatsModalOpen = $state(false);

  let btnColorClasses = $derived(
    level === "normal"
      ? "from-emerald-500 to-emerald-400 shadow-emerald-500/25 hover:shadow-emerald-500/32 text-white"
      : level === "ridiculous"
      ? "from-amber-500 to-amber-400 shadow-amber-500/25 hover:shadow-amber-500/32 text-white"
      : "from-violet-500 to-violet-400 shadow-violet-500/25 hover:shadow-violet-500/32 text-white"
  );

  // Init
  onMount(async () => {
    await fetchStats();

    // Setup dark mode based on preference or local storage
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      isDarkMode = true;
      document.documentElement.classList.add("dark");
    } else {
      isDarkMode = false;
      document.documentElement.classList.remove("dark");
    }

    try {
      const res = await fetch("/data/manifest.json");
      if (res.ok) {
        manifest = await res.json();
      }
    } catch (e) {
      console.error(e);
    }

    if (manifest && activeLang) {
      const allContexts = activeLang.topics.map((t: any) => t.id);
      await preloadLang(lang, allContexts);
      cacheVersion++;
    }

    await fetchHistory();

    const eventSource = new EventSource("/api/events");
    eventSource.addEventListener("history", (e) => {
      try {
        history = JSON.parse(e.data);
      } catch (err) {}
    });
    eventSource.addEventListener("stats", (e) => {
      try {
        const data = JSON.parse(e.data);
        generatedCount = data.count;
      } catch (err) {}
    });
  });

  // Actions
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }

  async function handleLangSelect(id: string) {
    lang = id as Lang;
    saveLang(lang);
    if (manifest) {
      const newActive = manifest.languages.find((l: any) => l.id === lang);
      if (newActive) {
        const allContexts = newActive.topics.map((t: any) => t.id);
        await preloadLang(lang, allContexts);
        cacheVersion++;

        if (!allContexts.includes(context)) {
          context = allContexts[0]!;
        }
      }
    }
  }

  async function fetchHistory() {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        history = await res.json();
      }
    } catch (err) {
      // silent
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        generatedCount = data.count;
      }
    } catch (err) {
      // silent
    }
  }

  async function generate(overrideCtx?: Context, overrideLvl?: Level) {
    const ctx = overrideCtx ?? context;
    const lvl = overrideLvl ?? level;
    isGenerating = true;

    const texts = t(lang, "loadingTexts") as unknown as string[];
    loadingText = texts[0]!;
    let idx = 0;
    loadingInterval = setInterval(() => {
      idx = (idx + 1) % texts.length;
      loadingText = texts[idx]!;
    }, 600);

    try {
      const excuse = await pickExcuse(lang, ctx, lvl, targetName, generatorName);
      currentExcuse = excuse;
      context = ctx;
      level = lvl;

      // Scroll to result slightly later
      setTimeout(() => {
        document
          .getElementById("resultArea")
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);

      try {
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: excuse,
            context: ctx,
            level: lvl,
            lang,
            name: generatorName,
          }),
        });
      } catch (e) {
        // silent
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (loadingInterval) clearInterval(loadingInterval);
      isGenerating = false;
    }
  }

  async function generateSurprise() {
    if (!activeLang) return;
    const topics = activeLang.topics.map((t: any) => t.id);
    const rndCtx = topics[Math.floor(Math.random() * topics.length)]!;
    const rndLvl = LEVELS[Math.floor(Math.random() * LEVELS.length)]!;
    await generate(rndCtx, rndLvl);
  }

  function showToast(msg: string, icon = "fa-solid fa-check text-emerald-400") {
    toastMessage = msg;
    toastIcon = icon;
    toastVisible = true;
    setTimeout(() => {
      toastVisible = false;
    }, 2400);
  }

  function useHistory(entry: HistoryEntry) {
    const reapplied = applyName(entry.text, targetName, entry.context, entry.lang);
    currentExcuse = reapplied;
    context = entry.context;
    level = entry.level;
  }
</script>

<!-- Background Orbs -->
<div class="fixed z-0 rounded-full blur-[1px] opacity-65 pointer-events-none animate-floaty w-36 h-36 -left-12 top-[18%] bg-[rgba(255,111,97,0.18)] dark:bg-[rgba(255,111,97,0.08)]"></div>
<div class="fixed z-0 rounded-full blur-[1px] opacity-65 pointer-events-none animate-floaty w-48 h-48 -right-16 top-[48%] bg-[rgba(118,104,217,0.14)] dark:bg-[rgba(118,104,217,0.08)]" style="animation-delay: -3s;"></div>

<div class="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-5 sm:px-6 sm:py-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
  
  <Navbar 
    {generatedCount}
    {lang}
    {manifest}
    {activeLang}
    {isDarkMode}
    onLangSelect={handleLangSelect}
    onToggleDarkMode={toggleDarkMode}
    onOpenStats={() => isStatsModalOpen = true}
  />

  <Hero 
    {lang}
    onSurprise={generateSurprise}
  />

  <GeneratorForm
    {lang}
    bind:context
    bind:level
    bind:targetName
    bind:generatorName
    {activeLang}
    {cacheVersion}
    {isGenerating}
    {loadingText}
    {btnColorClasses}
    onGenerate={() => generate()}
    onSurprise={generateSurprise}
  />

  <ExcuseResult
    {currentExcuse}
    {targetName}
    {generatorName}
    {lang}
    {context}
    {level}
    {cacheVersion}
    onRegenerate={() => generate(context, level)}
    onShowToast={showToast}
  />

  <HistoryList
    {history}
    {lang}
    {cacheVersion}
    onUseHistory={useHistory}
    onShowToast={showToast}
  />

  <Footer
    {lang}
    onOpenPrivacy={() => isPrivacyModalOpen = true}
  />
</div>

<Toast
  message={toastMessage}
  icon={toastIcon}
  visible={toastVisible}
/>

<PrivacyModal
  {lang}
  isOpen={isPrivacyModalOpen}
  onClose={() => isPrivacyModalOpen = false}
/>

<StatsModal
  {lang}
  isOpen={isStatsModalOpen}
  count={generatedCount}
  onClose={() => isStatsModalOpen = false}
/>
