<template>
    <b-modal ref="loginModal"
            hide-header hide-footer
            body-bg-variant="dark"
            v-model="this.show"
            @hide="OnHideModal">
         <b-carousel :controls="!sliding"
                     :interval="0"
                     img-width="4rem"
                     img-height="4rem"
                     v-model="slide"
                     @sliding-start="OnSlideStart"
                     @sliding-end="OnSlideEnd">
            <b-carousel-slide img-blank>
                <b-alert class="mb-4" 
                         dismissible variant="danger"
                         :show="LoginFeedback" 
                         @dismissed="login.errMsg='';">{{ login.errMsg }}</b-alert>
                <h2 class="mb-2">Welcome Back!</h2>
                <b-form @submit="LoginRequest">
                    <b-input-group class="my-2" prepend="ID">
                        <b-form-input type="text" required v-model="login.id"/>
                    </b-input-group>
                    <b-input-group class="my-2" prepend="Password">
                        <b-form-input type="password" required 
                                      v-model="login.password"/>
                    </b-input-group>
                    <b-button class="mt-3" type="submit"
                              block variant="primary">Log In</b-button>
                </b-form>
            </b-carousel-slide>
            <b-carousel-slide img-blank>
                <b-alert class="mb-4" 
                         dismissible :show="RegitserFeedback" variant="danger"
                         @dismissed="register.errMsg='';">{{ register.errMsg }}</b-alert>
                <h2 class="mb-2">New Account</h2>
                <b-form @submit="RegisterRequest">
                    <b-input-group class="my-1" prepend="ID">
                        <b-form-input type="text" 
                                      required 
                                      v-model="register.id"/>
                    </b-input-group>
                    <b-input-group class="my-1" prepend="Password">
                        <b-form-input type="password" 
                                      required 
                                      v-model="register.password"/>
                    </b-input-group>
                    <b-input-group class="my-1" prepend="Name">
                        <b-form-input required v-model="register.name"/>
                    </b-input-group>
                    <b-input-group class="my-1" prepend="Age">
                        <b-form-input required v-model="register.age"/>
                        <b-form-radio-group required
                                            buttons button-variant="outline-success"
                                            v-model="register.gender">
                            <b-form-radio value="M">Male</b-form-radio>
                            <b-form-radio value="F">Female</b-form-radio>
                        </b-form-radio-group>
                    </b-input-group>
                    <b-button class="mt-1" type="submit" 
                              block variant="primary">Sign Up</b-button>
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
        LoginFeedback() { return this.login.errMsg ? true : false; },
        RegitserFeedback() { return this.register.errMsg ? true : false; }
    },
    methods: {
        OnHideModal(evt) {
            this.$emit('hideModal');
        },
        OnSlideStart (slide) { this.sliding = true; },
        OnSlideEnd (slide) { this.sliding = false; },
        LoginRequest(evt) {
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
                var msg = '';
                if (err.response) { // Response Error
                    var res = err.response;
                    msg = `(${res.status}) ${res.data.message}`;
                } else if (err.request) { // Server Error
                    msg = err.message;
                } else { // Request Error
                    msg = err.message;
                }
                this.login.errMsg = `(${res.status}) ${msg}`
            });
        },
        RegisterRequest(evt) {
            evt.preventDefault();
            this.$http.post('auth/register', {
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
                var msg = '';
                if (err.response) { // Response Error
                    var res = err.response;
                    msg = `(${res.status}) ${res.data.message}`;
                } else if (err.request) { // Server Error
                    msg = err.message;
                } else { // Request Error
                    msg = err.message;
                }
                this.register.errMsg = `(${res.status}) ${msg}`
            })
        }
    }
}
</script>
