<template>
	<b-container>
		<b-row class="mt-3 mb-1">
			<b-col cols="4">
				<strong>Movie</strong>
				<b-form-select v-model="schForm.movieID" class="mb-3" :select-size="10" @input="bringSchedules">
					<option :value="movie.MovieID" v-for="movie in movies" :key="movie.MovieID">
						{{ movie.MovieTitle }}
					</option>
				</b-form-select>
			</b-col>
			<b-col cols="4">
				<strong>Cinema</strong>
				<b-form-select v-model="schForm.cinemaID" class="mb-3" :select-size="10" @input="bringSchedules">
					<option :value="cinema.CinemaID" v-for="cinema in cinemas" :key="cinema.CinemaID">
						{{ cinema.CinemaName }}
					</option>
				</b-form-select>
			</b-col>
			<b-col cols="4">
				<strong>Schedule</strong>
				<b-form-select v-model="resForm.scheduleID" class="mb-3" :select-size="10">
					<option :value="schedule.ScheduleID" v-for="schedule in schedules" :key="schedule.ScheduleID">
						{{ schedule.RoomName }}, {{ schedule.PlayDate }}
					</option>
				</b-form-select>
			</b-col>
		</b-row> 
		<b-row class="mb-4">
			<b-col cols="8">
				<strong>Play At</strong>
				<b-form-input type="date" v-model="schForm.date" @input="bringSchedules"/>
			</b-col>
			<b-col cols="4">
				<strong>Number of youth</strong>
				<b-form-input type="number" min="0" max="10" step="1" v-model="resForm.youthNum"/>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	data () {
		return {
			cinemas: [],
			movies: [],
			schedules: [],
			schForm: {
				movieID: -1,
				cinemaID: -1,
				date: '',
			},
			resForm: {
				roomID: -1,
				scheduleID: -1,
				youthNum: 0,
				selectedSeats: []
			}
		}
	},
	created() {
		this.$http.get('api/cinema', {})
		.then((res) => {
			this.cinemas = res.data;
		});
		this.$http.get('api/movie', {
			params: {
				from: 1,
				to: 100
			}
		}).then((res) => {
			this.movies = res.data;
		});

	},
	methods: {
		bringSchedules() {
            this.$http.get('api/reservate', {
                params: {
                    movieID: this.schForm.movieID,
					cinemaID: this.schForm.cinemaID,
					date: this.schForm.date
                }
            }).then((res) => {
				this.schedules = res.data;
            });
		},
		reservate() {
            this.$http.post('api/reservate', {
				cinemaID: this.schForm.cinemaID,
				roomID: this.schForm.roomID,
				scheduleID: this.schForm.scheduleID,
				youthNum: this.schForm.youthNum,
				selectedSeats: this.schForm.seats,
			}, {
				headers: {
					'Authorization': `Bearer ${sessionStorage['token']}`
				}
            }).then((res) => {

			}).catch((err) => {

			})
		},
	}
}
</script>
