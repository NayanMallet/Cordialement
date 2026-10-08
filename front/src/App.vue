<template>
  <main class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
    <div class="w-full max-w-xl mx-auto flex flex-col items-center text-center space-y-8">
      
      <!-- En-tête -->
      <header class="space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
          <span>Cloud Edition ☁️</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300">
          Cepamafaute
        </h1>
        <p class="text-slate-400 text-sm sm:text-base max-w-md">
          Le générateur d'excuses professionnelles infaillibles pour développeurs et chefs de projet.
        </p>
      </header>

      <!-- Zone d'affichage de l'excuse -->
      <section class="w-full relative group" aria-live="polite">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div class="relative w-full min-h-[160px] p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-xl transition-all">
          
          <div v-if="loading" class="flex flex-col items-center gap-3">
            <svg class="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <p class="text-slate-400 text-sm italic">Recherche d'un bouc émissaire valide...</p>
          </div>

          <div v-else-if="error" class="space-y-2 text-rose-400">
            <p class="text-sm font-medium">{{ error }}</p>
            <p class="text-xs text-slate-500">Vérifiez que le backend et le proxy sont bien opérationnels.</p>
          </div>

          <div v-else class="space-y-4 w-full">
            <p class="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed font-sans">
              "{{ currentExcuse }}"
            </p>
            <div v-if="copied" class="text-xs text-emerald-400 font-medium animate-pulse">
              ✓ Excuse copiée dans le presse-papier !
            </div>
          </div>

        </div>
      </section>

      <!-- Bouton d'action principal -->
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        <button
          @click="fetchExcuse"
          :disabled="loading"
          class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
        >
          <span class="flex items-center justify-center gap-2">
            <span>🎲</span>
            <span>Générer une excuse</span>
          </span>
        </button>

        <button
          v-if="currentExcuse && !loading && !error"
          @click="copyToClipboard"
          class="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-base rounded-xl border border-slate-700 active:scale-95 transition duration-200 cursor-pointer flex items-center justify-center gap-2"
          title="Copier l'excuse"
        >
          <span>📋</span>
          <span>Copier</span>
        </button>
      </div>

      <!-- Footer minimaliste -->
      <footer class="pt-8 text-xs text-slate-600 border-t border-slate-900 w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 Cepamafaute - Microservices Cloud</span>
        <span class="inline-flex items-center gap-1">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          Docker Native Infrastructure
        </span>
      </footer>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const currentExcuse = ref<string>('Cliquez sur le bouton ci-dessous pour trouver une excuse imparable.');
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const copied = ref<boolean>(false);

const fetchExcuse = async (): Promise<void> => {
  loading.value = true;
  error.value = null;
  copied.value = false;

  try {
    const response = await fetch('/api/excuse');
    if (!response.ok) {
      throw new Error(`Erreur serveur (${response.status})`);
    }
    const data = await response.json();
    currentExcuse.value = data.excuse || 'Aucune excuse trouvée.';
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = `Impossible de récupérer une excuse : ${err.message}`;
    } else {
      error.value = 'Une erreur inattendue est survenue.';
    }
  } finally {
    loading.value = false;
  }
};

const copyToClipboard = async (): Promise<void> => {
  if (!currentExcuse.value) return;
  try {
    await navigator.clipboard.writeText(currentExcuse.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2500);
  } catch (err) {
    console.error('Erreur lors de la copie', err);
  }
};

onMounted(() => {
  fetchExcuse();
});
</script>
