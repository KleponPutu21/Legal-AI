/**
 * Centralized transcript/zoom API service.
 */
import { http } from '@/services/zoom/http'
import API_CONFIG from '@/services/zoom/config'
import type {
    Transcript,
    TranscriptListResponse,
    TranscriptStatusResponse,
} from '@/services/zoom/types'

const BASE_URL = API_CONFIG.baseURL

export interface ZoomBotStatusResponse {
    bot_id: string
    status: string
    running: boolean
    pid: number | null
    audio_exists: boolean
    audio_size: number
    stop_flag: boolean
}

export const transcriptApi = {
    async transcribeAudio(file: File): Promise<{
        transcript_id?: number
        status?: string
        message?: string
        language: string | null
        text: string
        segments: Array<{
            id: number
            start: number
            end: number
            text: string
            speaker: string
        }>
        model?: string
        device?: string
    }> {
        const formData = new FormData()
        formData.append('file', file)

        const token = localStorage.getItem('access_token')
        const response = await fetch(`${BASE_URL}/transcribe`, {
            method: 'POST',
            body: formData,
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Backend error: ${response.status} ${error}`)
        }

        return response.json()
    },

    async fetchTranscripts(skip: number = 0, limit: number = 20): Promise<TranscriptListResponse> {
        return await http.get<TranscriptListResponse>(`/transcripts?skip=${skip}&limit=${limit}`)
    },

    async fetchLatestZoomTranscript(): Promise<Transcript> {
        return await http.get<Transcript>('/transcripts/latest')
    },

    async joinZoomMeeting(meetingLink: string): Promise<{ message: string, bot_id: string }> {
        return await http.post<{ message: string, bot_id: string }>('/zoom/join', {
            meeting_link: meetingLink
        })
    },

    async fetchZoomBotStatus(botId: string): Promise<ZoomBotStatusResponse> {
        return await http.get<ZoomBotStatusResponse>(`/zoom/status/${botId}`)
    },

    async endZoomBot(botId: string): Promise<{
        message: string
        bot_id: string
        pid: number
        transcript?: {
            status: string
            transcript_id: number
            language?: string
            segments_count?: number
            error?: string
        }
    }> {
        return await http.post('/zoom/end', {
            bot_id: botId
        })
    },

    async fetchTranscriptById(id: number): Promise<Transcript> {
        return await http.get<Transcript>(`/transcripts/${id}`)
    },

    async checkStatus(id: number): Promise<TranscriptStatusResponse> {
        return await http.get<TranscriptStatusResponse>(`/transcripts/${id}/status`)
    }
}
