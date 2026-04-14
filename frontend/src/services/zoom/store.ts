import { defineStore } from 'pinia'
import { ref } from 'vue'
import { transcriptApi } from '@/services/zoom/transcriptApi'
import type { TranscriptSegment, Transcript } from '@/services/zoom/types'

export const useTranscriptStore = defineStore('transcript', () => {
    const segments = ref<TranscriptSegment[]>([])
    const fullText = ref<string>('')
    const language = ref<string | null>(null)

    const transcripts = ref<Transcript[]>([])
    const currentTranscript = ref<Transcript | null>(null)
    const total = ref(0)
    const skip = ref(0)
    const limit = ref(20)

    const loading = ref(false)
    const error = ref<string | null>(null)

    async function uploadAudio(file: File): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            const result = await transcriptApi.transcribeAudio(file)

            if (result.transcript_id) {
                const transcriptId = result.transcript_id

                const pollInterval = setInterval(async () => {
                    try {
                        const transcript = await transcriptApi.fetchTranscriptById(transcriptId)

                        if (transcript.status === 'DONE') {
                            clearInterval(pollInterval)
                            language.value = transcript.language
                            fullText.value = transcript.full_text || ''
                            segments.value = transcript.segments || []
                            loading.value = false
                            return
                        }

                        if (transcript.status === 'FAILED') {
                            clearInterval(pollInterval)
                            error.value = transcript.error_message || 'Transcription failed'
                            loading.value = false
                            return
                        }
                    } catch (err: any) {
                        clearInterval(pollInterval)
                        error.value = err.message || 'Failed to check status'
                        loading.value = false
                    }
                }, 2000)

                return true
            }

            language.value = result.language
            fullText.value = result.text
            segments.value = result.segments
            loading.value = false
            return true
        } catch (err: any) {
            error.value = err.message || 'Failed to transcribe audio'
            loading.value = false
            return false
        }
    }

    async function loadTranscriptList() {
        loading.value = true
        error.value = null

        try {
            const response = await transcriptApi.fetchTranscripts(skip.value, limit.value)
            transcripts.value = response.items
            total.value = response.total
        } catch (err: any) {
            error.value = err.message || 'Failed to load transcripts'
        } finally {
            loading.value = false
        }
    }

    async function selectTranscript(id: number) {
        loading.value = true
        error.value = null

        try {
            currentTranscript.value = await transcriptApi.fetchTranscriptById(id)
        } catch (err: any) {
            error.value = err.message || 'Failed to load transcript'
        } finally {
            loading.value = false
        }
    }

    async function refreshTranscriptStatus(id: number) {
        try {
            const updated = await transcriptApi.fetchTranscriptById(id)
            const index = transcripts.value.findIndex(t => t.id === id)
            if (index !== -1) {
                transcripts.value[index] = updated
            }
            if (currentTranscript.value?.id === id) {
                currentTranscript.value = updated
            }
        } catch {
            // noop
        }
    }

    function clearTranscript() {
        segments.value = []
        fullText.value = ''
        language.value = null
        error.value = null
    }

    function clearError() {
        error.value = null
    }

    return {
        segments,
        fullText,
        language,
        transcripts,
        currentTranscript,
        total,
        skip,
        limit,
        loading,
        error,
        uploadAudio,
        loadTranscriptList,
        selectTranscript,
        refreshTranscriptStatus,
        clearTranscript,
        clearError
    }
})
