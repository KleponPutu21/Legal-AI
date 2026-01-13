<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { analyzeDocument } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Upload, FileText, AlertCircle, CheckCircle, FileSearch, X, Trash2 } from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true
})

const renderContent = (content: string | null) => {
  if (!content) return ''
  return md.render(content)
}

const file = ref<File | null>(null)
const isLoading = ref(false)
const result = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const resultSection = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const selectedFile = target.files[0]
    if (selectedFile) {
      file.value = selectedFile
      result.value = null
      errorMessage.value = null
    }
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const removeFile = () => {
  file.value = null
  result.value = null
  errorMessage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const scrollToResult = () => {
    nextTick(() => {
        if (resultSection.value) {
            resultSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    })
}

const handleAnalyze = async () => {
  if (!file.value) return

  // If already has result, just scroll to it
  if (result.value && !isLoading.value) {
      scrollToResult()
      return
  }

  isLoading.value = true
  result.value = null
  errorMessage.value = null

  try {
    const response = await analyzeDocument(file.value)
    result.value = response
    scrollToResult()
  } catch (err) {
    errorMessage.value = "Terjadi kesalahan saat menganalisa dokumen."
    scrollToResult()
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Main container with branded gradient background -->
  <div class="min-h-screen bg-gradient-to-br from-[#e7f6f9] via-white to-[#d9d9d9]/30 flex flex-col relative overflow-x-hidden">
    
    <!-- Decorative background blobs -->
    <div class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#14a2ba]/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#efe62f]/10 rounded-full blur-[80px] pointer-events-none"></div>

    <!-- Header -->
    <header class="w-full px-6 py-6 flex items-center justify-between relative z-20 max-w-6xl mx-auto">
      <div class="flex items-center gap-4">
        <div class="relative">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#125d72] to-[#14a2ba] flex items-center justify-center shadow-lg shadow-[#125d72]/20">
            <FileSearch class="w-7 h-7 text-white" />
          </div>
          <span class="absolute bottom-0 right-0 w-3 h-3 bg-[#efe62f] border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#125d72] tracking-tight">Document Analysis</h1>
          <p class="text-xs text-[#125d72]/70 font-medium">PLN IconPlus Support</p>
        </div>
      </div>
    </header>

    <!-- Content Area - Borderless & Spacious -->
    <main class="flex-1 w-full max-w-4xl mx-auto p-6 md:p-8 flex flex-col relative z-10">
      
      <!-- Introduction -->
      <div class="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 class="text-3xl md:text-4xl font-bold text-[#125d72]">Analisa Dokumen Hukum</h2>
        <p class="text-lg text-[#125d72]/70 max-w-2xl mx-auto leading-relaxed">
          Unggah dokumen PDF atau DOCX Anda untuk mendapatkan analisa hukum yang mendalam dan akurat berbasis AI.
        </p>
      </div>

      <!-- Upload Section -->
      <div class="relative group max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div 
          class="border-3 border-dashed border-[#14a2ba]/20 rounded-[2.5rem] p-12 transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
          :class="file ? 'bg-[#e7f6f9]/40 border-[#14a2ba]/50' : 'bg-white/30 hover:bg-white/50 hover:border-[#14a2ba] hover:shadow-lg hover:shadow-[#14a2ba]/5'"
        >
          <input 
            type="file" 
            ref="fileInput"
            class="absolute inset-0 opacity-0 cursor-pointer z-10" 
            accept=".pdf,.doc,.docx" 
            @change="handleFileChange"
          />
          
          <!-- Icon & Text -->
          <div v-if="!file" class="flex flex-col items-center gap-6 text-[#125d72]/60 group-hover:text-[#125d72] transition-colors">
            <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-white/80 to-white/40 flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300 ring-4 ring-white/30">
               <Upload class="w-10 h-10 text-[#14a2ba]" />
            </div>
            <div class="text-center space-y-2">
              <p class="font-semibold text-xl">Klik atau seret file ke sini</p>
              <p class="text-sm opacity-70">Mendukung format PDF dan DOCX hingga 10MB</p>
            </div>
          </div>

          <!-- Selected File State -->
          <div v-else class="flex flex-col items-center gap-4 relative z-20">
             <div class="absolute top-0 right-0 p-2 z-30">
                <button @click.prevent="removeFile" class="p-2 rounded-full bg-white/50 hover:bg-red-100 text-[#125d72]/50 hover:text-red-600 transition-colors" title="Hapus file">
                   <X class="w-5 h-5" />
                </button>
             </div>
            <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#125d72] to-[#14a2ba] flex items-center justify-center shadow-xl shadow-[#125d72]/20 mb-2 ring-4 ring-white/50">
              <FileText class="w-10 h-10 text-white" />
            </div>
            <div class="text-center space-y-1">
               <p class="font-bold text-[#125d72] text-xl">{{ file.name }}</p>
               <p class="text-sm text-[#125d72]/60 bg-white/50 px-4 py-1.5 rounded-full inline-block font-medium">
                 {{ (file.size / 1024).toFixed(2) }} KB
               </p>
            </div>
            <p @click="triggerFileInput" class="text-sm text-[#14a2ba] mt-4 font-semibold cursor-pointer hover:underline hover:scale-105 transition-transform z-30">Ganti file dokumen</p>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex justify-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
         <Button 
          class="min-w-[240px] h-14 rounded-full text-lg font-semibold shadow-xl shadow-[#125d72]/20 hover:shadow-[#125d72]/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-[#125d72] to-[#14a2ba] text-white"
          :disabled="(!file && !result) || isLoading" 
          @click="handleAnalyze"
        >
          <template v-if="isLoading">
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sedang Menganalisa...</span>
            </div>
          </template>
          <template v-else>
            {{ result ? 'Lihat Hasil Analisa' : 'Mulai Analisa Dokumen' }}
          </template>
        </Button>
      </div>

      <!-- Result Section -->
      <div v-if="result || errorMessage" ref="resultSection" class="mt-16 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
         <div 
           class="max-w-3xl mx-auto rounded-[2rem] p-8 md:p-10 backdrop-blur-md border shadow-sm transition-all duration-500"
           :class="errorMessage ? 'bg-red-50/90 border-red-100' : 'bg-white/70 border-white/40'"
         >
            <div class="flex items-center gap-4 mb-6 pb-6 border-b" :class="errorMessage ? 'border-red-100' : 'border-[#125d72]/10'">
               <div class="p-3 rounded-2xl" :class="errorMessage ? 'bg-red-100' : 'bg-[#e7f6f9]'">
                 <AlertCircle v-if="errorMessage" class="w-6 h-6 text-red-600" />
                 <CheckCircle v-else class="w-6 h-6 text-[#125d72]" />
               </div>
               <h3 class="font-bold text-xl" :class="errorMessage ? 'text-red-700' : 'text-[#125d72]'">
                 {{ errorMessage ? 'Analisa Gagal' : 'Hasil Analisa AI' }}
               </h3>
            </div>
            
            <div v-if="errorMessage" class="text-red-600 font-medium leading-relaxed">
              {{ errorMessage }}
            </div>
            <div v-else class="prose prose-lg text-[#125d72]/80 leading-relaxed max-w-none prose-headings:text-[#125d72] prose-strong:text-[#125d72] prose-ul:text-[#125d72]/80 prose-ol:text-[#125d72]/80">
              <div v-html="renderContent(result)"></div>
            </div>
         </div>
      </div>

    </main>
  </div>
</template>

