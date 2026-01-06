<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { ArrowRight, MessageSquare, FileText, Search, Mic, LayoutDashboard, Code, Zap, Shield, Globe } from 'lucide-vue-next'

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="min-h-screen bg-background font-sans">
    <!-- Header -->
    <header class="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div class="container flex h-16 items-center justify-between px-4 relative">
        <div class="flex items-center gap-2 font-bold text-xl tracking-tight text-primary z-10">
          <Zap class="h-6 w-6 text-cyan-500 fill-cyan-500" />
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
            PLN Icon Plus
          </span>
        </div>
        
        <nav class="hidden md:flex gap-6 text-sm font-medium text-muted-foreground absolute left-1/2 -translate-x-1/2">
          <a href="#legal-ai" @click.prevent="scrollToSection('legal-ai')" class="hover:text-primary transition-colors">Legal AI</a>
          <a href="#transcription" @click.prevent="scrollToSection('transcription')" class="hover:text-primary transition-colors">Meeting Transcription</a>
        </nav>
        
        <div class="flex items-center gap-2 z-10">
            <!-- Optional Login/Sign up buttons could go here -->
        </div>
      </div>
    </header>

    <main>
      <!-- Hero Section -->
      <section class="relative py-32 md:py-48 overflow-hidden">
        <!-- Background Gradients -->
        <div class="absolute inset-0 z-0">
             <div class="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
             <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
        </div>

        <div class="container relative z-10 px-4 text-center space-y-8">
          <!-- <div class="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-600 dark:text-cyan-400 backdrop-blur-sm mb-4">
            <span class="flex h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-ping"></span>
            Efisiensi Operasional Berbasis AI
          </div> -->
          
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Transformasi Digital <br/>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
               PLN Group
            </span>
          </h1>
          
          <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Menggabungkan kekuatan Finetuning LLM Domain Hukum dan Meeting Transcription Model untuk akselerasi kinerja korporat.
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Button size="lg" class="text-lg px-8 h-14 rounded-full shadow-lg shadow-cyan-500/20 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105" as-child>
              <router-link to="/legal">
                Jelajahi Legal AI
              </router-link>
            </Button>
            <Button variant="outline" size="lg" class="text-lg px-8 h-14 rounded-full border-2 hover:bg-secondary/10 backdrop-blur-sm transition-all" @click="scrollToSection('transcription')">
              Lihat Meeting Transcript
            </Button>
          </div>
        </div>
      </section>

      <!-- Legal AI Section -->
      <section id="legal-ai" class="py-24 bg-gradient-to-b from-background to-cyan-50/50 dark:to-cyan-950/20">
        <div class="container px-4 space-y-16">
          <div class="text-center space-y-4">
             <div class="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Shield class="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
             </div>
            <h2 class="text-4xl font-bold tracking-tight">Finetuning LLM Domain Hukum</h2>
            <p class="text-muted-foreground text-lg max-w-3xl mx-auto">
              Layanan utama kami. Asisten cerdas yang memahami konteks hukum Indonesia, dilatih dengan ribuan regulasi dan putusan pengadilan.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="group relative">
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <Card class="relative h-full bg-card/50 backdrop-blur-xl border-white/20 hover:-translate-y-2 transition-transform duration-300">
                  <CardHeader>
                    <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                      <MessageSquare class="w-7 h-7 text-white" />
                    </div>
                    <CardTitle class="text-xl">Legal AI Assistant</CardTitle>
                    <CardDescription>Konsultasi Hukum Internal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p class="text-muted-foreground leading-relaxed">
                      Chatbot interaktif untuk konsultasi hukum instan. Memberikan jawaban presisi berdasarkan database regulasi PLN dan hukum Indonesia.
                    </p>
                  </CardContent>
                  <CardFooter>
                     <Button variant="link" class="p-0 text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform" as-child>
                      <router-link to="/legal/chatbot">
                        Mulai Konsultasi <ArrowRight class="ml-2 w-4 h-4" />
                      </router-link>
                    </Button>
                  </CardFooter>
                </Card>
            </div>

            <!-- Feature 2 -->
             <div class="group relative">
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <Card class="relative h-full bg-card/50 backdrop-blur-xl border-white/20 hover:-translate-y-2 transition-transform duration-300">
                  <CardHeader>
                    <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                      <FileText class="w-7 h-7 text-white" />
                    </div>
                    <CardTitle class="text-xl">Document Analysis Tool</CardTitle>
                    <CardDescription>Otomasi Analisis Kontrak</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p class="text-muted-foreground leading-relaxed">
                      Soroti poin krusial dalam kontrak secara otomatis. Hemat waktu peninjauan dokumen dengan deteksi risiko berbasis AI.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" class="p-0 text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform" as-child>
                      <router-link to="/legal/document-analysis">
                        Analisis Dokumen <ArrowRight class="ml-2 w-4 h-4" />
                      </router-link>
                    </Button>
                  </CardFooter>
                </Card>
            </div>

            <!-- Feature 3 -->
             <div class="group relative">
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <Card class="relative h-full bg-card/50 backdrop-blur-xl border-white/20 hover:-translate-y-2 transition-transform duration-300">
                  <CardHeader>
                    <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                      <Search class="w-7 h-7 text-white" />
                    </div>
                    <CardTitle class="text-xl">Legal Search Engine</CardTitle>
                    <CardDescription>Pencarian Semantik Cerdas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p class="text-muted-foreground leading-relaxed">
                      Temukan preseden dan regulasi bukan hanya berdasarkan kata kunci, tetapi makna dan konteks hukum yang relevan.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" class="p-0 text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform" as-child>
                      <router-link to="/legal/legal-search">
                        Cari Regulasi <ArrowRight class="ml-2 w-4 h-4" />
                      </router-link>
                    </Button>
                  </CardFooter>
                </Card>
            </div>
          </div>
        </div>
      </section>

      <!-- Meeting Transcription Section -->
      <section id="transcription" class="py-24 bg-secondary/5 border-t border-border/50">
        <div class="container px-4 space-y-16">
          <div class="text-center space-y-4">
             <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
                <Mic class="w-8 h-8 text-blue-600 dark:text-blue-400" />
             </div>
            <h2 class="text-4xl font-bold tracking-tight">Meeting Transcription Model</h2>
            <p class="text-muted-foreground text-lg max-w-3xl mx-auto">
              Solusi transkripsi rapat bahasa Indonesia real-time yang presisi, dirancang khusus untuk lingkungan korporat PLN.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div class="group relative">
                 <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                 <Card class="relative h-full bg-card/50 backdrop-blur-xl border-white/20 hover:-translate-y-2 transition-transform duration-300">
                  <CardHeader>
                    <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 shadow-lg">
                      <Globe class="w-7 h-7 text-white" />
                    </div>
                    <CardTitle class="text-xl">Meeting Transcription API</CardTitle>
                    <CardDescription>Real-time & Accurate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p class="text-muted-foreground leading-relaxed">
                      REST API untuk transkripsi real-time dengan diarization (pemisahan pembicara) dan noise cancellation.
                    </p>
                  </CardContent>
                </Card>
            </div>

             <div class="group relative">
                 <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                 <Card class="relative h-full bg-card/50 backdrop-blur-xl border-white/20 hover:-translate-y-2 transition-transform duration-300">
                  <CardHeader>
                     <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 shadow-lg">
                      <LayoutDashboard class="w-7 h-7 text-white" />
                    </div>
                    <CardTitle class="text-xl">Web Application</CardTitle>
                    <CardDescription>Manajemen Rekaman Rapat</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p class="text-muted-foreground leading-relaxed">
                      Dashboard manajemen rekaman rapat yang mudah digunakan untuk unggah, edit, dan arsip hasi rapat.
                    </p>
                  </CardContent>
                </Card>
            </div>

             <div class="group relative">
                 <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                 <Card class="relative h-full bg-card/50 backdrop-blur-xl border-white/20 hover:-translate-y-2 transition-transform duration-300">
                  <CardHeader>
                     <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 shadow-lg">
                      <Code class="w-7 h-7 text-white" />
                    </div>
                    <CardTitle class="text-xl">Integration Tools</CardTitle>
                    <CardDescription>Seamless SDK Integration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p class="text-muted-foreground leading-relaxed">
                        SDK Siap pakai untuk integrasi Seamless dengan Zoom, Microsoft Teams, dan aplikasi Mobile Android.
                    </p>
                  </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="py-12 bg-card border-t text-card-foreground">
      <div class="container px-4">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-2 font-bold text-lg">
                <Zap class="h-5 w-5 text-cyan-500" />
                <span>PLN Icon Plus</span>
            </div>
            <p class="text-sm text-muted-foreground">
                &copy; 2025 PLN Icon Plus. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Additional custom animations if needed, though Tailwind utilities cover most */
</style>
