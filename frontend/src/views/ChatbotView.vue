<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatHistory } from '@/composables/useChatHistory'
import { sendMessage, type ChatMessage } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, User, Bot , ChevronDown} from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true
})

const renderMessage = (content: string) => {
  return md.render(content)
}

const route = useRoute()
const router = useRouter()
const { getSession, createSession, updateSession } = useChatHistory()

// State
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const currentModel = ref('base-model') 
const showModelSelector = ref(false)

// Initial Welcome Message
const welcomeMessage: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: 'Halo! Saya adalah asisten hukum AI Anda. Ada yang bisa saya bantu terkait masalah hukum di Indonesia hari ini?',
    timestamp: new Date()
}

// Load chat from ID or set default
const loadChat = () => {
    const chatId = route.query.chatId as string
    if (chatId) {
        const session = getSession(chatId)
        if (session) {
            messages.value = [...session.messages]
        } else {
            // Invalid ID, redirect to new chat
            router.replace('/legal/chatbot')
            messages.value = [welcomeMessage]
        }
    } else {
        messages.value = [welcomeMessage]
    }
}

// Watch for route changes (navigating between chats)
watch(() => route.query.chatId, () => {
    loadChat()
}, { immediate: true })

const handleSendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMsg: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: inputMessage.value,
    timestamp: new Date()
  }
  
  // Optimistic update
  messages.value.push(userMsg)
  const userContent = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true

  // Handle Session Creation/Update
  let chatId = route.query.chatId as string
  if (!chatId) {
      chatId = createSession(userContent, messages.value)
      // Update URL without reloading
      await router.replace({ query: { ...route.query, chatId } })
  }
  
  // Save user message immediately
  updateSession(chatId, messages.value)

  try {
    const response = await sendMessage(userContent, currentModel.value)
    
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }
    messages.value.push(aiMsg)
    
    // Save AI message
    updateSession(chatId, messages.value)

  } catch (error: any) {
    console.error(error)
    messages.value.push({
      id: Date.now().toString(),
      role: 'assistant',
      content: `⚠️ Error: ${error.message || 'Gagal terhubung ke server.'}. Pastikan backend berjalan atau gunakan mock mode.`,
      timestamp: new Date()
    })
    // Save error message too
    updateSession(chatId, messages.value)
  } finally {
    isLoading.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  // Check if we are in the middle of composition (e.g. CJK input)
  if (e.isComposing) return
  
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSendMessage()
  } 
  // allow default for Shift+Enter
}

</script>

