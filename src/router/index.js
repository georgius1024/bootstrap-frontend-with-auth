import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
const Index = () => import('@/pages/index')
const Login = () => import('@/pages/login')
Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters['account/isAuthenticated']) {
    return next()
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters['account/isAuthenticated']) {
    return next()
  }
  next('/login')
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/logout',
      name: 'Logout',
      beforeEnter: (to, from, next) => {
        store.commit('account/logout')
        next('/login')
      }
    }
  ]
})
