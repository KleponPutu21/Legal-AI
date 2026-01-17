import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LandingView from '@/views/LandingView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'landing',
            component: LandingView
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue')
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
        }
    ]
})

export default router
