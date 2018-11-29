<template>
    <b-navbar type="dark" sticky variant="dark" toggleable="sm">
        <b-navbar-toggle target="nav_collapse"/>
        <b-navbar-brand :to="{ name: 'home' }">ATM</b-navbar-brand>
        <b-collapse id="nav_collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item :to="{ name: 'movie', params: { searchOption: '' } }">Movie</b-nav-item>
                <b-nav-item :to="{ name: 'reservate' }">Reservate</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-form @submit.prevent="searchMovie">
                    <b-form-input type="text" class="ml-sm-3" style="width:70%"
                                  size="sm" placeholder="Search Movie"
                                  v-model="searchOption"/>
                    <b-button type="submit" class="ml-1 mt-sm-0" size="sm">GO</b-button>
                </b-nav-form>
                <b-nav-item-dropdown class="ml-sm-3" right :text="userInfo.userID">
                    <b-dropdown-item :disabled="!userInfo.logonStatus" :to="{ name: 'account' }">
                        {{ userInfo.userName }}
                    </b-dropdown-item>
                    <b-dropdown-item v-if="!userInfo.logonStatus" @click="showModal">Log In</b-dropdown-item>
                    <b-dropdown-item v-else @click="onLogout">Log Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
export default {
    data() {
        return {
            searchOption: '',
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo
        }
    },
    methods: {
        searchMovie() {
            this.$router.push({ name: 'movie', query: { searchOption: this.searchOption }})
        },
        showModal() {
            this.$root.$emit('bv::show::modal', 'loginModal')
        },
        onLogout() {
            // Logout is implemented with programming route methods,
            // becuz router-link(or :to prop) automatically adds class 'active' for button
            // and it makes some buttons alwasy highlighted
            this.$store.dispatch('LOGOUT')
            this.$router.replace({ name: 'home' })
        }
    }
}
</script>
