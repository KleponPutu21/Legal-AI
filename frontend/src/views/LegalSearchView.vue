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
  <div class="min-h-screen bg-gradient-to-br from-[#e7f6f9] via-white to-[#d9d9d9]/30 flex flex-col relative overflow-hidden">
    
    <!-- Decorative background blobs -->
    <div class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#14a2ba]/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#efe62f]/10 rounded-full blur-[80px] pointer-events-none"></div>

    <!-- Header -->
    <header class="w-full px-6 py-6 flex items-center justify-between relative z-20 max-w-6xl mx-auto">
      <div class="flex items-center gap-4">
        <div class="relative">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#125d72] to-[#14a2ba] flex items-center justify-center shadow-lg shadow-[#125d72]/20">
            <Search class="w-7 h-7 text-white" />
          </div>
          <span class="absolute bottom-0 right-0 w-3 h-3 bg-[#efe62f] border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[#125d72] tracking-tight">Pencarian Legal & Regulasi</h1>
          <p class="text-xs text-[#125d72]/70 font-medium">PLN IconPlus Support</p>
        </div>
      </div>
    </header>

    <!-- Main Content - Borderless -->
    <main class="flex-1 w-full max-w-5xl mx-auto flex flex-col relative z-10 overflow-hidden px-4 md:px-6 pb-6">
      
      <!-- Search & Filters Section -->
      <div class="space-y-4 mb-6 relative z-30 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <!-- Search Bar -->
        <div class="flex gap-2">
            <div class="relative flex-1 group">
              <div class="absolute inset-0 bg-white/40 rounded-xl blur-md transform translate-y-2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <div class="relative">
                 <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#125d72]/50" />
                 <Input 
                   v-model="query" 
                   placeholder="Kata kunci (contoh: 'Cipta Kerja', 'Korupsi')" 
                   class="pl-12 h-12 md:h-14 rounded-xl bg-white/80 backdrop-blur-md border-[#125d72]/10 focus:border-[#14a2ba] focus:ring-[#14a2ba]/20 text-lg shadow-sm transition-all duration-300"
                   @keyup.enter="handleSearch"
                 />
              </div>
            </div>
            <Button 
              size="lg" 
              class="h-12 md:h-14 px-6 md:px-8 rounded-xl bg-gradient-to-r from-[#125d72] to-[#14a2ba] shadow-lg shadow-[#125d72]/20 hover:shadow-[#125d72]/30 hover:scale-105 transition-all duration-300"
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
                :class="['h-12 md:h-14 w-12 md:w-14 rounded-xl border-[#125d72]/10 backdrop-blur-md transition-all duration-300', showFilters ? 'bg-[#125d72]/10 text-[#125d72] ring-2 ring-[#125d72]/10' : 'bg-white/80 text-[#125d72]/70 hover:bg-white']"
                @click="showFilters = !showFilters"
                title="Filter Pencarian"
            >
                <Filter class="w-5 h-5" />
            </Button>
        </div>

        <!-- Filters Panel (Collapsible) -->
        <div 
           v-if="showFilters"
           class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm animate-in slide-in-from-top-2 duration-300"
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
      <ScrollArea class="flex-1 -mx-4 px-4 md:-mx-6 md:px-6">
         <div class="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <!-- Loading State -->
             <div v-if="isLoading" class="space-y-4 py-8">
                <div v-for="i in 3" :key="i" class="h-32 rounded-2xl bg-white/40 animate-pulse"></div>
             </div>

             <!-- Error State -->
             <div v-else-if="errorMessage" class="flex flex-col items-center justify-center py-20 text-destructive text-center">
                <div class="w-16 h-16 mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X class="w-8 h-8" />
                </div>
                <p class="text-lg font-bold">{{ errorMessage }}</p>
                <p class="text-sm opacity-80 mt-2">Pastikan backend berjalan atau periksa koneksi internet Anda.</p>
             </div>

             <!-- Empty State / Welcome -->
             <div v-else-if="!hasSearched && results.length === 0" class="flex flex-col items-center justify-center py-20 text-[#125d72]/40 text-center">
                <div class="w-20 h-20 rounded-full bg-white/40 flex items-center justify-center mb-6 shadow-sm">
                   <Search class="w-10 h-10 opacity-30" />
                </div>
                <p class="text-xl font-medium">Mulai pencarian dengan kata kunci atau filter</p>
                <p class="text-sm mt-2 max-w-md mx-auto">Temukan ribuan dokumen undang-undang dan peraturan pemerintah dalam satu tempat.</p>
             </div>

             <!-- No Results -->
             <div v-else-if="hasSearched && results.length === 0" class="flex flex-col items-center justify-center py-20 text-[#125d72]/60 text-center">
                <X class="w-12 h-12 mb-2 text-[#125d72]/30" />
                <p>Tidak ditemukan dokumen yang cocok.</p> 
                <Button variant="link" class="text-[#14a2ba]" @click="clearFilters">Reset semua filter</Button>
             </div>

             <!-- Results List -->
             <div v-else class="space-y-4">
                <div 
                  v-for="(item, index) in results" 
                  :key="item.id" 
                  class="group bg-white/70 hover:bg-white/95 backdrop-blur-sm border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-2 fill-mode-forwards"
                  :style="{ animationDelay: `${index * 50}ms` }"
                >
                   <div class="flex items-start gap-4">
                      <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#125d72] to-[#14a2ba] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#125d72]/10 group-hover:scale-110 transition-transform duration-300">
                         <Gavel class="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div class="flex-1 space-y-2">
                         <div class="flex flex-wrap gap-2 mb-1">
                            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-[#125d72]/5 text-[#125d72] border border-[#125d72]/10">
                               {{ item.type || 'Regulasi' }}
                            </span>
                            <span v-if="item.status" class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                               <Check class="w-3 h-3 mr-1" /> {{ item.status }}
                            </span>
                         </div>
                         <h3 class="text-lg md:text-xl font-bold text-[#125d72] leading-tight group-hover:text-[#14a2ba] transition-colors">
                            {{ item.title }}
                         </h3>
                         <p class="text-sm md:text-base text-[#125d72]/70 line-clamp-2 leading-relaxed">
                            {{ item.description }}
                         </p>
                      </div>
                      <div class="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                         <ScrollArea class="w-8 h-8 flex items-center justify-center rounded-full bg-[#125d72]/5 text-[#125d72]">
                           < ChevronDown class="w-5 h-5 -rotate-90" />
                         </ScrollArea>
                      </div>
                   </div>
                </div>
             </div>
         </div>
      </ScrollArea>

    </main>
  </div>
</template>
