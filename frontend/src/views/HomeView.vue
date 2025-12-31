<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { ArrowRight, MessageSquare, FileText, Search } from 'lucide-vue-next'
</script>

<template>
  <div class="container py-8 space-y-8">
    <!-- Hero Section -->
    <section class="text-center space-y-4 py-12 md:py-24">
      <h1 class="text-4xl md:text-6xl font-bold tracking-tighter">
        Asisten Hukum Digital Indonesia
      </h1>
      <p class="text-lg text-muted-foreground max-w-[700px] mx-auto">
        Platform cerdas untuk konsultasi hukum, analisis dokumen, dan pencarian regulasi dengan teknologi AI terkini.
      </p>
      <div class="flex justify-center gap-4">
        <Button size="lg" as-child>
          <router-link to="/chatbot">Mulai Konsultasi</router-link>
        </Button>
        <Button variant="outline" size="lg" as-child>
          <router-link to="/legal-search">Cari Regulasi</router-link>
        </Button>
      </div>
    </section>

    <!-- Features Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="flex flex-col">
        <CardHeader>
          <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <MessageSquare class="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Chatbot Hukum AI</CardTitle>
          <CardDescription>
            Tanya jawab seputar hukum di Indonesia dengan asisten AI yang responsif.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex-1">
          <!-- Description -->
        </CardContent>
        <CardFooter>
          <Button variant="ghost" class="w-full justify-start" as-child>
            <router-link to="/chatbot">
              Coba Chatbot <ArrowRight class="ml-2 w-4 h-4" />
            </router-link>
          </Button>
        </CardFooter>
      </Card>

      <Card class="flex flex-col">
        <CardHeader>
          <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <FileText class="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Analisa Dokumen</CardTitle>
          <CardDescription>
            Unggah dokumen hukum Anda untuk mendapatkan ringkasan dan analisis poin penting.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex-1">
        </CardContent>
        <CardFooter>
          <Button variant="ghost" class="w-full justify-start" as-child>
            <router-link to="/document-analysis">
              Analisa Dokumen <ArrowRight class="ml-2 w-4 h-4" />
            </router-link>
          </Button>
        </CardFooter>
      </Card>

      <Card class="flex flex-col">
        <CardHeader>
          <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Search class="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Pencarian Legal</CardTitle>
          <CardDescription>
            Telusuri basis data peraturan dan putusan pengadilan di Indonesia dengan mudah.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex-1">
        </CardContent>
        <CardFooter>
          <Button variant="ghost" class="w-full justify-start" as-child>
            <router-link to="/legal-search">
              Mulai Pencarian <ArrowRight class="ml-2 w-4 h-4" />
            </router-link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
