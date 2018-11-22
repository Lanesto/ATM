<template>
	<b-container>
		<b-img fluid src="https://coda.newjobs.com/api/imagesproxy/ms/niche/images/can/film.jpg"/>
		<h1>Welcome to ATM!</h1>
		<p>You can find the movies you want, and reservate it here at once</p>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			thumbnails: [],
			slide: 0,
			sliding: false
		}
	},
	created() {
		this.$http.get('api/movie', {
			params: {
				from: 1,
				to: 5,
				search: ''
			}
		}).then((res) => {
			let data = res.data
			if (data.length > 0) {
				this.thumbnails.push(...data)
			}
		})
	},
	methods: {
		onSlideStart() { this.sliding = true; },
		onSlideEnd() { this.sliding = false; }
	}
}
</script>
