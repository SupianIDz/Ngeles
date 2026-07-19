<script lang="ts">
  import { t } from "../lib/i18n";
  import type { Lang } from "../lib/types";
  import { toPng } from 'html-to-image';

  let {
    lang,
    targetName,
    generatorName,
    excuseText
  }: {
    lang: Lang;
    targetName: string;
    generatorName: string;
    excuseText: string;
  } = $props();

  let exportContainer: HTMLElement | null = $state(null);

  export async function downloadImage() {
    if (!exportContainer) return false;
    try {
      const dataUrl = await toPng(exportContainer, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `Surat-Resmi-Ngeles-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      return true;
    } catch (err) {
      console.error('Failed to generate image', err);
      return false;
    }
  }
</script>

<!-- The component is rendered off-screen so html-to-image can capture it without disrupting UI -->
<div class="fixed -left-[9999px] top-0">
  <div bind:this={exportContainer} class="w-[800px] bg-slate-50 text-slate-900 p-8 font-sans relative overflow-hidden">
    
    <!-- Decorative Orbs (Matching App Theme) -->
    <div class="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#ff6f61]/20 blur-3xl"></div>
    <div class="absolute -right-20 -bottom-20 w-[400px] h-[400px] rounded-full bg-[#7668d9]/20 blur-3xl"></div>

    <!-- Inner Content Container -->
    <div class="relative z-10 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/90 shadow-2xl p-10">
      
      <!-- Kop Surat -->
      <div class="flex items-center border-b-4 border-slate-300/50 pb-6 mb-8">
        <div class="mr-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-200 shadow-lg rotate-3 overflow-hidden border-4 border-white">
          <img src="/troll.png" alt="Troll Face" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 pr-4">
          <h1 class="text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff6f61] to-[#7668d9]">{t(lang, 'docHeader')}</h1>
          <h2 class="text-lg font-bold text-slate-700 mt-1">{t(lang, 'docSubheader')}</h2>
          <p class="text-sm mt-1 text-slate-500 font-medium">{t(lang, 'docAddress')}</p>
        </div>
      </div>

      <!-- Judul Surat -->
      <div class="text-center mb-10">
        <h3 class="text-3xl font-black tracking-widest uppercase text-slate-800 drop-shadow-sm">{t(lang, 'docTitle')}</h3>
        <p class="mt-2 font-bold text-slate-400 tracking-widest">{t(lang, 'docNumber')}</p>
      </div>

      <!-- Isi Surat -->
      <div class="text-lg leading-relaxed mb-8 min-h-[200px]">
        <p class="mb-6 font-semibold text-slate-600 text-center">{t(lang, 'docIntro')}</p>
        
        <div class="mb-8 relative">
          <div class="absolute -left-2 -top-6 text-6xl text-slate-300/50 font-serif">"</div>
          <div class="p-8 border-2 border-dashed border-[#7668d9]/30 bg-white/80 rounded-3xl shadow-inner relative z-10">
            <p class="font-black text-2xl text-center text-slate-800 leading-snug">{excuseText}</p>
          </div>
          <div class="absolute -right-2 -bottom-10 text-6xl text-slate-300/50 font-serif">"</div>
        </div>
        
        <div class="grid grid-cols-2 gap-6 text-lg mt-12">
          <div class="bg-white/60 p-5 rounded-2xl border border-white">
            <p class="text-[#7668d9] text-xs font-black uppercase mb-1 tracking-widest">{t(lang, 'docTo')}</p>
            <p class="font-bold text-slate-800">{targetName || t(lang, 'docDefaultTo')}</p>
          </div>
          <div class="bg-white/60 p-5 rounded-2xl border border-white">
            <p class="text-[#ff6f61] text-xs font-black uppercase mb-1 tracking-widest">{t(lang, 'docFrom')}</p>
            <p class="font-bold text-slate-800">{generatorName || t(lang, 'docDefaultFrom')}</p>
          </div>
        </div>
      </div>

      <!-- Tanda Tangan -->
      <div class="flex justify-end mb-4 mt-12">
        <div class="text-center w-64 relative">
          <p class="mb-20 font-semibold text-slate-500">{t(lang, 'docSignLabel')}</p>
          
          <!-- Stempel Konyol -->
          <div class="absolute top-4 right-10 opacity-90 rotate-[-15deg] pointer-events-none">
            <div class="w-32 h-32 rounded-full border-[6px] border-double border-red-500 flex flex-col items-center justify-center bg-red-50/50 backdrop-blur-sm shadow-lg">
              <i class="fa-solid fa-stamp text-red-500/70 text-3xl mb-1"></i>
              <span class="text-red-600 font-black text-xl tracking-widest mt-0.5">APPROVED</span>
            </div>
          </div>
          
          <p class="font-black text-xl text-slate-800 decoration-wavy decoration-[#ff6f61] underline underline-offset-4">{generatorName || t(lang, 'docDefaultFrom')}</p>
          <p class="text-sm text-slate-400 mt-1 font-bold">{t(lang, 'docSignRole')}</p>
        </div>
      </div>

    </div>
    
    <!-- Footer -->
    <div class="mt-6 text-center">
      <p class="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-loose max-w-2xl mx-auto">
        <i class="fa-solid fa-triangle-exclamation text-amber-500 mr-1"></i> 
        {t(lang, 'docFooter')}
      </p>
    </div>
  </div>
</div>
