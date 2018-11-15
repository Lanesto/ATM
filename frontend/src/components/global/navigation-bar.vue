<template>
    <b-navbar sticky toggleable="md" type="dark" variant="dark">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand href="#">ATM</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item :to="{ name : 'movie' }">Movies</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-form>
                    <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>
                    <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                </b-nav-form>
                <b-nav-item-dropdown right>
                    <template slot="button-content">
                        {{ userId }}
                    </template>
                    <b-dropdown-item href="#">{{ userName }}</b-dropdown-item>
                    <b-dropdown-item href="#" @click="showModal" v-if="!loggedOn">Sing In</b-dropdown-item>
                    <b-dropdown-item href="#" @click="signOut" v-if="loggedOn">Sing Out</b-dropdown-item>
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
            this.$emit('logout');
        }
    }
}
</script>
