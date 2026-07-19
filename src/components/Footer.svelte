<script lang="ts">
  import { t } from "../lib/i18n";
  import type { Lang } from "../lib/types";

  let {
    lang,
    onOpenPrivacy,
  }: {
    lang: Lang;
    onOpenPrivacy: () => void;
  } = $props();
</script>

<footer class="mt-8 flex justify-center pb-4">
  <p class="flex items-center gap-2 text-[10px] font-medium text-slate-400 dark:text-slate-500">
    <button 
      class="hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2 decoration-slate-300 dark:decoration-slate-600 transition-colors"
      onclick={onOpenPrivacy}
    >
      {t(lang, "privacyBtn")}
    </button>
    <span>&bull;</span>
    <a 
      href="https://github.com/SupianIDz/Ngeles"
      target="_blank"
      rel="noopener noreferrer"
      class="hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2 decoration-slate-300 dark:decoration-slate-600 transition-colors"
    >
      {t(lang, "githubBtn")}
    </a>
  </p>
</footer>