<template>
  <!-- Main container with branded gradient background -->
  <div class="min-h-full flex flex-col relative pb-32">
    
    <!-- Decorative background blob -->
    <div class="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#14a2ba]/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="fixed bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#efe62f]/10 rounded-full blur-[80px] pointer-events-none"></div>

    <!-- Header -->
    <header class="w-full px-6 py-6 flex items-center justify-between relative z-20 max-w-6xl mx-auto">
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
    </header>

    <!-- Chat Area -->
    <main class="w-full max-w-4xl mx-auto flex flex-col relative z-10 px-4">
        <div class="space-y-6 pb-4 pt-4">
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
                  class="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm mt-1 ring-2 ring-white"
                  :class="msg.role === 'user' ? 'bg-[#125d72]' : 'bg-white border border-[#14a2ba]/20'"
                >
                   <User v-if="msg.role === 'user'" class="w-4 h-4 text-white" />
                   <Bot v-else class="w-5 h-5 text-[#14a2ba]" />
                </div>

                <!-- Message Bubble -->
                <div class="flex flex-col gap-1">
                    <div 
                      :class="[
                        'p-5 shadow-sm text-sm md:text-base leading-relaxed relative group transition-all duration-300',
                        'prose prose-sm max-w-none break-words',
                        msg.role === 'user' 
                          ? 'bg-gradient-to-br from-[#125d72] to-[#14a2ba] text-white rounded-[1.5rem] rounded-tr-sm shadow-[#125d72]/10 prose-invert prose-p:text-white prose-headings:text-white prose-strong:text-white prose-ul:text-white prose-ol:text-white' 
                          : 'bg-white/90 backdrop-blur-sm border border-white/60 text-[#125d72] rounded-[1.5rem] rounded-tl-sm shadow-sm prose-p:text-[#125d72] prose-headings:text-[#125d72] prose-strong:text-[#125d72] prose-ul:text-[#125d72] prose-ol:text-[#125d72]'
                      ]"
                      v-html="renderMessage(msg.content)"
                    >
                    </div>
                  <span class="text-[10px] text-[#125d72]/50 px-2 font-medium" :class="msg.role === 'user' ? 'text-right' : 'text-left'">
                    {{ msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex justify-start w-full animate-in fade-in duration-300">
            <div class="flex gap-3 max-w-[85%]">
               <div class="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-[#14a2ba]/20 flex items-center justify-center shadow-sm mt-1 ring-2 ring-white">
                 <Bot class="w-5 h-5 text-[#14a2ba]" />
               </div>
               <div class="p-5 bg-white/80 backdrop-blur-sm border border-white/50 rounded-[1.5rem] rounded-tl-sm shadow-sm flex items-center gap-2 h-[52px]">
                 <div class="w-2 h-2 bg-[#14a2ba] rounded-full animate-bounce"></div>
                 <div class="w-2 h-2 bg-[#14a2ba] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div class="w-2 h-2 bg-[#14a2ba] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               </div>
            </div>
          </div>
        </div>
    </main>

    <!-- Fixed Input Area -->
    <div class="fixed bottom-0 right-0 w-full pl-0 md:pl-16 z-30">
      <div class="w-full px-4 md:px-8 pb-6 pt-2 bg-gradient-to-t from-white via-white/80 to-transparent">
        <div class="max-w-4xl mx-auto">
          <form @submit.prevent="handleSendMessage" class="relative group">
            <div class="absolute inset-0 bg-white/40 rounded-[2rem] blur-md transform translate-y-2"></div>
            <div class="relative w-full bg-white/90 backdrop-blur-xl border border-[#125d72]/10 focus-within:border-[#14a2ba] focus-within:ring-4 focus-within:ring-[#14a2ba]/10 rounded-[2rem] shadow-2xl shadow-[#125d72]/10 transition-all duration-300 flex items-end">
              <div class="relative pb-5 pl-4">
                <button 
                  @click="showModelSelector = !showModelSelector"
                  class="flex items-center gap-2 px-3 py-2 bg-[#e7f6f9] hover:bg-[#d1eff4] rounded-xl text-[#125d72] text-xs font-medium transition-all duration-200 whitespace-nowrap"
                  type="button"
                >
                  <span>{{ currentModel === 'base-model' ? 'Base Model' : 'Fine-tuned v1' }}</span>
                  <ChevronDown class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': showModelSelector }" />
                </button>
                
                <div v-if="showModelSelector" 
                     class="absolute bottom-full left-0 mb-2 w-48 bg-white/95 backdrop-blur-xl border border-[#14a2ba]/20 rounded-xl shadow-xl shadow-[#125d72]/10 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
                     @mouseleave="showModelSelector = false"
                >
                  <div class="p-1">
                    <button 
                      @click="currentModel = 'base-model'; showModelSelector = false"
                      class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                      :class="currentModel === 'base-model' ? 'bg-[#e7f6f9] text-[#125d72] font-medium' : 'text-[#125d72]/70 hover:bg-[#e7f6f9]/50 hover:text-[#125d72]'"
                    >
                      Base Model
                    </button>
                    <button 
                      class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors text-[#125d72]/40 bg-gray-50 cursor-not-allowed"
                      disabled
                    >
                      Fine-tuned v1 (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>
              <Textarea 
                v-model="inputMessage" 
                placeholder="Ketik pertanyaan hukum Anda di sini..." 
                :disabled="isLoading"
                rows="1"
                @keydown.enter.prevent="handleKeydown"
                  class="flex-1 pl-4 py-6 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[#125d72] placeholder:text-[#125d72]/40 text-lg resize-none min-h-[80px] max-h-[200px] overflow-y-auto rounded-[2rem]"
                style="field-sizing: content;"
              />
              <div class="py-4 pr-4">
                 <Button 
                  type="submit" 
                  :disabled="isLoading || !inputMessage.trim()"
                  class="w-12 h-12 rounded-full p-0 bg-gradient-to-r from-[#125d72] to-[#14a2ba] transition-all duration-300 shadow-lg shadow-[#125d72]/20 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex-shrink-0 flex items-center justify-center"
                >
                  <Send class="w-5 h-5 text-white" />
                  <span class="sr-only">Kirim</span>
                </Button>
              </div>
            </div>
          </form>
          <p class="text-center text-[10px] text-[#125d72]/40 mt-3 font-medium">
            AI dapat membuat kesalahan. Mohon verifikasi informasi hukum yang penting.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
