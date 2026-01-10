<script setup lang="ts">
import { ref } from 'vue'
import { searchLegal, type SearchFilters } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Gavel, Filter, X, ChevronDown, Check } from 'lucide-vue-next'

const query = ref('')
const isLoading = ref(false)
const results = ref<any[]>([])
const hasSearched = ref(false)
const showFilters = ref(false)
const errorMessage = ref('')

const filters = ref<SearchFilters>({
  type: '',
  jurisdiction: '',
  status: '',
  year: '',
  number: ''
})

// Filter Options
const typeOptions = ['Undang-undang', 'Peraturan Pemerintah', 'Peraturan Presiden', 'Peraturan Menteri', 'Keputusan Menteri', 'Peraturan Daerah']
const jurisdictionOptions = ['Nasional', 'Provinsi', 'Kota/Kabupaten', 'Internasional']
const statusOptions = ['Berlaku', 'Dicabut', 'Diubah Sebagian', 'Tidak Berlaku']

const handleSearch = async () => {
  if (!query.value.trim() && !hasSearched.value) return

  isLoading.value = true
  hasSearched.value = true
  errorMessage.value = ''
  showFilters.value = false // Auto-close filters
  // Mock clear results for loading effect
  results.value = []

  try {
    // Pass query and active filters
    const data = await searchLegal(query.value, filters.value)
    results.value = data
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.message || 'Terjadi kesalahan saat mencari data'
  } finally {
    isLoading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    type: '',
    jurisdiction: '',
    status: '',
    year: '',
    number: ''
  }
}
</script>

