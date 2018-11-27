<template>
    <div class="p-2">
        <h2 class="mb-4">Log in</h2>
        <b-form @submit.prevent="loginRequest(id, password)">
            <b-input-group class="my-2" prepend="ID">
                <b-form-input type="text" required v-model="id"/>
            </b-input-group>
            <b-input-group class="my-2" prepend="Password">
                <b-form-input type="password" required v-model="password"/>
            </b-input-group>
            <b-button class="mt-3" type="submit" block variant="primary">
                Log In
            </b-button>
            <b-button class="mt-1" type="button" block variant="secondary" @click="toRegister">
                Register
            </b-button>
        </b-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            password: '',
        }
    },
    methods: {
        toRegister() {
            this.$emit('toRegister')
        },
        loginRequest(id, password) {
            this.$store.dispatch('LOGIN', {id, password})
            .then(() => { this.$store.commit('HIDE') })
            .catch((err) => { alert(err.message) })
        },
    }
}
</script>
