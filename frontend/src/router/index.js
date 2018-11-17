import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import NotFound from '@/components/NotFound'
import Home from '@/components/index'
import Account from '@/components/account/index'
import Movie from '@/components/movie/index'
import Reservate from '@/components/reservate/index'

export default new Router({
  mode: 'history',
  routes: [
    { // 404
      path: '*',
      component: NotFound
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/movie',
      name: 'movie',
      component: Movie,
    },
    {
      path: '/reservate',
      name: 'reservate',
      component: Reservate
    }
  ]
})
