// modules
import Vue from 'vue'
import Router from 'vue-router'
// components
import NotFound from '@/components/not-found'
import Home from '@/components/index'
import Account from '@/components/account/index'
import Movie from '@/components/movie/index'
import Reservate from '@/components/reservate/index'
// vuex store
import store from '../store/index'

Vue.use(Router)

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
			component: Account,
			beforeEnter: (to, from, next) => {
				// user not logged in will be redirected to home page
				if (store.getters.userInfo.logonStatus) next()
				else next('/')
			}
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
