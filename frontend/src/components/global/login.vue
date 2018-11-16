<template>
    <b-modal ref="loginModal" v-model="this.show" @hide="onHide"
            body-bg-variant="dark"
            hide-header hide-footer>
         <b-carousel
                :controls="!sliding"
                :interval="0"
                img-width="4rem"
                img-height="4rem"
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd"
                v-model="slide">
            <b-carousel-slide img-blank>
                <b-alert dismissible class="mb-4" :show="loginFeedback" variant="danger"
                        @dismissed="login.errMsg='';">{{ login.errMsg }}</b-alert>
                <h2 class="mb-2">Welcome Back!</h2>
                <b-form @submit="tryLogin">
                    <b-input-group prepend="ID" class="my-2">
                        <b-form-input required v-model="login.id"></b-form-input>
                    </b-input-group>
                    <b-input-group prepend="Password" class="my-2">
                        <b-form-input type="password" required v-model="login.password"></b-form-input>
                    </b-input-group>
                    <b-button block class="mt-3" type="submit" variant="primary">Log In</b-button>
                </b-form>
            </b-carousel-slide>
            <b-carousel-slide img-blank>
                <b-alert dismissible class="mb-4" :show="registerFeedback" variant="danger"
                        @dismissed="register.errMsg='';">{{ register.errMsg }}</b-alert>
                <h2 class="mb-2">New Account</h2>
                <b-form @submit="newRegister">
                    <b-input-group prepend="ID" class="my-1">
                        <b-form-input required v-model="register.id"></b-form-input>
                    </b-input-group>
                    <b-input-group prepend="Password" class="my-1">
                        <b-form-input type="password" required v-model="register.password"></b-form-input>
                    </b-input-group>
                    <b-input-group prepend="Name" class="my-1">
                        <b-form-input required v-model="register.name"></b-form-input>
                    </b-input-group>
                    <b-input-group prepend="Age" class="my-1">
                        <b-form-input required v-model="register.age"></b-form-input>
                        <b-form-radio-group buttons required v-model="register.gender"
                            button-variant="outline-success">
                            <b-form-radio value="M">Male</b-form-radio>
                            <b-form-radio value="F">Female</b-form-radio>
                        </b-form-radio-group>
                    </b-input-group>
                    <b-button block class="mt-1" type="submit" variant="primary">Sign Up</b-button>
                </b-form>
            </b-carousel-slide>
        </b-carousel>
    </b-modal>
</template>

<script>
export default {
    props: ['show'],
    data() {
        return {
            slide: 0,
            sliding: false,
            login: {
                id: '',
                password: '',
                errMsg: ''
            },
            register: {
                id: '',
                password: '',
                name: '',
                gender: '',
                age: '',
                errMsg: ''
            }
        }
    },
    computed: {
        loginFeedback() {
            return this.login.errMsg ? true : false;
        },
        registerFeedback() {
            return this.register.errMsg ? true : false;
        }
    },
    methods: {
        onHide(evt) {
            this.$emit('hideModal');
        },
        onSlideStart (slide) {
            this.sliding = true;
        },
        onSlideEnd (slide) {
            this.sliding = false;
        },
        tryLogin(evt) {
            evt.preventDefault();
            this.$http.post('auth/login', {
                id: this.login.id,
                password: this.login.password
            }).then(res => {
                var token = res.data.token;
                if (token) {
                    this.$emit('login', token);
                }
                this.$refs.loginModal.hide();
                this.login.errMsg = '';
            }).catch(err => {
                if (err.response) { // Response Error
                    let res = err.response;
                    this.login.errMsg = `(${res.status}) ${res.data.message}`;
                } else if (err.request) { // Server Error
                    this.login.errMsg = err.message;
                } else { // Request Error
                    this.login.errMsg = err.message;
                }
            });
        },
        newRegister(evt) {
            evt.preventDefault();
            this.$http.put('auth/register', {
                id: this.register.id,
                password: this.register.password,
                name: this.register.name,
                gender: this.register.gender,
                age: this.register.age
            }).then(res => {
                this.login = {
                    id: this.register.id,
                    password: ''
                }
                this.slide = 0;
                this.register = {
                    id: '',
                    password: '',
                    name: '',
                    gender: '',
                    age: ''
                };
                this.register.errMsg = '';
            }).catch(err => {
                if (err.response) { // Response Error
                    let res = err.response;
                    this.register.errMsg = `(${res.status}) ${res.data.message}`;
                } else if (err.request) { // Server Error
                    this.register.errMsg = err.message;
                } else { // Request Error
                    this.register.errMsg = err.message;
                }
            })
        }
    }
}
</script>

<style scoped>
b-img:focus {
    border: none;
}
</style>

