import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login'
import index from './components/index'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/index',
      component: index
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || localStorage.getItem('token')) {
    next()
  } else {
    next('/login')
  }
})
export default router
