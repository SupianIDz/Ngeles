<script lang="ts">
  import { fly } from "svelte/transition";
  
  let {
    message,
    icon = "fa-solid fa-check text-emerald-400",
    visible
  }: {
    message: string;
    icon?: string;
    visible: boolean;
  } = $props();
</script>

{#if visible}
  <div
    transition:fly={{ y: 20, duration: 300 }}
    role="status"
    class="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-slate-800 dark:bg-slate-200 px-5 py-3 text-sm font-bold text-white dark:text-slate-900 shadow-xl"
  >
    <i class={icon}></i>
    <span>{message}</span>
  </div>
{/if}
