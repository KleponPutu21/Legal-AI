<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { MessageSquare, FileText, Search, Home, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased flex transition-colors duration-300">
    <!-- Sidebar -->
    <aside 
      :class="[
        'border-r bg-card flex flex-col transition-all duration-300 ease-in-out overflow-hidden',
        isSidebarOpen ? 'w-64' : 'w-0 opacity-0 md:w-16 md:opacity-100'
      ]"
    >
      <div class="h-16 flex items-center border-b px-4 whitespace-nowrap overflow-hidden">
        <router-link to="/legal" class="flex items-center gap-2 font-semibold text-primary">
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEica5mrcaQS_PjPVI6vsKifZ1YtQRx2HvJjaQ2dnHincaqbfxjMh8Lxa6MAXZq0jsVpim2TlPPAouZxSLLM6YTF-fZ_vU-58AycEla2KFylJKzF3tBolf-nHrVsey9YQlsvS0xIDs-0U7-p/s1359/Logo_PLN.png" alt="PLN Logo" class="h-8 w-auto shrink-0" />
          <span :class="['transition-opacity duration-300', isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden']">
            PLN Legal AI
          </span>
        </router-link>
      </div>
      
      <div class="flex-1 overflow-x-hidden py-4">
        <nav class="grid items-start px-2 text-sm font-medium space-y-2">
          <router-link 
            to="/legal" 
            :class="['flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted', !isSidebarOpen && 'justify-center']"
            active-class="bg-secondary/10 text-secondary border-r-2 border-secondary"
            exact-active-class="bg-secondary/10 text-secondary"
            :title="!isSidebarOpen ? 'Beranda' : ''"
          >
            <Home class="h-4 w-4 shrink-0" />
            <span :class="[isSidebarOpen ? 'block' : 'hidden']">Beranda</span>
          </router-link>
          
          <router-link 
            to="/legal/chatbot" 
            :class="['flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted', !isSidebarOpen && 'justify-center']"
            active-class="bg-secondary/10 text-secondary"
            :title="!isSidebarOpen ? 'Chatbot Hukum' : ''"
          >
            <MessageSquare class="h-4 w-4 shrink-0" />
            <span :class="[isSidebarOpen ? 'block' : 'hidden']">Chatbot Hukum</span>
          </router-link>

          <router-link 
            to="/legal/document-analysis" 
            :class="['flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted', !isSidebarOpen && 'justify-center']"
            active-class="bg-secondary/10 text-secondary"
            :title="!isSidebarOpen ? 'Analisa Dokumen' : ''"
          >
            <FileText class="h-4 w-4 shrink-0" />
            <span :class="[isSidebarOpen ? 'block' : 'hidden']">Analisa Dokumen</span>
          </router-link>

          <router-link 
            to="/legal/legal-search" 
            :class="['flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted', !isSidebarOpen && 'justify-center']"
            active-class="bg-secondary/10 text-secondary"
            :title="!isSidebarOpen ? 'Pencarian Legal' : ''"
          >
            <Search class="h-4 w-4 shrink-0" />
            <span :class="[isSidebarOpen ? 'block' : 'hidden']">Pencarian Legal</span>
          </router-link>
        </nav>
      </div>

      <div class="mt-auto p-4 border-t">
        <Button variant="ghost" :class="['w-full justify-start gap-2', !isSidebarOpen && 'justify-center px-0']">
          <LogOut class="h-4 w-4 shrink-0" />
          <span :class="[isSidebarOpen ? 'block' : 'hidden']">Keluar</span>
        </Button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
       <header class="flex h-16 items-center gap-4 border-b bg-card px-6">
         <!-- Toggle Button -->
         <Button variant="ghost" size="icon" @click="toggleSidebar" class="shrink-0">
           <PanelLeftClose v-if="isSidebarOpen" class="h-5 w-5" />
           <PanelLeftOpen v-else class="h-5 w-5" />
           <span class="sr-only">Toggle Sidebar</span>
         </Button>

         <div class="ml-auto font-semibold text-primary">
            Asisten Hukum Digital
         </div>
       </header>

      <main class="flex-1 overflow-auto p-4 lg:p-6 bg-background/50">
        <router-view />
      </main>
    </div>
  </div>
</template>
