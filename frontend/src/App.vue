<template>
	<div id="app">
		<!-- UI -->
		<app-navigation-bar :user-id="userID" 
							:user-name="userName" 
							:logged-on="logonStatus"
							@showLoginModal="showModal"
							@signOut="onSignOut"/>
		<router-view :key="$route.fullPath"/>
        <app-login :show="LMVisible" 
				@hideModal="hideModal" 
				@login="onLoginSuccess"/>
		<app-footer/>
	</div>
</template>

<script>
import NavigationBar from '@/components/global/navigation-bar'
import Footer from '@/components/global/footer'
import Login from '@/components/global/login'

export default { // It also works as event bus
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
	created() {
		setInterval(() => { // autorefresh token
			if (this.logonStatus) {
				this.$http.post('auth/refresh', {}, {
					headers: {
						'Authorization': `Bearer ${sessionStorage['token']}`
					}
				}).then((res) => {
					let token = res.data.token;
					if (token) {
						sessionStorage['token'] = token;
					}
				}).catch((err) => {
					this.onSignOut()
				});
			}
		}, 3*60*1000); // every 3 minute

	}
}
</script>
