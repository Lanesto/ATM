<template>
    <b-modal ref="loginModal" v-model="this.show" @hide="onHide">
        <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group id="exampleInputGroup1"
                        label="Sign In"
                        label-for="exampleInput1"
                        description="We'll never share your privates with anyone else.">
                <b-form-input id="exampleInput1"
                      type="text"
                      v-model="form.id"
                      required
                      placeholder="Account ID">
                </b-form-input>
                <b-form-input id="exampleInput2"
                            type="password"
                            v-model="form.password"
                            required
                            placeholder="Password">
                </b-form-input>
                <b-button type="submit" variant="primary">Submit</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
            </b-form-group>
        </b-form>
    </b-modal>
</template>

<script>
export default {
    props: ['show'],
    data() {
        return {
            form: {
                id: '',
                password: ''
            }
        }
    },
    methods: {
        onHide(evt) {
            this.$emit('hideModal');
        },
        onSubmit(evt) {
            evt.preventDefault();
            this.$http.post('auth/login', {
                id: this.form.id,
                password: this.form.password
            }).then(res => {
                var token = res.data.token;
                if (token) {
                    this.$emit('login', token);
                }
                this.$refs.loginModal.hide();
            }).catch(err => {
                if (err.response) { // Response Error
                    let res = err.response;
                    alert(`(${res.status}) ${res.headers}:${res.data.message}`);
                } else if (err.request) { // Server Error
                    alert(err.message);
                } else { // Request Error
                    alert(err.message);
                }
            });
        },
        onReset(evt) {
            evt.preventDefault();
            this.form.id = '';
            this.form.password = '';
        }
    }
}
</script>
