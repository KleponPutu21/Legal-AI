<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { ArrowRight, MessageSquare, FileText, Search, Shield } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#e7f6f9] via-white to-[#d9d9d9]/30 flex flex-col relative overflow-hidden">
    
    <!-- Decorative background blobs -->
    <div class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#14a2ba]/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#efe62f]/10 rounded-full blur-[80px] pointer-events-none"></div>

    <div class="container relative z-10 py-12 px-4 lg:px-6 space-y-16">
      
      <!-- Hero Section -->
      <section class="text-center space-y-6 pt-12 md:pt-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div class="inline-flex items-center rounded-full border border-[#125d72]/10 bg-white/50 px-3 py-1 text-sm font-medium text-[#125d72] backdrop-blur-md mb-4 shadow-sm">
          <Shield class="mr-2 h-4 w-4" />
          Platform Hukum Terpercaya
        </div>
        <h1 class="text-4xl md:text-6xl font-bold tracking-tighter text-[#125d72]">
          Asisten Hukum Digital Indonesia
        </h1>
        <p class="text-lg md:text-xl text-[#125d72]/70 max-w-[800px] mx-auto leading-relaxed">
          Platform cerdas untuk konsultasi hukum, analisis dokumen, dan pencarian regulasi dengan teknologi AI terkini.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button size="lg" class="h-14 px-8 rounded-full text-lg bg-gradient-to-r from-[#125d72] to-[#14a2ba] shadow-lg shadow-[#125d72]/20 hover:scale-105 transition-all duration-300" as-child>
            <router-link to="/legal/chatbot">Mulai Konsultasi</router-link>
          </Button>
          <Button variant="outline" size="lg" class="h-14 px-8 rounded-full text-lg border-[#125d72]/20 text-[#125d72] hover:bg-[#125d72]/5 hover:text-[#125d72]" as-child>
            <router-link to="/legal/legal-search">Cari Regulasi</router-link>
          </Button>
        </div>
      </section>

      <!-- Features Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <!-- Chatbot Card -->
        <Card class="flex flex-col border-white/60 bg-white/60 backdrop-blur-sm shadow-xl shadow-[#125d72]/5 hover:shadow-2xl hover:shadow-[#125d72]/10 transition-all duration-500 hover:-translate-y-1 group">
          <CardHeader>
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#125d72] to-[#14a2ba] flex items-center justify-center mb-6 shadow-lg shadow-[#125d72]/20 group-hover:scale-110 transition-transform duration-500">
              <MessageSquare class="w-7 h-7 text-white" />
            </div>
            <CardTitle class="text-xl text-[#125d72]">Chatbot Hukum AI</CardTitle>
            <CardDescription class="text-[#125d72]/70 text-base">
              Tanya jawab seputar hukum di Indonesia dengan asisten AI yang responsif dan akurat.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex-1">
          </CardContent>
          <CardFooter>
            <Button variant="ghost" class="w-full justify-start text-[#14a2ba] hover:text-[#125d72] hover:bg-[#14a2ba]/10 pl-0 hover:pl-4 transition-all duration-300" as-child>
              <router-link to="/legal/chatbot">
                Coba Chatbot <ArrowRight class="ml-2 w-4 h-4" />
              </router-link>
            </Button>
          </CardFooter>
        </Card>

        <!-- Document Analysis Card -->
        <Card class="flex flex-col border-white/60 bg-white/60 backdrop-blur-sm shadow-xl shadow-[#125d72]/5 hover:shadow-2xl hover:shadow-[#125d72]/10 transition-all duration-500 hover:-translate-y-1 group">
          <CardHeader>
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#125d72] to-[#14a2ba] flex items-center justify-center mb-6 shadow-lg shadow-[#125d72]/20 group-hover:scale-110 transition-transform duration-500">
              <FileText class="w-7 h-7 text-white" />
            </div>
            <CardTitle class="text-xl text-[#125d72]">Analisa Dokumen</CardTitle>
            <CardDescription class="text-[#125d72]/70 text-base">
              Unggah dokumen hukum Anda untuk mendapatkan ringkasan dan analisis poin penting secara instan.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex-1">
          </CardContent>
          <CardFooter>
            <Button variant="ghost" class="w-full justify-start text-[#14a2ba] hover:text-[#125d72] hover:bg-[#14a2ba]/10 pl-0 hover:pl-4 transition-all duration-300" as-child>
              <router-link to="/legal/document-analysis">
                Analisa Dokumen <ArrowRight class="ml-2 w-4 h-4" />
              </router-link>
            </Button>
          </CardFooter>
        </Card>

        <!-- Legal Search Card -->
        <Card class="flex flex-col border-white/60 bg-white/60 backdrop-blur-sm shadow-xl shadow-[#125d72]/5 hover:shadow-2xl hover:shadow-[#125d72]/10 transition-all duration-500 hover:-translate-y-1 group">
          <CardHeader>
             <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#125d72] to-[#14a2ba] flex items-center justify-center mb-6 shadow-lg shadow-[#125d72]/20 group-hover:scale-110 transition-transform duration-500">
              <Search class="w-7 h-7 text-white" />
            </div>
            <CardTitle class="text-xl text-[#125d72]">Pencarian Legal</CardTitle>
            <CardDescription class="text-[#125d72]/70 text-base">
              Telusuri basis data peraturan dan putusan pengadilan di Indonesia dengan mudah dan cepat.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex-1">
          </CardContent>
          <CardFooter>
            <Button variant="ghost" class="w-full justify-start text-[#14a2ba] hover:text-[#125d72] hover:bg-[#14a2ba]/10 pl-0 hover:pl-4 transition-all duration-300" as-child>
              <router-link to="/legal/legal-search">
                Mulai Pencarian <ArrowRight class="ml-2 w-4 h-4" />
              </router-link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
