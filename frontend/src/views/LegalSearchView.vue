<script setup lang="ts">
import { ref } from 'vue'
import { searchLegal } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Search, Gavel } from 'lucide-vue-next'

const query = ref('')
const isLoading = ref(false)
const results = ref<any[]>([])
const hasSearched = ref(false)

const handleSearch = async () => {
  if (!query.value.trim()) return

  isLoading.value = true
  hasSearched.value = true
  results.value = []

  try {
    const data = await searchLegal(query.value)
    results.value = data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container py-8 px-4 lg:px-6 max-w-4xl">
    <div class="text-center mb-10 space-y-4">
      <h1 class="text-3xl font-bold">Pencarian Legal & Regulasi</h1>
      <p class="text-muted-foreground">Temukan undang-undang, putusan pengadilan, dan dokumen hukum Indonesia.</p>
    </div>

    <!-- Search Input -->
    <div class="flex gap-2 mb-8">
      <Input 
        v-model="query" 
        placeholder="Masukkan kata kunci (contoh: UU Cipta Kerja, Pidana Korupsi)..." 
        class="h-12 text-lg"
        @keyup.enter="handleSearch"
      />
      <Button size="lg" class="h-12 px-8" @click="handleSearch" :disabled="isLoading">
        <Search class="w-4 h-4 mr-2" /> 
        Cari
      </Button>
    </div>

    <!-- Results -->
    <div class="space-y-4">
      <div v-if="isLoading" class="text-center py-10 text-muted-foreground">
        Sedang mencari...
      </div>

      <template v-else-if="hasSearched">
        <div v-if="results.length === 0" class="text-center py-10 text-muted-foreground">
          Tidak ditemukan hasil untuk "{{ query }}".
        </div>

        <Card v-for="item in results" :key="item.id" class="hover:bg-muted/40 transition-colors">
          <CardHeader>
            <CardTitle class="flex items-center gap-2 text-xl">
              <Gavel class="w-5 h-5 text-primary" />
              {{ item.title }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{{ item.description }}</p>
          </CardContent>
        </Card>
      </template>
    </div>
  </div>
</template>
