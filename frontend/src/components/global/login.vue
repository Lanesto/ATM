<template>
    <b-container class="p-2">
        <h2 class="mb-4">Log In</h2>
        <b-form @submit.prevent="loginRequest(id, password)">
            <b-form-input class="my-1" style="letter-spacing: 4px;" type="text" required
                          :placeholder="id ? null : 'ID'"
                          v-model="id"/>
            <b-form-input class="my-1" style="letter-spacing: 4px;" type="password" required 
                          :placeholder="password ? null : 'Password'"
                          v-model="password"/>
            <b-button class="mt-2" type="submit" 
                      size="lg" block variant="primary">Log In</b-button>
            <b-button class="mt-1" type="button" 
                      size="lg" block variant="secondary" @click="toRegister">Register</b-button>
        </b-form>
    </b-container>
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
            .then(() => { this.$root.$emit('bv::hide::modal', 'loginModal') })
            .catch((err) => { alert(err.message) })
        },
    }
}
</script>
