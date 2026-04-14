
<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { PanelLeftOpen, PanelLeftClose, FileText, History } from "lucide-vue-next"
import { useRouter } from 'vue-router'
import { useTranscriptStore } from "@/transcript/features/zoom_resume/store"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/transcript/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/transcript/components/ui/badge"
import { Separator } from "@/transcript/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
// import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Play } from "lucide-vue-next"
import { Download } from "lucide-vue-next"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/transcript/components/ui/dialog"

// Initialize transcript store
const transcriptStore = useTranscriptStore()

import type { Transcript } from '@/transcript/features/zoom_resume/types'
import { transcriptApi } from '@/transcript/features/zoom_resume/api'

const router = useRouter()

const latestZoomTranscript = ref<Transcript | null>(null)

// ===== STATE =====

const zoomMeetingLink = ref('')
const isJoiningZoom = ref(false)
const activeBotId = ref<string | null>(null)
const isEndingBot = ref(false)

const props = defineProps<{
  isDialogOpen: boolean
  selectedTranscript: Transcript | null
}>()

const emit = defineEmits<{
  (e: 'update:isDialogOpen', value: boolean): void
  (e: 'update:selectedTranscript', value: Transcript | null): void
}>()

const isDialogOpen = ref(false)
const selectedTranscript = ref<Transcript | null>(null)
const isSidebarOpen = ref(true)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

async function loadLatestZoomTranscript() {
  try {
    const res = await transcriptApi.fetchLatestZoomTranscript()
    latestZoomTranscript.value = res
  } catch (err) {
    console.error('Failed to load latest zoom transcript', err)
  }
}

onMounted(() => {
  loadLatestZoomTranscript()
})

async function joinZoomMeeting() {
  if (!zoomMeetingLink.value) return

  isJoiningZoom.value = true
  try {
    const res = await transcriptApi.joinZoomMeeting(zoomMeetingLink.value)
    activeBotId.value = res.bot_id
    toast.success("Joined Zoom meeting", {
      description: "Bot berhasil join ke meeting. Mulai merekam audio.",
    })
    loadLatestZoomTranscript()
  } catch (err: any) {
    console.error(err)
    toast.error("Failed to join Zoom meeting", {
      description: err?.message ?? "Unknown error",
    })
  } finally {
    isJoiningZoom.value = false
  }
}

async function endZoomBot() {
  if (!activeBotId.value) return

  isEndingBot.value = true
 try {
    console.log('[END_BOT] Calling endZoomBot with bot_id:', activeBotId.value)
    
    const response = await transcriptApi.endZoomBot(activeBotId.value)
    
    console.log('[END_BOT] Response:', response)
    
    toast.success('Bot session ended', {
      description: 'Processing transcript from Zoom recording...',
    })
    
    activeBotId.value = null
    
    // Jika ada transcript result, poll status sampai selesai
    if (response.transcript?.transcript_id) {
      const transcriptId = response.transcript.transcript_id
      console.log('[END_BOT] Polling transcript ID:', transcriptId)
      
      // Poll untuk status hingga DONE
      const maxAttempts = 60 // 60 * 2s = 2 minutes max
      let attempts = 0
      
      const pollInterval = setInterval(async () => {
        try {
          attempts++
          const transcriptData = await transcriptApi.fetchTranscriptById(transcriptId)
          
          console.log(`[END_BOT] Poll attempt ${attempts}:`, transcriptData.status)
          
          if (transcriptData.status === 'DONE') {
            clearInterval(pollInterval)
            
            console.log('[END_BOT] Transcription complete:', transcriptData)
            
            // Update UI dengan hasil transcript
            language.value = transcriptData.language || null
            segments.value = Array.isArray(transcriptData.segments) ? transcriptData.segments : []
            fullText.value = transcriptData.full_text || ""
            latestZoomTranscript.value = transcriptData
            
            isUploading.value = false
            
            if (segments.value.length > 0) {
              toast.success('Transcript ready', {
                description: `${segments.value.length} segments loaded.`,
              })
            } else {
              toast.info('Transcript saved', {
                description: 'No segments found in transcript.',
              })
            }
          } else if (transcriptData.status === 'FAILED') {
            clearInterval(pollInterval)
            isUploading.value = false
            toast.error('Transcription failed', {
              description: transcriptData.error_message || 'Unknown error',
            })
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval)
            isUploading.value = false
            toast.error('Transcription timeout', {
              description: 'Taking too long to process',
            })
          }
        } catch (err: any) {
          console.error('[END_BOT] Polling error:', err)
          clearInterval(pollInterval)
          isUploading.value = false
          toast.error('Failed to check status', {
            description: err?.message || 'Unknown error',
          })
        }
      }, 2000) // Poll every 2 seconds
      
    } else {
      console.log('[END_BOT] No transcript in response, will reload after delay')
      isUploading.value = false
      // Fallback: reload setelah delay
      setTimeout(() => {
        loadLatestZoomTranscript()
      }, 3000)
    }
  } catch (err: any) {
    console.error('Failed to end Zoom bot', err)
    toast.error('Failed to end bot', {
      description: err?.message || 'Could not end Zoom bot',
    })
    isUploading.value = false
  } finally {
    isEndingBot.value = false
  }
}

