<template>
	<div id="app">
		<!-- UI -->
		<app-navigation-bar :user-id="userID" 
							:user-name="userName" 
							:logged-on="logonStatus"
							@showLoginModal="showModal"
							@logout="onSignOut"/>
		<router-view/>
		<app-footer/>
		<!-- not seen by default -->
        <app-login :show="LMVisible" 
				@hideModal="hideModal" 
				@login="onLoginSuccess"/>
	</div>
</template>

<script>
import NavigationBar from '@/components/global/navigation-bar'
import Footer from '@/components/global/footer'
import Login from '@/components/global/login'

export default {
	name: 'app',
	components: {
		'app-navigation-bar': NavigationBar, 
		'app-footer': Footer,
		'app-login': Login
	},
	data() {
		return {
			LMVisible: false, // Login Modal Visible Status
			logonStatus: false,
			userID: 'Guest',
			userName: 'Guest'
		}
	},
	methods: {
		showModal() {
			this.LMVisible = true;
		},
		hideModal() {
			this.LMVisible = false;
		},
		onLoginSuccess(token) {
			var payload = JSON.parse(atob(decodeURIComponent(token.split('.')[1])));
			this.logonStatus = true;
			this.userID = payload.UserID;
			this.userName = payload.UserName;
			sessionStorage['token'] = token;
		},
		onSignOut() {
			this.logonStatus = false;
			this.userID = 'Guest';
			this.userName = 'Guest';
			delete sessionStorage['token'];
		}
	},
}
</script>

<style>

</style>
