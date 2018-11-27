<template>
    <b-modal ref="loginModal"
            hide-header hide-footer size="sm" body-bg-variant="light"
            v-model="isModalVisible" @hide="onHide">
        <login-page v-if="page===0" @toRegister="page=1"/>
        <register-page v-else-if="page===1" @toLogin="page=0"/>
    </b-modal>
</template>

<script>
import Login from './login'
import Register from './register'

export default {
    components: {
		'login-page': Login, 
		'register-page': Register
	},
    data() {
        return {
            page: 0
        }
    },
    computed: {
        isModalVisible() {
            return this.$store.getters.isModalVisible
        }
    },
    methods: {
        onHide() {
            this.$store.commit('HIDE')
        }
    }
}
</script>
