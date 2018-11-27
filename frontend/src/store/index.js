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
        showModal: false
    },
    getters: {
        userInfo(state) {
            return {
                userID: state.userID,
                userName: state.userName,
                logonStatus: state.logonStatus
            }
        },
        isModalVisible(state) {
            return state.showModal
        }
    },
    mutations: {
        LOGIN (state, {accessToken, UserID, UserName}) {
            state.accessToken = accessToken
            state.userID = UserID
            state.userName = UserName
            state.logonStatus = true
            localStorage.sessionData = JSON.stringify({
                accessToken: accessToken,
                userID: UserID,
                userName: UserName
            })
        },
        LOGOUT (state) {
            state.accessToken = null
            state.userID = 'Guest'
            state.userName = 'Anonymous'
            state.logonStatus = false
            delete localStorage.sessionData
        },
        SHOW (state) {
            state.showModal = true
        },
        HIDE (state) {
            state.showModal = false
        }
    },
    actions: {
        LOGIN ({commit}, {id, password}) {
            return axios.post('auth/login', {id, password})
            .then(({data}) => {
                commit('LOGIN', data)
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.sessionData.accessToken}`
            })
        },
        LOGOUT ({commit}) {
            axios.defaults.headers.common['Authorization'] = undefined
            commit('LOGOUT')
        },
    }
})

const loadAccessToken = () => {
    try {
        const sessionData = JSON.parse(localStorage.sessionData)
        if (!sessionData.accesstoken) 
            return
        
///////////////////////////////////////////////////// Make action, and axios refresh to auth/refresh
/// and make that api to return as auth/login
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionData.accessToken}`
    } catch(e) { console.log(e) }
}
loadAccessToken()

export default store