onMounted(() => {
  loadLatestZoomTranscript()
})


// ===== STATUS MAP =====

const statusMap: Record<string, string> = {
  PENDING: 'Pending',
  PROCESSING: 'In Process',
  DONE: 'Done',
  FAILED: 'Failed'
}

// ===== HELPERS =====
function formatTimestamp(seconds: number): string {
  return `${seconds.toFixed(1)}s`
}

function formatTimeRange(start: number, end: number): string {
  return `${start.toFixed(1)} – ${end.toFixed(1)}s`
}


// const isRecording = ref(false)
// const recordingLabel = computed(() =>
//   isRecording.value ? "Stop recording" : "Start recording"
// )

// const recordingHint = computed(() =>
//   isRecording.value
//     ? "Recording in progress. Click to stop and send audio to backend."
//     : "Ready when you are. Click to start capturing your meeting audio."
// )

// const statusText = computed(() =>
//   isRecording.value ? "Live · capturing audio" : "Idle · waiting for input"
// )

// const statusColor = computed(() =>
//   isRecording.value ? "bg-emerald-500" : "bg-slate-300"
// )

// const toggleRecording = () => {
//   // TODO: sambungin ke MediaRecorder / API
//   isRecording.value = !isRecording.value
// }

const audioUrl = ref<string | null>(null)
const audioRef = ref<HTMLAudioElement | null>(null)

// simpan URL audio setiap kali ada file baru (upload / record)
function setAudioSourceFromFile(file: File) {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
  audioUrl.value = URL.createObjectURL(file)
}

const isRecording = ref(false)
const isProcessingRecording = ref(false)

// const recordingLabel = computed(() =>
//   isRecording.value ? "Stop recording" : "Start recording"
// )

const recordingHint = computed(() => {
  if (isProcessingRecording.value) {
    return "Recording stopped. Processing audio and sending to backend..."
  }
  return isRecording.value
    ? "Recording in progress. Click to stop and send audio to backend."
    : "Ready when you are. Click to start capturing your meeting audio."
})

const statusText = computed(() => {
  if (isProcessingRecording.value) return "Processing · transcribing audio"
  return isRecording.value ? "Live · capturing audio" : "Idle · waiting for input"
})

const statusColor = computed(() => {
  if (isProcessingRecording.value) return "bg-amber-400"
  return isRecording.value ? "bg-emerald-500" : "bg-slate-300"
})

// --- MediaRecorder state ---
const mediaRecorder = ref<MediaRecorder | null>(null)
const mediaStream = ref<MediaStream | null>(null)
let recordedChunks: BlobPart[] = []

