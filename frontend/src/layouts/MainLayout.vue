<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { MessageSquare, FileText, Search, Home, LogOut, PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-vue-next'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="h-screen overflow-hidden bg-background font-sans antialiased flex transition-colors duration-300 relative">
    <!-- Mobile Backdrop -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
      @click="toggleSidebar"
    />

    <!-- Sidebar -->
    <aside 
      :class="[
        'border-r bg-[#125d72] text-[#e7f6f9] flex flex-col transition-all duration-300 ease-in-out overflow-hidden border-[#14a2ba]/30 z-40',
        'fixed inset-y-0 left-0 h-full md:relative md:h-auto',
        isSidebarOpen ? 'w-64' : 'w-0 opacity-0 md:w-16 md:opacity-100'
      ]"
    >
      <div class="h-16 flex items-center border-b border-[#14a2ba]/30 px-4 whitespace-nowrap overflow-hidden relative group shrink-0">
        <router-link to="/legal" class="flex items-center gap-2 font-semibold text-white relative z-10">
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEica5mrcaQS_PjPVI6vsKifZ1YtQRx2HvJjaQ2dnHincaqbfxjMh8Lxa6MAXZq0jsVpim2TlPPAouZxSLLM6YTF-fZ_vU-58AycEla2KFylJKzF3tBolf-nHrVsey9YQlsvS0xIDs-0U7-p/s1359/Logo_PLN.png" alt="PLN Logo" class="h-8 w-auto shrink-0 transition-transform duration-300" :class="!isSidebarOpen && 'group-hover:scale-110'" />
          <span :class="['transition-opacity duration-300', isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden']">
            PLN Legal AI
          </span>
        </router-link>

        <!-- Sidebar Toggle -->
        <Button 
          variant="ghost" 
          size="icon" 
          @click="toggleSidebar" 
          :class="[
             'shrink-0 text-[#e7f6f9] hover:bg-[#14a2ba]/20 hover:text-[#efe62f] transition-all duration-300',
             isSidebarOpen ? 'ml-auto' : 'absolute inset-0 w-full h-full opacity-0 hover:opacity-100 z-20 flex items-center justify-center bg-[#125d72]/90 backdrop-blur-sm'
          ]"
        >
           <PanelLeftClose v-if="isSidebarOpen" class="h-5 w-5" />
           <PanelLeftOpen v-else class="h-5 w-5" />
           <span class="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      
      <div class="flex-1 overflow-x-hidden py-4">
        <nav class="grid items-start px-2 text-sm font-medium space-y-2">
          <router-link 
            to="/legal" 
            :class="['flex items-center gap-3 rounded-lg px-3 py-2 text-[#e7f6f9]/80 transition-all hover:text-[#efe62f] hover:bg-[#14a2ba]/20', !isSidebarOpen && 'justify-center']"
            exact-active-class="bg-[#14a2ba]/30 text-[#efe62f] border-r-2 border-[#efe62f]"
            :title="!isSidebarOpen ? 'Beranda' : ''"
          >
            <Home class="h-4 w-4 shrink-0" />
            <span :class="[isSidebarOpen ? 'block' : 'hidden']">Beranda</span>
          </router-link>
          
          <router-link 
            to="/legal/chatbot" 
            :class="['flex items-center gap-3 rounded-lg px-3 py-2 text-[#e7f6f9]/80 transition-all hover:text-[#efe62f] hover:bg-[#14a2ba]/20', !isSidebarOpen && 'justify-center']"
            active-class="bg-[#14a2ba]/30 text-[#efe62f] border-r-2 border-[#efe62f]"
            :title="!isSidebarOpen ? 'Chatbot Hukum' : ''"
          >
            <MessageSquare class="h-4 w-4 shrink-0" />
            <span :class="[isSidebarOpen ? 'block' : 'hidden']">Chatbot Hukum</span>
          </router-link>

          <router-link 
            to="/legal/document-analysis" 
            :class="['flex items-center gap-3 rounded-lg px-3 py-2 text-[#e7f6f9]/80 transition-all hover:text-[#efe62f] hover:bg-[#14a2ba]/20', !isSidebarOpen && 'justify-center']"
            active-class="bg-[#14a2ba]/30 text-[#efe62f] border-r-2 border-[#efe62f]"
            :title="!isSidebarOpen ? 'Analisa Dokumen' : ''"
          >
            <FileText class="h-4 w-4 shrink-0" />
            <span :class="[isSidebarOpen ? 'block' : 'hidden']">Analisa Dokumen</span>
          </router-link>

          <router-link 
            to="/legal/legal-search" 
            :class="['flex items-center gap-3 rounded-lg px-3 py-2 text-[#e7f6f9]/80 transition-all hover:text-[#efe62f] hover:bg-[#14a2ba]/20', !isSidebarOpen && 'justify-center']"
            active-class="bg-[#14a2ba]/30 text-[#efe62f] border-r-2 border-[#efe62f]"
            :title="!isSidebarOpen ? 'Pencarian Legal' : ''"
          >
            <Search class="h-4 w-4 shrink-0" />
            <span :class="[isSidebarOpen ? 'block' : 'hidden']">Pencarian Legal</span>
          </router-link>
        </nav>
      </div>

      <div class="mt-auto p-4 border-t border-[#14a2ba]/30">
        <Button variant="ghost" :class="['w-full justify-start gap-2 text-[#e7f6f9]/80 hover:text-[#efe62f] hover:bg-[#14a2ba]/20', !isSidebarOpen && 'justify-center px-0']">
          <LogOut class="h-4 w-4 shrink-0" />
          <span :class="[isSidebarOpen ? 'block' : 'hidden']">Keluar</span>
        </Button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Mobile Header -->
      <header class="h-16 flex items-center gap-4 bg-white px-4 md:hidden border-b border-[#14a2ba]/30 shrink-0 shadow-md relative z-10 w-full">
        <Button 
          variant="ghost" 
          size="icon" 
          @click="toggleSidebar" 
          class="text-[#125d72] hover:bg-[#14a2ba]/10 hover:text-[#125d72]"
        >
          <Menu class="h-6 w-6" />
          <span class="sr-only">Toggle Sidebar</span>
        </Button>
        <div class="flex items-center gap-2 font-semibold text-[#125d72]">
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEica5mrcaQS_PjPVI6vsKifZ1YtQRx2HvJjaQ2dnHincaqbfxjMh8Lxa6MAXZq0jsVpim2TlPPAouZxSLLM6YTF-fZ_vU-58AycEla2KFylJKzF3tBolf-nHrVsey9YQlsvS0xIDs-0U7-p/s1359/Logo_PLN.png" alt="PLN Logo" class="h-8 w-auto shrink-0" />
          <span>PLN Legal AI</span>
        </div>
      </header>

      <main class="flex-1 overflow-auto bg-gradient-to-br from-[#e7f6f9] via-white to-[#d9d9d9]/30">
        <router-view />
      </main>
    </div>
  </div>
</template>
