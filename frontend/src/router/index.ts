import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LandingView from '@/views/LandingView.vue'
import TranscriptionView from '@/views/TranscriptionView.vue'
import TranscriptListView from '@/views/TranscriptListView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'landing',
            component: LandingView
        },
        {
            path: '/legal',
            component: MainLayout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView
                },
                {
                    path: 'chatbot',
                    name: 'chatbot',
                    component: () => import('@/views/ChatbotView.vue')
                },
                {
                    path: 'document-analysis',
                    name: 'document-analysis',
                    component: () => import('@/views/DocumentAnalysisView.vue')
                },
                {
                    path: 'legal-search',
                    name: 'legal-search',
                    component: () => import('@/views/LegalSearchView.vue')
                }
            ]
        },
        {
            path: '/transcription',
            redirect: '/transcription/web'
        },
        {
            path: '/transcription/web',
            name: 'transcription-web',
            component: TranscriptionView
        },
        {
            path: '/transcription/api',
            name: 'transcription-api',
            component: TranscriptionView
        },
        {
            path: '/transcription/integration',
            name: 'transcription-integration',
            component: TranscriptionView
        },
        {
            path: '/transcription/transcript-list',
            name: 'transcription-transcript-list',
            component: TranscriptListView
        },
        {
            path: '/transcription/TranscriptionView',
            redirect: '/transcription/web'
        }
    ]
})

export default router
