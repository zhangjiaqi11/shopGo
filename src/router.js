import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login'
import index from './components/index'
import users from './components/users'
import roles from './components/roles'
import rights from './components/rights'
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
      component: index,
      children: [
        {
          path: '/users',
          component: users
        },
        {
          path: '/roles',
          component: roles
        },
        {
          path: '/rights',
          component: rights
        }
      ]
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
