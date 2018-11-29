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

export default { 
	// Application states will be handled via Vuex store
	name: 'app',
	components: {
		'app-navigation-bar': NavigationBar, 
		'app-footer': Footer,
		'app-sign-page': Sign
	},
	created() {
		setInterval(() => { // autorefresh token
			if (this.$store.getters.userInfo.logonStatus)
				this.$store.dispatch('REFRESH')

		}, 3*60*1000) // every 3 minute
	}
}
</script>
