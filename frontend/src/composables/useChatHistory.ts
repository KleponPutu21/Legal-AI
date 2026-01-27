import { ref } from 'vue'

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export interface ChatSession {
    id: string
    title: string
    messages: ChatMessage[]
    createdAt: Date
    updatedAt: Date
}

const STORAGE_KEY = 'legal-ai-chat-history'

// Shared state across components
const sessions = ref<ChatSession[]>([])

export function useChatHistory() {

    const loadSessions = () => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                // Restore Date objects
                sessions.value = parsed.map((s: any) => ({
                    ...s,
                    createdAt: new Date(s.createdAt),
                    updatedAt: new Date(s.updatedAt),
                    messages: s.messages.map((m: any) => ({
                        ...m,
                        timestamp: new Date(m.timestamp)
                    }))
                })).sort((a: ChatSession, b: ChatSession) => b.updatedAt.getTime() - a.updatedAt.getTime())
            } catch (e) {
                console.error('Failed to parse chat history', e)
                sessions.value = []
            }
        }
    }

    const saveToStorage = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.value))
    }

    const createSession = (firstMessage: string, initialMessages: ChatMessage[] = []): string => {
        const id = Date.now().toString()
        const newSession: ChatSession = {
            id,
            title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : ''),
            messages: initialMessages.length > 0 ? [...initialMessages] : [],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        sessions.value.unshift(newSession)
        saveToStorage()
        return id
    }

    const getSession = (id: string) => {
        return sessions.value.find(s => s.id === id)
    }

    const updateSession = (id: string, messages: ChatMessage[]) => {
        const index = sessions.value.findIndex(s => s.id === id)
        if (index !== -1) {
            const session = sessions.value[index]
            if (session) {
                session.messages = messages
                session.updatedAt = new Date()
                // Move to top
                sessions.value.splice(index, 1)
                sessions.value.unshift(session)
                saveToStorage()
            }
        }
    }

    const deleteSession = (id: string) => {
        const index = sessions.value.findIndex(s => s.id === id)
        if (index !== -1) {
            sessions.value.splice(index, 1)
            saveToStorage()
        }
    }

    // Initialize logic
    if (sessions.value.length === 0) {
        loadSessions()
    }

    return {
        sessions,
        createSession,
        getSession,
        updateSession,
        deleteSession,
        loadSessions
    }
}