<template>
   <!-- Main container with branded gradient background (Matching Chatbot) -->
  <div class="min-h-screen bg-gradient-to-br from-[#e7f6f9] via-white to-[#d9d9d9]/30 flex flex-col p-4 md:p-6 lg:p-8 relative overflow-hidden">
    
    <!-- Decorative background blobs -->
    <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#14a2ba]/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#efe62f]/10 rounded-full blur-[80px] pointer-events-none"></div>

    <!-- Main Content Card -->
    <div class="w-full max-w-6xl mx-auto h-[85vh] bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] flex flex-col overflow-hidden relative z-10">
      
      <!-- Header Section -->
      <div class="px-6 py-6 md:px-10 md:py-8 text-center space-y-2 border-b border-white/20 bg-white/40">
        <h1 class="text-2xl md:text-3xl font-bold text-[#125d72]">Pencarian Legal & Regulasi</h1>
        <p class="text-[#125d72]/70 text-sm md:text-base max-w-2xl mx-auto">
          Temukan undang-undang, putusan pengadilan, dan dokumen hukum Indonesia dengan filter lengkap.
        </p>
      </div>

       <!-- Search & Filters Container -->
       <div class="p-6 md:px-10 space-y-4">
          <!-- Search Bar -->
          <div class="flex gap-2 relative z-20">
            <div class="relative flex-1">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#125d72]/50" />
              <Input 
                v-model="query" 
                placeholder="Kata kunci (contoh: 'Cipta Kerja', 'Korupsi')" 
                class="pl-12 h-12 md:h-14 rounded-xl bg-white/80 border-[#125d72]/10 focus:border-[#14a2ba] focus:ring-[#14a2ba]/20 text-lg shadow-sm"
                @keyup.enter="handleSearch"
              />
            </div>
            <Button 
              size="lg" 
              class="h-12 md:h-14 px-6 md:px-8 rounded-xl bg-gradient-to-r from-[#125d72] to-[#14a2ba] shadow-md hover:opacity-90 transition-opacity"
              @click="handleSearch"
              :disabled="isLoading"
            >
              <template v-if="isLoading">
                <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                Mencari...
              </template>
              <template v-else>
                Cari
              </template>
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                :class="['h-12 md:h-14 w-12 md:w-14 rounded-xl border-[#125d72]/10 bg-white/80', showFilters ? 'bg-[#125d72]/10 text-[#125d72]' : 'text-[#125d72]/70']"
                @click="showFilters = !showFilters"
                title="Filter Pencarian"
            >
                <Filter class="w-5 h-5" />
            </Button>
          </div>

          <!-- Filters Panel (Collapsible) -->
          <div 
             v-if="showFilters"
             class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-white/50 border border-white/40 shadow-inner animate-in slide-in-from-top-2 duration-300"
          >
             <!-- Jenis Legal -->
             <div class="space-y-1">
                <label class="text-xs font-semibold text-[#125d72] uppercase tracking-wider ml-1">Jenis Peraturan</label>
                <div class="relative">
                  <select v-model="filters.type" class="w-full h-10 pl-3 pr-8 rounded-lg border border-[#125d72]/10 bg-white/80 text-sm text-[#125d72] focus:ring-1 focus:ring-[#14a2ba] appearance-none cursor-pointer hover:bg-white transition-colors">
                    <option value="">Semua Jenis</option>
                    <option v-for="opt in typeOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                  <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#125d72]/50 pointer-events-none" />
                </div>
             </div>

             <!-- Yuridiksi -->
             <div class="space-y-1">
                <label class="text-xs font-semibold text-[#125d72] uppercase tracking-wider ml-1">Yuridiksi</label>
                <div class="relative">
                   <select v-model="filters.jurisdiction" class="w-full h-10 pl-3 pr-8 rounded-lg border border-[#125d72]/10 bg-white/80 text-sm text-[#125d72] focus:ring-1 focus:ring-[#14a2ba] appearance-none cursor-pointer hover:bg-white transition-colors">
                    <option value="">Semua Yuridiksi</option>
                    <option v-for="opt in jurisdictionOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                   <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#125d72]/50 pointer-events-none" />
                </div>
             </div>

             <!-- Status -->
             <div class="space-y-1">
                <label class="text-xs font-semibold text-[#125d72] uppercase tracking-wider ml-1">Status</label>
                <div class="relative">
                   <select v-model="filters.status" class="w-full h-10 pl-3 pr-8 rounded-lg border border-[#125d72]/10 bg-white/80 text-sm text-[#125d72] focus:ring-1 focus:ring-[#14a2ba] appearance-none cursor-pointer hover:bg-white transition-colors">
                    <option value="">Semua Status</option>
                    <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                   <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#125d72]/50 pointer-events-none" />
                </div>
             </div>

              <!-- Tahun -->
             <div class="space-y-1">
                <label class="text-xs font-semibold text-[#125d72] uppercase tracking-wider ml-1">Tahun</label>
                <Input v-model="filters.year" placeholder="Contoh: 2023" class="h-10 bg-white/80 border-[#125d72]/10 text-sm" />
             </div>

              <!-- Nomor -->
             <div class="space-y-1">
                <label class="text-xs font-semibold text-[#125d72] uppercase tracking-wider ml-1">Nomor</label>
                 <Input v-model="filters.number" placeholder="Contoh: 11" class="h-10 bg-white/80 border-[#125d72]/10 text-sm" />
             </div>

             <!-- Actions -->
             <div class="flex items-end">
                <Button variant="ghost" size="sm" class=" text-destructive hover:text-destructive hover:bg-destructive/10 w-full" @click="clearFilters">
                   <X class="w-4 h-4 mr-1" /> Reset Filter
                </Button>
             </div>
          </div>
       </div>

      <!-- Results Area -->
      <ScrollArea class="flex-1 px-6 md:px-10 pb-6">
         <!-- Loading State -->
         <div v-if="isLoading" class="space-y-4 py-8">
            <div v-for="i in 3" :key="i" class="h-32 rounded-xl bg-white/40 animate-pulse"></div>
         </div>

         <!-- Error State -->
         <div v-else-if="errorMessage" class="flex flex-col items-center justify-center h-[40vh] text-destructive text-center p-4">
            <div class="w-16 h-16 mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <X class="w-8 h-8" />
            </div>
            <p class="text-lg font-bold">{{ errorMessage }}</p>
            <p class="text-sm opacity-80 mt-2">Pastikan backend berjalan atau periksa koneksi internet Anda.</p>
         </div>

         <!-- Empty State / Welcome -->
         <div v-else-if="!hasSearched && results.length === 0" class="flex flex-col items-center justify-center h-[40vh] text-[#125d72]/40 text-center">
            <Search class="w-16 h-16 mb-4 opacity-20" />
            <p class="text-lg font-medium">Mulai pencarian dengan kata kunci atau filter</p>
         </div>

         <!-- No Results -->
         <div v-else-if="hasSearched && results.length === 0" class="flex flex-col items-center justify-center h-[40vh] text-[#125d72]/60 text-center">
            <X class="w-12 h-12 mb-2 text-[#125d72]/30" />
            <p>Tidak ditemukan dokumen yang cocok.</p> 
            <Button variant="link" class="text-[#14a2ba]" @click="clearFilters">Reset semua filter</Button>
         </div>

         <!-- Results List -->
         <div v-else class="space-y-4 pb-10">
            <div 
              v-for="(item, index) in results" 
              :key="item.id" 
              class="group bg-white/60 hover:bg-white/90 backdrop-blur-sm border border-white/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-2 fill-mode-forwards"
              :style="{ animationDelay: `${index * 50}ms`, opacity: 0 }"
            >
               <div class="flex items-start gap-4">
                  <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#14a2ba]/10 flex items-center justify-center flex-shrink-0 text-[#14a2ba] group-hover:bg-[#14a2ba] group-hover:text-white transition-colors">
                     <Gavel class="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div class="flex-1 space-y-1">
                     <div class="flex flex-wrap gap-2 mb-1">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#125d72]/10 text-[#125d72]">
                           {{ item.type || 'Regulasi' }}
                        </span>
                        <span v-if="item.status" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
                           <Check class="w-3 h-3 mr-1" /> {{ item.status }}
                        </span>
                     </div>
                     <h3 class="text-base md:text-lg font-bold text-[#125d72] leading-tight group-hover:text-[#14a2ba] transition-colors">
                        {{ item.title }}
                     </h3>
                     <p class="text-sm text-[#125d72]/70 line-clamp-2">
                        {{ item.description }}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </ScrollArea>

    </div>
  </div>
</template>