async function startRecording() {
  try {
    if (!("mediaDevices" in navigator) || !navigator.mediaDevices.getUserMedia) {
      toast.error("Recording not supported", {
        description: "Browser ini tidak mendukung audio recording.",
      })
      return
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaStream.value = stream

    recordedChunks = []
    const recorder = new MediaRecorder(stream)
    mediaRecorder.value = recorder

    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    }

    recorder.onstop = async () => {
      // stop semua track mic
      mediaStream.value?.getTracks().forEach((t) => t.stop())
      mediaStream.value = null
      isRecording.value = false
      isProcessingRecording.value = true

      try {
        const blob = new Blob(recordedChunks, { type: "audio/webm" })
        const file = new File(
          [blob],
          `meeting-recording-${Date.now()}.webm`,
          { type: blob.type }
        )

        // pakai pipeline yang sama dengan upload file biasa
        setAudioSourceFromFile(file)
        await uploadFile(file)
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to process recording", {
          description: err?.message ?? "Unknown error",
        })
      } finally {
        isProcessingRecording.value = false
      }
    }

    recorder.start()
    isRecording.value = true

    toast.success("Recording started", {
      description: "Mic is now capturing meeting audio.",
    })
  } catch (err: any) {
    console.error(err)
    toast.error("Cannot start recording", {
      description:
        err?.name === "NotAllowedError"
          ? "Permission untuk mikrofon ditolak."
          : err?.message ?? "Unknown error",
    })
  }
}

function stopRecording() {
  if (!mediaRecorder.value) return
  try {
    mediaRecorder.value.stop()
    mediaRecorder.value = null
  } catch (err) {
    console.error(err)
  }
}

const toggleRecording = () => {
  if (isProcessingRecording.value) return
  if (!isRecording.value) {
    void startRecording()
  } else {
    stopRecording()
  }
}

// const segments = ref([
//   {
//     id: 1,
//     start: "00:01",
//     end: "00:18",
//     speaker: "Speaker 1",
//     text: "Oke, kita mulai meeting hari ini. Fokus ke progres integrasi Zoom dan pipeline WhisperX.",
//   },
//   {
//     id: 2,
//     start: "00:19",
//     end: "00:42",
//     speaker: "Speaker 2",
//     text: "Dari sisi backend, webhook sudah stabil. Yang perlu kita rapikan tinggal handler untuk error saat download rekaman.",
//   },
//   {
//     id: 3,
//     start: "00:43",
//     end: "01:05",
//     speaker: "Speaker 1",
//     text: "Sip. Untuk frontend, kita butuh tampilan transcript yang enak dibaca dan mudah dicari keyword-nya.",
//   },
// ])

interface TranscriptSegment {
  id: number
  start: number
  end: number
  speaker: string
  text: string
}

const isUploading = ref(false)
const segments = ref<TranscriptSegment[]>([])
const fullText = ref("")
const language = ref<string | null>(null)
const model = ref<string | null>(null)
const device = ref<string | null>(null)

// Language code to display name mapping
const languageMap: Record<string, string> = {
  'id': 'Indonesian',
  'indonesian': 'Indonesian',
  'en': 'English',
  'english': 'English',
  'zh': 'Chinese',
  'chinese': 'Chinese',
  'ja': 'Japanese',
  'japanese': 'Japanese',
  'ko': 'Korean',
  'korean': 'Korean',
  'es': 'Spanish',
  'spanish': 'Spanish',
  'fr': 'French',
  'french': 'French',
  'de': 'German',
  'german': 'German',
  'ar': 'Arabic',
  'arabic': 'Arabic',
}

const displayLanguage = computed(() => {
  if (!language.value) return 'Auto detect'
  return languageMap[language.value.toLowerCase()] || language.value
})

const fileInput = ref<HTMLInputElement | null>(null)

