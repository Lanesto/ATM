<template>
	<div id="app">
		<!-- UI -->
		<app-navigation-bar/>
		<router-view :key="$route.fullPath"/>
		<app-footer/>
		<!-- Modal Pages -->
        <app-sign-page/>
	</div>
</template>

<script>
import NavigationBar from '@/components/global/navigation-bar'
import Footer from '@/components/global/footer'
import Sign from '@/components/global/sign'

export default { // It also works as event bus
	name: 'app',
	components: {
		'app-navigation-bar': NavigationBar, 
		'app-footer': Footer,
		'app-sign-page': Sign
	},
	data() {
		return {
			LMVisible: false, // Login Modal Visible Status
			logonStatus: false,
			userID: 'Guest',
			userName: 'Guest'
		}
	},
	computed: {
		userInformation() {
			return this.$store.getters.userInformation()
		}
	},
	methods: {
		onLoginSuccess(token) {
			var payload = JSON.parse(atob(decodeURIComponent(token.split('.')[1])))
			this.logonStatus = true
			this.userID = payload.UserID
			this.userName = payload.UserName
			sessionStorage['token'] = token
		},
		onSignOut() {
			this.logonStatus = false
			this.userID = 'Guest'
			this.userName = 'Guest'
			delete sessionStorage['token']
		}
	},
	created() {
		setInterval(() => { // autorefresh token
			if (this.logonStatus) {
				this.$http.post('auth/refresh', {}, {}
				).then((res) => {
					let token = res.data.token
					if (token) {
						sessionStorage['token'] = token
					}
				}).catch((err) => {
					this.onSignOut()
				})
			}
		}, 3*60*1000) // every 3 minute

	}
}
</script>
