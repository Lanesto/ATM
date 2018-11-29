<template>
    <b-container class="p-2">
        <h2 class="mb-4">Register</h2>
        <b-form @submit.prevent="regRequest">
            <b-form-input class="my-1" style="letter-spacing:4px;" type="text" required 
                          :placeholder="id ? null : 'ID'"
                          v-model="id"/>
            <b-form-input class="my-1" style="letter-spacing:4px;" type="password" required 
                          :placeholder="password ? null : 'Password'"
                          v-model="password"/>
            <b-form-input class="my-1" style="letter-spacing:4px;" type="text" required 
                          :placeholder="name ? null : 'Name'"
                          v-model="name"/>
            <b-input-group class="my-1">
                <b-form-input class="mr-1" style="letter-spacing:4px;" type="number" required
                            :placeholder="age ? null : 'Age'" min="0" max="200"
                            v-model="age"/>
                <b-form-radio-group required
                                    buttons button-variant="outline-secondary"
                                    v-model="gender">
                    <b-form-radio value="M">Male</b-form-radio>
                    <b-form-radio value="F">Female</b-form-radio>
                </b-form-radio-group>
            </b-input-group>
            <b-button class="mt-2" type="submit"
                      size="lg" block variant="primary">Sign Up</b-button>
            <b-button class="mt-1" type="button"
                      size="lg" block variant="success"
                      @click="toLogin">Log In</b-button>
        </b-form>
    </b-container>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            password: '',
            name: '',
            gender: '',
            age: '',
        }
    },
    methods: {
        toLogin() {
            this.$emit('toLogin')
        },
        regRequest(evt) {
            this.$http.post('auth/register', {
                id: this.id,
                password: this.password,
                name: this.name,
                gender: this.gender,
                age: this.age
            })
            .then(res => { this.toLogin() })
            .catch(err => { alert(err.message) })
        }
    }
}
</script>