async function uploadFile(file: File): Promise<void> {
  setAudioSourceFromFile(file)
  isUploading.value = true
  
  // Clear previous results
  language.value = null
  fullText.value = ""
  segments.value = []
  
  try {
    // Use transcript store (now with async polling)
    const success = await transcriptStore.uploadAudio(file)
    
    if (!success) {
      throw new Error(transcriptStore.error || 'Transcription failed')
    }
    

    // Wait for polling to complete by watching store state
    const checkResults = setInterval(() => {
      if (!transcriptStore.loading) {
        clearInterval(checkResults)
        
        // Update UI with results from store
        language.value = transcriptStore.language
        fullText.value = transcriptStore.fullText
        segments.value = transcriptStore.segments
        model.value = null
        device.value = null
        
        isUploading.value = false
        
        if (segments.value.length > 0) {
          toast({
            title: "Transcription completed",
            description: `${segments.value.length} segments loaded.`,
          })
        }
      }
    }, 500) // Check every 500ms
    
  } catch (err: any) {
    console.error(err)
    isUploading.value = false
    toast({
      title: "Upload failed",
      description: err?.message ?? transcriptStore.error ?? "Unknown error",
      variant: "destructive",
    })
  }
}


const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement | null
  if (!target?.files || target.files.length === 0) return

  const file = target.files[0]
  if (file) {
    uploadFile(file)
  }
}

const openFileDialog = () => {
  fileInput.value?.click()
}

function onPlaySegment(seg: TranscriptSegment) {
  if (!audioRef.value || !audioUrl.value) {
    toast.error("Audio tidak tersedia", {
      description: "Upload atau rekam audio dulu sebelum memutar segmen.",
    })
    return
  }

  const audio = audioRef.value

  // pastikan src sudah ter-set
  if (!audio.src || audio.src !== audioUrl.value) {
    audio.src = audioUrl.value
  }

  // lompat ke waktu mulai segmen
  audio.currentTime = seg.start

  // play
  void audio.play().catch((err) => {
    console.error(err)
    toast.error("Gagal memutar audio", {
      description: err?.message ?? "Unknown error",
    })
  })
}


// import { InfoIcon } from 'lucide-vue-next'
// import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/transcript/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/transcript/components/ui/tooltip'
import { AudioLinesIcon } from 'lucide-vue-next'


</script>

<template>
  <audio ref="audioRef" class="hidden" />
  <div class="flex h-full">
    <!-- SIDEBAR -->
    <aside
  :class="[
    'border-r bg-[#125d72] text-[#e7f6f9] flex flex-col transition-all duration-300 ease-in-out border-[#14a2ba]/30 z-40',
    'fixed inset-y-0 left-0 h-full md:sticky md:top-0 md:h-screen',
    isSidebarOpen ? 'w-64' : 'w-0 opacity-0 md:w-16 md:opacity-100'
  ]"
