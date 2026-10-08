<template>
  <main class="min-h-screen bg-[#008080] p-4 flex items-center justify-center font-['Tahoma','MS_Sans_Serif',sans-serif] text-black">
    <!-- Fenêtre principale -->
    <div class="w-full max-w-3xl bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black p-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] flex flex-col">
      
      <!-- Barre de titre -->
      <header class="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white flex items-center justify-between px-1 py-0.5 select-none">
        <div class="flex items-center gap-1.5 font-bold text-sm tracking-wide">
          <div class="bg-white text-[#000080] w-4 h-4 flex items-center justify-center text-xs border border-white">C</div>
          Cordialement.exe
        </div>
        <button class="bg-[#c0c0c0] text-black w-4 h-4 flex items-center justify-center font-bold text-xs border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-gray-300">
          <span class="translate-y-[-1px]">x</span>
        </button>
      </header>

      <!-- Barre de menus -->
      <nav class="flex gap-4 text-xs py-1 px-2 border-b border-[#808080] mb-2 select-none">
        <span><span class="underline">F</span>ichier</span>
        <span><span class="underline">E</span>dition</span>
        <span><span class="underline">A</span>ffichage</span>
        <span><span class="underline">?</span> Aide</span>
      </nav>

      <div class="p-3 flex flex-col gap-5">
        <p class="text-sm">Le traducteur corporate parodique. Convertissez vos pensées brutes en langage "politiquement correct".</p>

        <!-- Zone d'entrée (La pensée brute) -->
        <section class="flex flex-col gap-1">
          <label class="text-sm font-semibold flex items-center gap-2">
            La pensée brute :
          </label>
          <div class="border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-white">
            <textarea
              v-model="inputText"
              class="w-full h-24 p-2 text-sm font-mono resize-none outline-none focus:bg-[#ffffcc]"
              placeholder="Tapez ici sous le coup de l'émotion..."
            ></textarea>
          </div>
        </section>

        <!-- Bouton d'action -->
        <div class="flex justify-start">
          <button
            @click="translateText"
            :disabled="loading || !inputText"
            class="px-8 py-2 bg-[#c0c0c0] font-bold text-sm border-[3px] border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white disabled:opacity-50 disabled:active:border-t-white disabled:active:border-l-white disabled:active:border-b-black disabled:active:border-r-black flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-none"
          >
            Traduire en langage Corporate
          </button>
        </div>

        <!-- Zone de sortie (Le résultat) -->
        <section class="flex flex-col border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-white p-1">
          <div class="bg-[#c0c0c0] border-b-2 border-[#808080] p-2 text-xs flex flex-col gap-1">
            <div class="flex items-center"><span class="w-16 text-[#808080]">De:</span> <span class="bg-white border border-[#808080] px-1 py-0.5 w-full">direction@entreprise.com</span></div>
            <div class="flex items-center"><span class="w-16 text-[#808080]">À:</span> <span class="bg-white border border-[#808080] px-1 py-0.5 w-full">collaborateur@entreprise.com</span></div>
            <div class="flex items-center"><span class="w-16 text-[#808080]">Objet:</span> <span class="bg-white border border-[#808080] px-1 py-0.5 w-full">RE: Mise au point</span></div>
          </div>
          
          <div class="p-4 text-sm min-h-[120px] flex flex-col bg-white">
            <div v-if="loading" class="text-gray-500 italic animate-pulse">
              Génération en cours... (synergie en approche)
            </div>
            <div v-else-if="error" class="text-red-600 font-bold">
              Erreur système : {{ error }}
            </div>
            <div v-else-if="translatedText">
              <p class="mb-4">Bonjour,</p>
              <p class="text-[#0000ee]">{{ translatedText }}</p>
              <p class="mt-8">Cordialement,</p>
            </div>
            <div v-else class="text-[#808080] italic flex h-full items-center justify-center">
              (Le résultat s'affichera ici)
            </div>
          </div>
        </section>
      </div>

      <!-- Barre d'état -->
      <footer class="mt-4 border-t-2 border-t-[#808080] border-b-white px-2 py-1 text-xs flex justify-between bg-[#c0c0c0]">
        <span>Prêt</span>
        <span class="text-[#808080]">© 2026 Cordialement Inc.</span>
      </footer>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const inputText = ref('');
const translatedText = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

const translateText = async () => {
  if (!inputText.value) return;
  
  loading.value = true;
  error.value = null;
  
  // Petite pause artificielle pour simuler la "synergie" et rendre l'interface plus vivante
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: inputText.value })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur réseau (${response.status})`);
    }
    
    const data = await response.json();
    translatedText.value = data.translated || 'Aucun retour. Synergie perdue.';
  } catch (err: any) {
    error.value = err.message || 'Erreur inconnue';
    translatedText.value = '';
  } finally {
    loading.value = false;
  }
};
</script>
