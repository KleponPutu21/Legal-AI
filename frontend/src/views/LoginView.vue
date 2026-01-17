<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const isLoading = ref(false)

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleLogin = async () => {
  isLoading.value = true
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Set mock auth
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('userRole', 'user')
  localStorage.setItem('userName', 'Admin PLN') // Default name
  
  isLoading.value = false
  router.push('/legal')
}

const handleRegister = async () => {
  isLoading.value = true
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Set mock auth
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('userRole', 'user')
  localStorage.setItem('userName', registerForm.value.name || 'New User')
  
  isLoading.value = false
  router.push('/legal')
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
     <!-- Background Effects (Matching Landing Page) -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#14a2ba]/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#125d72]/20 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <!-- Back Button -->
    <Button 
      variant="ghost" 
      class="absolute top-4 left-4 z-20 gap-2 hover:bg-white/10"
      @click="goBack"
    >
      <ArrowLeft class="w-4 h-4" />
      Kembali
    </Button>

    <div class="w-full max-w-md p-4 relative z-10 animate-in fade-in zoom-in duration-500">
      <Card class="border-[#14a2ba]/30 bg-[#082f3a]/95 backdrop-blur-xl shadow-2xl text-white">
        <CardHeader class="text-center space-y-2">
          <div class="mx-auto w-12 h-12 bg-gradient-to-br from-[#14a2ba] to-[#125d72] rounded-xl flex items-center justify-center mb-2 shadow-lg shadow-[#14a2ba]/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <CardTitle class="text-2xl font-bold text-white">
            PLN Legal AI
          </CardTitle>
          <CardDescription class="text-gray-200">
            Masuk untuk mengakses asisten hukum cerdas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs default-value="login" class="w-full">
            <TabsList class="grid w-full grid-cols-2 bg-white/5 mb-6">
              <TabsTrigger value="login" class="data-[state=active]:bg-[#14a2ba] data-[state=active]:text-white text-gray-300">Masuk</TabsTrigger>
              <TabsTrigger value="register" class="data-[state=active]:bg-[#14a2ba] data-[state=active]:text-white text-gray-300">Daftar</TabsTrigger>
            </TabsList>
            
            <!-- Login Form -->
            <TabsContent value="login" class="space-y-4">
              <div class="space-y-2">
                <Label for="email" class="text-[#e7f6f9] font-medium">Email</Label>
                <Input id="email" type="email" placeholder="nama@pln.co.id" class="bg-[#125d72]/50 border-[#14a2ba]/30 text-white placeholder:text-gray-400 focus:border-[#efe62f] focus:ring-[#efe62f]/20" v-model="loginForm.email" />
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <Label for="password" class="text-[#e7f6f9] font-medium">Password</Label>
                  <a href="#" class="text-xs text-[#14a2ba] hover:text-[#efe62f]">Lupa password?</a>
                </div>
                <Input id="password" type="password" class="bg-[#125d72]/50 border-[#14a2ba]/30 text-white placeholder:text-gray-400 focus:border-[#efe62f] focus:ring-[#efe62f]/20" v-model="loginForm.password" />
              </div>
              <Button class="w-full bg-gradient-to-r from-[#125d72] to-[#14a2ba] hover:from-[#0e4b5c] hover:to-[#10899e] text-white border-0 shadow-lg shadow-[#125d72]/20 transition-all duration-300" @click="handleLogin" :disabled="isLoading">
                <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
                {{ isLoading ? 'Memproses...' : 'Masuk' }}
              </Button>
            </TabsContent>

            <!-- Register Form -->
            <TabsContent value="register" class="space-y-4">
              <div class="space-y-2">
                <Label for="name" class="text-[#e7f6f9] font-medium">Nama Lengkap</Label>
                <Input id="name" placeholder="Nama Anda" class="bg-[#125d72]/50 border-[#14a2ba]/30 text-white placeholder:text-gray-400 focus:border-[#efe62f] focus:ring-[#efe62f]/20" v-model="registerForm.name" />
              </div>
              <div class="space-y-2">
                <Label for="reg-email" class="text-[#e7f6f9] font-medium">Email</Label>
                <Input id="reg-email" type="email" placeholder="nama@pln.co.id" class="bg-[#125d72]/50 border-[#14a2ba]/30 text-white placeholder:text-gray-400 focus:border-[#efe62f] focus:ring-[#efe62f]/20" v-model="registerForm.email" />
              </div>
              <div class="space-y-2">
                <Label for="reg-password" class="text-[#e7f6f9] font-medium">Password</Label>
                <Input id="reg-password" type="password" class="bg-[#125d72]/50 border-[#14a2ba]/30 text-white placeholder:text-gray-400 focus:border-[#efe62f] focus:ring-[#efe62f]/20" v-model="registerForm.password" />
              </div>
               <div class="space-y-2">
                <Label for="confirm-password" class="text-[#e7f6f9] font-medium">Konfirmasi Password</Label>
                <Input id="confirm-password" type="password" class="bg-[#125d72]/50 border-[#14a2ba]/30 text-white placeholder:text-gray-400 focus:border-[#efe62f] focus:ring-[#efe62f]/20" v-model="registerForm.confirmPassword" />
              </div>
              <Button class="w-full bg-gradient-to-r from-[#125d72] to-[#14a2ba] hover:from-[#0e4b5c] hover:to-[#10899e] text-white border-0 shadow-lg shadow-[#125d72]/20 transition-all duration-300" @click="handleRegister" :disabled="isLoading">
                <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
                {{ isLoading ? 'Mendaftar...' : 'Daftar Akun' }}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter class="flex justify-center border-t border-white/10 pt-4">
          <p class="text-xs text-center text-gray-500">
            &copy; 2024 PLN Legal AI. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
