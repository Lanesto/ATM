<template>
    <b-modal id="loginModal" hide-header hide-footer size="sm" body-bg-variant="light">
        <login-page v-if="page===0" @toRegister="page=1"/>
        <register-page v-else-if="page===1" @toLogin="page=0"/>
        <!-- reserved v-condition space for future use -->
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
}
</script>
