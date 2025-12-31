<script setup lang="ts">
import { ref } from 'vue'
import { sendMessage, type ChatMessage } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
    // Panggil API mock
    const response = await sendMessage(currentInput)
    
    // Tambahkan respon AI
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }
    messages.value.push(aiMsg)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container py-8 h-[calc(100vh-3.5rem)] flex flex-col">
    <Card class="flex-1 flex flex-col overflow-hidden">
      <CardHeader class="border-b">
        <CardTitle class="flex items-center gap-2">
          <Bot class="w-6 h-6 text-primary" />
          Chatbot Hukum
        </CardTitle>
      </CardHeader>
      
      <CardContent class="flex-1 p-0 overflow-hidden relative bg-muted/20">
        <ScrollArea class="h-full p-4">
          <div class="space-y-4">
            <template v-for="msg in messages" :key="msg.id">
              <div :class="['flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '']">
                <Avatar :class="msg.role === 'user' ? 'bg-primary' : 'bg-green-600'">
                  <AvatarFallback :class="msg.role === 'user' ? 'text-primary-foreground' : 'text-white'">
                    <User v-if="msg.role === 'user'" class="w-4 h-4" />
                    <Bot v-else class="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                
                <div :class="[
                  'max-w-[80%] rounded-lg p-3 text-sm',
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border shadow-sm'
                ]">
                  {{ msg.content }}
                  <div class="text-[10px] opacity-70 mt-1 text-right">
                    {{ msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                  </div>
                </div>
              </div>
            </template>
            
            <div v-if="isLoading" class="flex gap-3">
              <Avatar class="bg-green-600">
                <AvatarFallback class="text-white"><Bot class="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div class="bg-background border shadow-sm rounded-lg p-3 text-sm flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>

      <div class="p-4 border-t bg-background">
        <form @submit.prevent="handleSendMessage" class="flex gap-2">
          <Input 
            v-model="inputMessage" 
            placeholder="Ketik pertanyaan hukum Anda..." 
            :disabled="isLoading"
          />
          <Button type="submit" :disabled="isLoading">
            <Send class="w-4 h-4" />
            <span class="sr-only">Kirim</span>
          </Button>
        </form>
      </div>
    </Card>
  </div>
</template>
