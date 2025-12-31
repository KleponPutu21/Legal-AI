<script setup lang="ts">
import { ref } from 'vue'
import { analyzeDocument } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-vue-next'

const file = ref<File | null>(null)
const isLoading = ref(false)
const result = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

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

const handleAnalyze = async () => {
  if (!file.value) return

  isLoading.value = true
  result.value = null
  errorMessage.value = null

  try {
    const response = await analyzeDocument(file.value)
    result.value = response
  } catch (err) {
    errorMessage.value = "Terjadi kesalahan saat menganalisa dokumen."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container py-8 max-w-3xl">
    <h1 class="text-3xl font-bold mb-6">Analisa Dokumen Hukum</h1>
    
    <div class="grid gap-6">
      <!-- Upload Section -->
      <Card>
        <CardHeader>
          <CardTitle>Upload Dokumen</CardTitle>
          <CardDescription>
            Unggah file PDF atau DOCX untuk dianalisa oleh AI.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              class="absolute inset-0 opacity-0 cursor-pointer" 
              accept=".pdf,.doc,.docx" 
              @change="handleFileChange"
            />
            <div v-if="!file" class="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload class="w-10 h-10 mb-2" />
              <p class="font-medium">Klik atau seret file ke sini</p>
              <p class="text-xs">Maksimal 10MB (PDF, DOCX)</p>
            </div>
            <div v-else class="flex flex-col items-center gap-2">
              <FileText class="w-10 h-10 text-primary mb-2" />
              <p class="font-medium text-foreground">{{ file.name }}</p>
              <p class="text-xs text-muted-foreground">{{ (file.size / 1024).toFixed(2) }} KB</p>
            </div>
          </div>

          <Button class="w-full" :disabled="!file || isLoading" @click="handleAnalyze">
            <template v-if="isLoading">
              Menganalisa...
            </template>
            <template v-else>
              Mulai Analisa
            </template>
          </Button>
        </CardContent>
      </Card>

      <!-- Result Section -->
      <Card v-if="result || errorMessage">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Hasil Analisa
            <AlertCircle v-if="errorMessage" class="w-5 h-5 text-destructive" />
            <CheckCircle v-else class="w-5 h-5 text-green-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="errorMessage" class="text-destructive bg-destructive/10 p-4 rounded-md">
            {{ errorMessage }}
          </div>
          <div v-else class="prose dark:prose-invert">
            <p>{{ result }}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
