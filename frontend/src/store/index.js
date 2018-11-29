import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

// using just one storage becuz the app is very small
// actually, this Vuex instance is just for sign-in/up components
const store = new Vuex.Store({
    state: {
        accessToken: null,
        userID: 'Guest',
        userName: 'Anonymous',
        logonStatus: false,
    },
    getters: {
        userInfo(state) {
            return {
                userID: state.userID,
                userName: state.userName,
                logonStatus: state.logonStatus
            }
        },
    },
    mutations: {
        LOGIN (state, {accessToken, userID, userName}) {
            state.accessToken = accessToken
            state.userID = userID
            state.userName = userName
            state.logonStatus = true
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            localStorage.sessionData = JSON.stringify({
                accessToken: accessToken,
                userID: userID,
                userName: userName
            })
        },
        LOGOUT (state) {
            state.accessToken = null
            state.userID = 'Guest'
            state.userName = 'Anonymous'
            state.logonStatus = false
            axios.defaults.headers.common['Authorization'] = undefined
            delete localStorage.sessionData
        },
    },
    actions: {
        LOGIN ({commit}, {id, password}) {
            return axios.post('auth/login', {id, password})
            .then(({data}) => {
                commit('LOGIN', data)
            })
        },
        LOGOUT ({commit}) {
            commit('LOGOUT')
        },
        REFRESH ({commit}) {
            return axios.post('auth/refresh')
            .then(({data}) => { commit('LOGIN', data) })
            .catch(err => { commit('LOGOUT') })
        }
    }
})

const loadAccessToken = () => {
    try {
        const sessionData = JSON.parse(localStorage.sessionData)
        if (!sessionData.accessToken)
            return
        
        store.commit('LOGIN', sessionData) // loads data from local storage
        store.dispatch('REFRESH') // and validate it from server
    } catch(e) { /* ignored */ }
}
loadAccessToken()

export default store