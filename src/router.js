import Vue from 'vue'
import Router from 'vue-router'
// const login = () => import(/* webpackChunkName:"index" */'./components/login')
// const index = () => import(/* webpackChunkName:"index" */'./components/index')
// const users = () => import(/* webpackChunkName:"users" */'./components/user/users')
// const roles = () => import(/* webpackChunkName:"rights" */'./components/rights/roles')
// const rights = () => import(/* webpackChunkName:"rights" */'./components/rights/rights')
// const categories = () => import(/* webpackChunkName:"product" */'./components/products/categories')
// const goods = () => import(/* webpackChunkName:"product" */'./components/products/goods')
// const goodsAdd = () => import(/* webpackChunkName:"product" */'./components/products/goodsAdd')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName:"index" */'./components/login')
    },
    {
      path: '/index',
      component: () => import(/* webpackChunkName:"index" */'./components/index'),
      children: [
        {
          path: '/users',
          component: () => import(/* webpackChunkName:"users" */'./components/user/users')
        },
        {
          path: '/roles',
          component: () => import(/* webpackChunkName:"rights" */'./components/rights/roles')
        },
        {
          path: '/rights',
          component: () => import(/* webpackChunkName:"rights" */'./components/rights/rights')
        },
        {
          path: '/categories',
          component: () => import(/* webpackChunkName:"products" */'./components/products/categories')
        },
        {
          path: '/goods',
          component: () => import(/* webpackChunkName:"products" */'./components/products/goods')
        },
        {
          path: '/goodsAdd',
          component: () => import(/* webpackChunkName:"products" */'./components/products/goodsAdd')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(next)
  if (to.path === '/login' || localStorage.getItem('token')) {
    next()
  } else {
    next('/login')
  }
})
export default router