>
  <!-- Header -->
  <div class="h-16 flex items-center border-b border-[#14a2ba]/30 px-8 whitespace-nowrap overflow-hidden relative group shrink-0">
     <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEica5mrcaQS_PjPVI6vsKifZ1YtQRx2HvJjaQ2dnHincaqbfxjMh8Lxa6MAXZq0jsVpim2TlPPAouZxSLLM6YTF-fZ_vU-58AycEla2KFylJKzF3tBolf-nHrVsey9YQlsvS0xIDs-0U7-p/s1359/Logo_PLN.png" alt="PLN Logo" class="w-auto h-8 transition-transform duration-300 shrink-0" :class="!isSidebarOpen && 'group-hover:scale-110'" />
          <span :class="['transition-opacity duration-300 pl-2', isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden']">
            PLN AI Transcription
          </span>
    <!-- Title -->
    <router-link
      to="/transcription/TranscriptionView"
      class="flex items-center gap-2 font-semibold text-white"
    >

    </router-link>

    <!-- Toggle Button -->
    <Button
      variant="ghost"
      size="icon"
      @click="toggleSidebar"
      :class="[
        'shrink-0 text-[#e7f6f9] hover:bg-[#14a2ba]/20 hover:text-[#efe62f]',
        isSidebarOpen
          ? 'ml-auto'
          : 'absolute inset-0 w-full h-full opacity-0 hover:opacity-100 flex items-center justify-center bg-[#125d72]/90'
      ]"
    >
      <PanelLeftClose v-if="isSidebarOpen" class="w-5 h-5" />
      <PanelLeftOpen v-else class="w-5 h-5" />
    </Button>

  </div>

  <!-- Menu -->
  <div class="flex flex-col flex-1 py-4 overflow-x-hidden">
    <nav class="grid items-start px-2 space-y-2 text-sm font-medium">

      <!-- Transcript -->
      <router-link
        to="/transcription/TranscriptionView"
        :class="[
          'flex items-center gap-3 rounded-lg px-3 py-2 text-[#e7f6f9]/80 transition-all hover:text-[#efe62f] hover:bg-[#14a2ba]/20',
          !isSidebarOpen && 'justify-center'
        ]"
        active-class="bg-[#14a2ba]/30 text-[#efe62f] border-r-2 border-[#efe62f]"
        :title="!isSidebarOpen ? 'Transcript' : ''"
      >
        <FileText class="w-4 h-4 shrink-0" />
        <span :class="[isSidebarOpen ? 'block' : 'hidden']">
          Transcript
        </span>
      </router-link>

      <!-- History -->
      <router-link
        to="/transcription/transcript-list"
        :class="[
          'flex items-center gap-3 rounded-lg px-3 py-2 text-[#e7f6f9]/80 transition-all hover:text-[#efe62f] hover:bg-[#14a2ba]/20',
          !isSidebarOpen && 'justify-center'
        ]"
        active-class="bg-[#14a2ba]/30 text-[#efe62f] border-r-2 border-[#efe62f]"
        :title="!isSidebarOpen ? 'History' : ''"
      >
        <History class="w-4 h-4 shrink-0" />
        <span :class="[isSidebarOpen ? 'block' : 'hidden']">
          History
        </span>
      </router-link>

    </nav>

    <!-- Bottom button -->
    <div class="px-2 mt-auto">
      <Button
        @click="$router.push('/')"
        class="w-full mt-4 bg-[#14a2ba] hover:bg-[#0f7f91] text-white"
        :class="[!isSidebarOpen && 'hidden']"
      >
        Return to Homepage
      </Button>
    </div>

  </div>
