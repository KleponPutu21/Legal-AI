import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
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
