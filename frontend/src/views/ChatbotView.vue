<script setup lang="ts">
import { ref } from 'vue'
import { sendMessage, type ChatMessage } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, User, Bot } from 'lucide-vue-next'

const messages = ref<ChatMessage[]>([
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Halo! Saya adalah asisten hukum AI Anda. Ada yang bisa saya bantu terkait masalah hukum di Indonesia hari ini?',
    timestamp: new Date()
  }
])

const inputMessage = ref('')
const isLoading = ref(false)

const handleSendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  // Tambahkan pesan user
  const userMsg: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: inputMessage.value,
    timestamp: new Date()
  }
  messages.value.push(userMsg)
  
  const currentInput = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true

  try {
    // Panggil API
    const response = await sendMessage(currentInput)
    
    // Tambahkan respon AI
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }
    messages.value.push(aiMsg)
  } catch (error: any) {
    console.error(error)
    // Add error message to chat
    messages.value.push({
      id: Date.now().toString(),
      role: 'assistant',
      content: `⚠️ Error: ${error.message || 'Gagal terhubung ke server.'}. Pastikan backend berjalan atau gunakan mock mode.`,
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Main container with branded gradient background -->
  <div class="min-h-screen bg-gradient-to-br from-[#e7f6f9] via-white to-[#d9d9d9]/30 flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 relative overflow-hidden">
    
    <!-- Decorative background blobs -->
    <div class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#14a2ba]/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#efe62f]/10 rounded-full blur-[80px] pointer-events-none"></div>

    <!-- Main Chat Card -->
    <div class="w-full max-w-4xl h-[85vh] bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] flex flex-col overflow-hidden relative z-10">
      
      <!-- Header -->
      <header class="px-6 py-4 bg-white/50 backdrop-blur-md border-b border-white/20 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-4">
          <div class="relative">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#125d72] to-[#14a2ba] flex items-center justify-center shadow-lg shadow-[#125d72]/20">
              <Bot class="w-7 h-7 text-white" />
            </div>
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-[#efe62f] border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-[#125d72] tracking-tight">Legal Assistant AI</h1>
            <p class="text-xs text-[#125d72]/70 font-medium">PLN IconPlus Support</p>
          </div>
        </div>
        <!-- Optional: Add action buttons here if needed -->
      </header>

      <!-- Chat Area -->
      <ScrollArea class="flex-1 p-0 bg-transparent">
        <div class="p-6 space-y-6 min-h-full">
          <!-- Welcome Message Placeholder or Empty State could go here if messages is empty -->
          
          <template v-for="(msg, index) in messages" :key="msg.id">
            <div 
              :class="[
                'flex w-full mb-2 opacity-0 animate-in slide-in-from-bottom-2 duration-500 fill-mode-forwards',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              ]"
              :style="{ animationDelay: `${index * 100}ms`, opacity: 1 }" 
            >
              <div 
                :class="[
                  'max-w-[85%] md:max-w-[75%] flex gap-3',
                   msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                ]"
              >
                <!-- Avatar -->
                <div 
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1"
                  :class="msg.role === 'user' ? 'bg-[#125d72]' : 'bg-white border border-[#14a2ba]/20'"
                >
                   <User v-if="msg.role === 'user'" class="w-4 h-4 text-white" />
                   <Bot v-else class="w-5 h-5 text-[#14a2ba]" />
                </div>

                <!-- Message Bubble -->
                <div class="flex flex-col gap-1">
                  <div 
                    :class="[
                      'p-4 shadow-sm text-sm md:text-base leading-relaxed relative group transition-all duration-300',
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-[#125d72] to-[#14a2ba] text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-white/80 backdrop-blur-sm border border-white/50 text-[#125d72] rounded-2xl rounded-tl-sm hover:shadow-md'
                    ]"
                  >
                    {{ msg.content }}
                  </div>
                  <span class="text-[10px] text-[#125d72]/50 px-1" :class="msg.role === 'user' ? 'text-right' : 'text-left'">
                    {{ msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex justify-start w-full animate-in fade-in duration-300">
            <div class="flex gap-3 max-w-[85%]">
               <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-[#14a2ba]/20 flex items-center justify-center shadow-sm mt-1">
                 <Bot class="w-5 h-5 text-[#14a2ba]" />
               </div>
               <div class="p-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 h-[52px]">
                 <div class="w-2 h-2 bg-[#14a2ba] rounded-full animate-bounce"></div>
                 <div class="w-2 h-2 bg-[#14a2ba] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div class="w-2 h-2 bg-[#14a2ba] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <!-- Input Area -->
      <div class="p-4 md:p-6 bg-white/60 backdrop-blur-md border-t border-white/20">
        <form @submit.prevent="handleSendMessage" class="relative group">
          <Input 
            v-model="inputMessage" 
            placeholder="Ketik pertanyaan hukum Anda di sini..." 
            :disabled="isLoading"
            class="w-full pl-6 pr-14 py-6 bg-white/80 border-[#125d72]/10 focus:border-[#14a2ba] focus:ring-[#14a2ba]/20 rounded-full shadow-inner text-[#125d72] placeholder:text-[#125d72]/40 transition-all duration-300"
          />
          <Button 
            type="submit" 
            :disabled="isLoading || !inputMessage.trim()"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-9 md:h-9 rounded-full p-0 bg-gradient-to-r from-[#125d72] to-[#14a2ba] transition-all duration-300 shadow-md disabled:opacity-50"
          >
            <Send class="w-5 h-5 text-white ml-0.5" />
            <span class="sr-only">Kirim</span>
          </Button>
        </form>
        <p class="text-center text-[10px] text-[#125d72]/40 mt-3">
          AI dapat membuat kesalahan. Mohon verifikasi informasi hukum yang penting.
        </p>
      </div>

    </div>
  </div>
</template>
