import { createRouter, createWebHistory } from 'vue-router'

// Views
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Manage from '@/views/Manage.vue'

import useUserStore from '@/stores/user'

const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'about', path: '/about', component: About },
  {
    name: 'manage',
    path: '/manage-music',
    component: Manage,
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      if (store.userLoggedIn) {
        next()
      } else {
        next({ name: 'home' })
      }
    }
  },
  { path: '/manage', redirect: { name: 'manage' } },
  { path: '/:catchAll(.*)*', redirect: { name: 'home' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

export default router