</aside>

    <!-- MAIN CONTENT -->
    <div class="flex flex-col w-full h-full gap-6">
      <div class="flex items-center w-1/3 gap-2 mx-auto">
        <!-- <InputGroup>
          <InputGroupInput placeholder="example.com" class="!pl-1" />
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <InputGroupButton class="rounded-full" size="icon-xs">
                    <InfoIcon class="size-4" />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>This is content in a tooltip.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </InputGroupAddon>
        </InputGroup>
        <Button>Start</Button> -->
      </div>
      <!-- <Separator class="my-4" /> -->
      <section
        class="px-8 py-2 grid gap-4 items-start lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]"
      >
        <!-- LEFT COLUMN: controls -->
        <div class="space-y-4">
          <!-- Mode: record / upload -->
          <Card>
            <CardHeader>
              <CardTitle class="text-sm">Input source</CardTitle>
              <CardDescription class="text-xs">
                Pilih cara memasukkan audio: rekam langsung atau unggah file.
              </CardDescription>
            </CardHeader>
             
            <CardContent class="pt-0">
             
              <Tabs default-value="record" class="w-full">
                <TabsList class="grid w-full grid-cols-3">
                  <TabsTrigger value="record" class="text-xs">
                    Record
                  </TabsTrigger>
                      <TabsTrigger value="latest" class="text-xs">
                    Link Zoom
                  </TabsTrigger>
                  <TabsTrigger value="upload" class="text-xs">
                    Upload file
                  </TabsTrigger>
                </TabsList>

                <!-- TAB: RECORD -->
                <TabsContent value="record" class="space-y-4">
                  <!-- <div class="flex items-center justify-center gap-2 text-xs">
                    <span
                      class="inline-flex w-2 h-2 rounded-full"
                      :class="statusColor"
                    />
                    <span class="text-muted-foreground">
                      {{ statusText }}
                    </span>
                  </div> -->
                    <!-- <p class="text-[11px] text-muted-foreground leading-relaxed">
                      Sistem akan menyimpan audio sementara dan mengirimkannya
                      ke backend untuk diproses dengan WhisperX setelah rekaman
                      dihentikan.
                    </p> -->

                  <div class="flex flex-col items-center justify-center gap-4 m-12">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <Button
                            :data-active="isRecording"
                            class="rounded-full size-32 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100"
                            :aria-pressed="isRecording"
                            size="icon"
                            aria-label="Voice Mode"
                            @click="toggleRecording"
                          >
                            <AudioLinesIcon class="size-14" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Voice Mode</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div class="flex items-center justify-center gap-2 text-xs">
                      <span
                        class="inline-flex w-2 h-2 rounded-full"
                        :class="statusColor"
                      />
                      <span class="text-muted-foreground">
                        {{ statusText }}
                      </span>
                    </div>
                  </div>

                  <!-- <Button
                    class="flex items-center mx-auto text-sm"
                    :variant="isRecording ? 'destructive' : 'default'"
                    :disabled="isProcessingRecording"
                    type="button"
                    @click="toggleRecording"
                  >
                  <span v-if="isProcessingRecording">Processing recording...</span>
                  <span v-else>{{ recordingLabel }}</span>
                  </Button> -->



                  <p class="text-[11px] text-muted-foreground">
                    {{ recordingHint }}
                  </p>
                </TabsContent>
                 <TabsContent value="latest" class="mt-4 space-y-3">
                <div class = "space-y-2">
                  <label class="text-xs text-muted-foreground">Input Link Zoom atau ID Meeting </label>
                 <div class="flex gap-2">
                    <input
                      v-model="zoomMeetingLink"
                      type="text"
                      placeholder="https://zoom.us/j/1234567890"
                      class="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14a2ba]"
                      !disabled="!!activeBotId"
                      />
                      <Button 
                      v-if = "!activeBotId"
                      @click="joinZoomMeeting"
                      size="sm" variant="outline" class="text-xs rounded-full"
                      :disabled="!zoomMeetingLink || isJoiningZoom">
                      {{ isJoiningZoom ? 'Joining...' : 'Join Meeting' }}
                      </Button>
                      
                    <Button 
                    v-else
                    @click="endZoomBot"
                    :disabled="isEndingBot"
                    size="sm" variant="destructive" class="text-xs rounded-full">
                        {{ isEndingBot ? 'Ending...' : 'End Session' }}
                    </Button>
                  </div> 
                  <p class="text-xs text-muted-foreground">
                        Bot akan otomatis join ke meeting dan merekam audio untuk ditranskripsi.
                  </p>
                </div>
          </TabsContent>

     <TabsContent value="latest" class="mt-4">
      <div v-if="latestZoomTranscript" class="p-4 mb-4 border rounded-lg">
        <p class="mb-1 text-sm text-muted-foreground">
          Latest Zoom Transcript
        </p>

        <Button
          variant="outline"
          @click="
            () => {
              selectedTranscript = latestZoomTranscript
              isDialogOpen = true
            }
          "
        >
          Open Latest Zoom Transcript (ID: {{ latestZoomTranscript?.id }})
        </Button>
      </div>

      <div v-else class="text-sm text-muted-foreground">
        Belum ada transcript Zoom terbaru
      </div>
    </TabsContent>
                <!-- TAB: UPLOAD -->
                <TabsContent value="upload" class="mt-4 space-y-3">
                  <div
                    class="px-4 py-6 space-y-2 text-center border border-dashed rounded-lg border-muted-foreground/40"
                  >
                    <p class="text-xs font-medium">
                      Drag &amp; drop file audio di sini
                    </p>
                    <p class="text-[11px] text-muted-foreground">
                      Mendukung format mp3, wav, m4a. Durasi disarankan &lt; 2 jam.
                    </p>
                    <input
                      type="file"
                      accept="audio/*"
                      class="hidden"
                      ref="fileInput"
                      @change="onFileChange"
                    />
                    <Button
                      size="sm"
                      class="mt-1 text-xs rounded-full"
                      variant="outline"
                      @click="openFileDialog"
                    >
                      Pilih file dari perangkat
                    </Button>

                  </div>
                  <p class="text-[11px] text-muted-foreground">
                    Setelah diunggah, file akan diantrikan untuk proses
                    transkripsi dan muncul di panel preview.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <!-- Small info card -->
          <Card>
            <CardHeader>
              <CardTitle class="text-sm">Processing profile</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-[11px]">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Engine</span>
                <span class="font-medium">
                  {{ model ? `Whisper · ${model}` : 'Whisper · base' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Speaker diarization</span>
                <span class="font-medium">Disabled</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Language</span>
                <span class="font-medium">{{ displayLanguage }}</span>
              </div>
              <div v-if="device" class="flex justify-between">
                <span class="text-muted-foreground">Device</span>
                <span class="font-medium">{{ device.toUpperCase() }}</span>
              </div>
            </CardContent>
            <CardFooter class="pt-1">
              <p class="text-[11px] text-muted-foreground">
                Pengaturan ini nanti bisa diubah di halaman settings pipeline.
              </p>
            </CardFooter>
          </Card>
        </div>

        <!-- RIGHT COLUMN: transcript preview -->
        <Card class="flex flex-col">
          <CardHeader>
            <div class="flex items-center justify-between gap-2">
              <div>
                <CardTitle class="text-sm">Transcript</CardTitle>
                <CardDescription class="text-xs">
                  Hasil transkripsi meeting terakhir / aktif.
                </CardDescription>
              </div>
              <Button size="icon" variant="ghost" class="w-8 h-8">
                ⋮
              </Button>
            </div>
          </CardHeader>

          <Separator />

          <CardContent class="flex-1 p-0 overflow-hidden">
            <Tabs default-value="transcript" class="flex flex-col h-full">
              <div class="flex items-center justify-between px-5 pt-3 pb-2">
                <TabsList class="h-8">
                  <TabsTrigger value="transcript" class="text-xs">
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger value="summary" class="text-xs">
                    Summary
                  </TabsTrigger>
                </TabsList>

                <Button size="sm" variant="outline" class="text-xs rounded-full">
                  Download
                </Button>
              </div>

              <!-- TAB: TRANSCRIPT LIST -->
              <TabsContent value="transcript" class="flex-1 px-5 pb-4 overflow-hidden">
                <ScrollArea class="h-full pr-3">
                  <div class="space-y-3">
                    <div
                      v-if="segments.length === 0"
                      class="py-10 text-sm text-center text-muted-foreground"
                    >
                      Belum ada transcript. Upload file audio dulu di panel atas.
                    </div>

                    <div
                      v-for="seg in segments"
                      :key="seg.id"
                      class="flex items-start gap-3 pb-3 border-b border-border/60 last:border-b-0"
                    >
                      <!-- timestamp kiri -->
                      <div class="w-14 pt-1 text-[11px] text-muted-foreground tabular-nums">
                        {{ seg.start.toFixed(1) }}s
                      </div>

                      <!-- konten utama -->
                      <div class="flex-1 space-y-1">
                        <div class="flex items-center gap-2">
                          <Badge variant="outline" class="text-[11px]">
                            {{ seg.speaker }}
                          </Badge>
                          <span class="text-[11px] text-muted-foreground">
                            {{ seg.start.toFixed(1) }} – {{ seg.end.toFixed(1) }}s
                          </span>
                        </div>
                        <p class="text-sm leading-relaxed">
                          {{ seg.text }}
                        </p>
                      </div>

                      <!-- tombol play (belum di-wire ke audio, tapi siap) -->
                      <Button
                        size="icon"
                        variant="ghost"
                        class="h-7 w-7 shrink-0"
                        type="button"
                        @click="onPlaySegment(seg)"
                      >
                        <Play class="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>


              <!-- TAB: SUMMARY -->
              <TabsContent value="summary" class="flex-1 px-5 pb-4 overflow-auto">
                <div class="space-y-2 text-sm text-muted-foreground">
                  <p class="font-medium text-foreground">
                    Ringkasan singkat:
                  </p>
                  <p class="leading-relaxed text-foreground">
                    {{ fullText }}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter
            class="flex items-center justify-between px-5 border-t"
          >
            <p class="text-[11px] text-muted-foreground">
              Terakhir diperbarui: belum ada proses otomatis.
            </p>
            <Button size="sm" variant="outline" class="text-xs rounded-full">
              Refresh
            </Button>
          </CardFooter>
        </Card>

      </section>
    </div>

    <!-- TRANSCRIPT DETAIL DIALOG -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="max-w-4xl max-h-[90vh] p-8">
        <DialogHeader>
          <DialogTitle>Transcript Detail</DialogTitle>
          <DialogDescription>
            Detail hasil transkripsi meeting yang dipilih.
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedTranscript" class="space-y-4">

          <!-- META -->
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-xs text-muted-foreground">Total Segments</p>
              <p class="font-medium">
                {{ selectedTranscript.segments?.length || 0 }}
              </p>
            </div>

            <div>
              <p class="text-xs text-muted-foreground">Language</p>
              <p class="font-medium">
                {{ selectedTranscript.language || 'Auto detect' }}
              </p>
            </div>

            <div>
              <p class="text-xs text-muted-foreground">Status</p>
              <Badge :variant="selectedTranscript.status === 'DONE' ? 'default' : 'secondary'">
                {{ statusMap[selectedTranscript.status] || selectedTranscript.status }}
              </Badge>
            </div>
          </div>

          <Separator />

          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Transcript</h2>

            <Button @click="loadLatestZoomTranscript">
              Load Latest Zoom Transcript
            </Button>
          </div>

          <!-- TABS -->
          <Tabs default-value="transcript" class="w-full">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <!-- TRANSCRIPT -->
            <TabsContent value="transcript" class="mt-4">
              <ScrollArea class="h-[400px] pr-4">
                <div
                  v-if="!selectedTranscript.segments || selectedTranscript.segments.length === 0"
                  class="py-10 text-center text-muted-foreground"
                >
                  No transcript segments available.
                </div>

                <div v-else class="px-2 space-y-3">
                  <div
                    v-for="seg in selectedTranscript.segments"
                    :key="seg.id"
                    class="flex items-start gap-3 pb-3 border-b border-border/60 last:border-b-0"
                  >
                    <div class="pt-1 text-xs w-14 text-muted-foreground tabular-nums">
                      {{ formatTimestamp(seg.start) }}
                    </div>

                    <div class="flex-1 space-y-1">
                      <div class="flex items-center gap-2">
                        <Badge variant="outline" class="text-xs">
                          {{ seg.speaker }}
                        </Badge>
                        <span class="text-xs text-muted-foreground">
                          {{ formatTimeRange(seg.start, seg.end) }}
                        </span>
                      </div>

                      <p class="text-sm leading-relaxed">
                        {{ seg.text }}
                      </p>
                    </div>

                    <Button size="icon" variant="ghost" class="h-7 w-7 shrink-0">
                      <Play class="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <!-- SUMMARY -->
            <TabsContent value="summary" class="mt-4">
              <ScrollArea class="h-[400px] pr-4">
                <div class="space-y-2 text-sm">
                  <p class="font-medium">Full Text Summary:</p>
                  <p class="leading-relaxed text-muted-foreground">
                    {{ selectedTranscript.full_text || 'No summary available.' }}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="isDialogOpen = false">
            Close
          </Button>
          <Button variant="default">
            <Download class="w-4 h-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>