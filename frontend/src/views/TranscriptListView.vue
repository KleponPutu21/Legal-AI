<script lang="ts">
export const iframeHeight = "800px"
export const description = "A dashboard with sidebar, data table, and analytics cards."
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { PanelLeftOpen, PanelLeftClose, FileText, History } from "lucide-vue-next"
import { useTranscriptStore } from '@/transcript/features/zoom_resume/store'
import type { Transcript } from '@/transcript/features/zoom_resume/types'

import DataTable from "@/transcript/components/DataTable.vue"
// import { SidebarInset, SidebarProvider } from "@/transcript/components/ui/sidebar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/transcript/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/transcript/components/ui/tabs"
import { Button } from "@/transcript/components/ui/button"
import { Badge } from "@/transcript/components/ui/badge"
import { ScrollArea } from "@/transcript/components/ui/scroll-area"
import { Separator } from "@/transcript/components/ui/separator"
import { Play, Download } from "lucide-vue-next"
import { transcriptApi } from '@/transcript/features/zoom_resume/api'

const transcriptStore = useTranscriptStore()


// ===== STATE =====
const isDialogOpen = ref(false)
const selectedTranscript = ref<Transcript | null>(null)
const latestZoomTranscript = ref<Transcript | null>(null)

const isSidebarOpen = ref(true)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

// polling holder
let pollInterval: number | null = null

// ===== FETCH LATEST ZOOM TRANSCRIPT =====
async function loadLatestZoomTranscript() {
  try {
    const res = await transcriptApi.fetchLatestZoomTranscript()
    latestZoomTranscript.value = res
  } catch (err) {
    console.error('Failed to load latest zoom transcript', err)
  }
}

// ===== STATUS MAP =====
const statusMap: Record<string, string> = {
  PENDING: 'Pending',
  PROCESSING: 'In Process',
  DONE: 'Done',
  FAILED: 'Failed'
}

// ===== TABLE DATA =====
const data = computed(() => {
  if (transcriptStore.transcripts.length === 0) {
    return [
      {
        id: 1,
        header: "Transcript #1",
        type: "English",
        status: "Done",
        target: "1 Feb 2026, 10:30",
        limit: "12",
        reviewer: "-",
        onHeaderClick: () => handleRowClick({ id: 1 })
      },
      {
        id: 2,
        header: "Transcript #2",
        type: "Bahasa Indonesia",
        status: "Processing",
        target: "1 Feb 2026, 11:00",
        limit: "5",
        reviewer: "Waiting",
        onHeaderClick: () => handleRowClick({ id: 2 })
      }
    ]
  }

  return transcriptStore.transcripts.map(t => {
    const createdDate = new Date(t.created_at)
    const formattedDate = createdDate.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    return {
      id: t.id,
      header: `Transcript #${t.id}`,
      type: t.language || 'Auto detect',
      status: statusMap[t.status] || t.status,
      target: formattedDate,
      limit: t.segments?.length.toString() || '0',
      reviewer: t.error_message || '-',
      onHeaderClick: () => handleRowClick({ id: t.id })
    }
  })
})


// ===== CLICK HANDLER =====
function handleRowClick(row: any) {
  const transcript = transcriptStore.transcripts.find(t => t.id === row.id)
  if (transcript) {
    selectedTranscript.value = transcript
    isDialogOpen.value = true
  }
}

// ===== HELPERS =====
function formatTimestamp(seconds: number): string {
  return `${seconds.toFixed(1)}s`
}

function formatTimeRange(start: number, end: number): string {
  return `${start.toFixed(1)} – ${end.toFixed(1)}s`
}

// ===== LIFECYCLE =====
onMounted(() => {
  transcriptStore.loadTranscriptList()
  loadLatestZoomTranscript()

  pollInterval = setInterval(() => {
    transcriptStore.transcripts
      .filter(t => t.status === 'PENDING' || t.status === 'PROCESSING')
      .forEach(t => transcriptStore.refreshTranscriptStatus(t.id))

    loadLatestZoomTranscript()
  }, 5000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})


</script>

<template>
<div class="w-full h-full">
  <div class="flex h-full">

    <!-- SIDEBAR -->
<aside
  :class="[
    'border-r bg-[#125d72] text-[#e7f6f9] flex flex-col transition-all duration-300 ease-in-out border-[#14a2ba]/30 z-40',
    'fixed inset-y-0 left-0 h-full md:sticky md:top-0 md:h-screen',
    isSidebarOpen ? 'w-64' : 'w-0 opacity-0 md:w-16 md:opacity-100'
  ]"
>
  <div class="h-16 flex items-center border-b border-[#14a2ba]/30 px-4 whitespace-nowrap overflow-hidden relative group shrink-0">
     <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEica5mrcaQS_PjPVI6vsKifZ1YtQRx2HvJjaQ2dnHincaqbfxjMh8Lxa6MAXZq0jsVpim2TlPPAouZxSLLM6YTF-fZ_vU-58AycEla2KFylJKzF3tBolf-nHrVsey9YQlsvS0xIDs-0U7-p/s1359/Logo_PLN.png" alt="PLN Logo" class="w-auto h-8 transition-transform duration-300 shrink-0" :class="!isSidebarOpen && 'group-hover:scale-110'" />
          <span :class="['transition-opacity duration-300 pl-2', isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden']">
            PLN AI Transcription
          </span>
    <router-link
      to="/transcription/TranscriptionView"
      class="flex items-center gap-2 font-semibold text-white"
    >
      <!-- <span
        :class="[
          'transition-opacity duration-300',
          isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
        ]"
      >
        Transcription
      </span> -->
    </router-link>

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

  
  <div class="flex flex-col flex-1 py-4 overflow-x-hidden">
    <nav class="grid items-start px-2 space-y-2 text-sm font-medium">
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


    <!-- CONTENT -->
    <div class="flex-1 p-4 overflow-hidden">
      <!-- LATEST ZOOM TRANSCRIPT CARD -->
      <div v-if="latestZoomTranscript" class="p-4 mb-4 border rounded-lg">
        <p class="mb-1 text-sm text-muted-foreground">
          Latest Zoom Transcript:
        </p>

        <Button
          variant="outline"
          @click="() => {
            selectedTranscript = latestZoomTranscript
            isDialogOpen = true
          }"
        >
          {{ `Transcript #${latestZoomTranscript.id}` || 'View Transcript' }}
        </Button>
      </div>

      <!-- DATA TABLE -->
      <DataTable :data="data" />
    </div>

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
