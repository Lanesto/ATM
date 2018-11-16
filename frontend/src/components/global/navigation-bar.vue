<template>
    <b-navbar sticky toggleable="sm" type="dark" variant="dark">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand :to="{ name: 'home' }">ATM</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item :to="{ name: 'movie' }">Movie</b-nav-item>
                <b-nav-item :to="{ name: 'reservate' }">Reservate</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-form>
                    <b-form-input size="sm" class="ml-sm-3 mr-sm-1" type="text" placeholder="Search Movie"/>
                    <b-button size="sm" class="mt-1 mt-sm-0" type="submit">GO</b-button>
                </b-nav-form>
                <b-nav-item-dropdown right class="ml-sm-3">
                    <template slot="button-content">
                        {{ userId }}
                    </template>
                    <b-dropdown-item :to="{ name: 'account' }">{{ userName }}</b-dropdown-item>
                    <b-dropdown-item href="#" v-if="!loggedOn" @click="showModal" >Sign In</b-dropdown-item>
                    <b-dropdown-item href="#" v-if="loggedOn" @click="signOut" :to="{ name: 'home'}" replace>Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
export default {
    props: ['user-id', 'user-name', 'logged-on'],
    methods: {
        showModal() {
            this.$emit('showLoginModal');
        },
        signOut() {
            this.$emit('signOut');
        }
    }
}
</script>
