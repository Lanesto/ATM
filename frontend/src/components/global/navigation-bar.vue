<template>
    <b-navbar type="dark" 
              sticky variant="dark" toggleable="sm">
        <b-navbar-toggle target="nav_collapse"/>
        <b-navbar-brand :to="{ name: 'home' }">ATM</b-navbar-brand>
        <b-collapse id="nav_collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item :to="{ name: 'movie', params: { searchOption: '' } }">Movie</b-nav-item>
                <b-nav-item :to="{ name: 'reservate' }">Reservate</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-form @submit="searchMovie">
                    <b-form-input type="text" class="ml-sm-3" style="width:70%"
                                  size="sm" placeholder="Search Movie"
                                  v-model="searchOption"/>
                    <b-button type="submit" class="ml-1 mt-sm-0"
                              size="sm">GO</b-button>
                </b-nav-form>
                <b-nav-item-dropdown class="ml-sm-3" 
                                     right :text="userId">
                    <b-dropdown-item :disabled="!loggedOn" :to="{ name: 'account' }">{{ userName }}</b-dropdown-item>
                    <b-dropdown-item v-if="!loggedOn" @click="showModal">Sign In</b-dropdown-item>
                    <b-dropdown-item v-if="loggedOn" 
                                     replace :to="{ name: 'home'}"
                                     @click="signOut">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
export default {
    props: ['user-id', 'user-name', 'logged-on'],
    data() {
        return {
            searchOption: '',
        }
    },
    methods: {
        searchMovie(evt) {
            evt.preventDefault();
            this.$router.push({ name: 'movie', query: { searchOption: this.searchOption } });
        },
        showModal() {
            this.$emit('showLoginModal');
        },
        signOut() {
            this.$emit('signOut');
        }
    }
}
</script>
