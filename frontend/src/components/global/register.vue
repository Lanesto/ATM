<template>
    <div class="p-2">
        <h2 class="mb-4">Register</h2>
        <b-form @submit.prevent="regRequest">
            <b-input-group class="my-2" prepend="ID">
                <b-form-input type="text" required v-model="id"/>
            </b-input-group>
            <b-input-group class="my-2" prepend="Password">
                <b-form-input type="password" required v-model="password"/>
            </b-input-group>
            <b-input-group class="my-2" prepend="Name">
                <b-form-input required v-model="name"/>
            </b-input-group>
            <b-input-group class="my-2" prepend="Age">
                <b-form-input required v-model="age"/>
                <b-form-radio-group required
                                    buttons button-variant="outline-success"
                                    v-model="gender">
                    <b-form-radio value="M">Male</b-form-radio>
                    <b-form-radio value="F">Female</b-form-radio>
                </b-form-radio-group>
            </b-input-group>
            <b-button class="mt-3" type="submit" 
                        block variant="primary">Sign Up</b-button>
            <b-button class="mt-1" type="button"
                        block variant="success"
                        @click="toLogin">Log In</b-button>
        </b-form>
    </div>
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
