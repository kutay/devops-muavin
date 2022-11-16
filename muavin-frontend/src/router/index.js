import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/k8s/ingress',
      name: 'k8s_ingress',
      component: () => import('../views/KubernetesIngresses.vue')
    },
    {
      path: '/k8s/images',
      name: 'k8s_images',
      component: () => import('../views/KubernetesImages.vue')
    },
    {
      path: '/k8s/helm',
      name: 'k8s_helm',
      component: () => import('../views/KubernetesHelm.vue')
    }
  ]
})

export default router
