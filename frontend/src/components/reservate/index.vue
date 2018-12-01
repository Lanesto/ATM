<template>
	<b-container fluid>
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
				<b-form-select v-model="curSch" class="mb-3" :select-size="10">
					<option :value="schedule" v-for="schedule in schedules" :key="schedule.ScheduleID">
						{{ schedule.RoomName }}, {{ schedule.PlayDate }}
					</option>
				</b-form-select>
			</b-col>
		</b-row> 
		<b-row class="mb-4">
			<b-col cols="8">
				<strong>Play At</strong>
				<b-form-input type="date" v-model="schForm.date" @change="bringSchedules"/>
			</b-col>
			<b-col cols="2">
				<strong>Youth</strong>
				<b-form-input type="number" min="0" :max="resForm.selectedSeats.length" step="1" v-model="resForm.youthNum"
							  @input="resForm.adultNum = resForm.selectedSeats.length - resForm.youthNum"/>
			</b-col>
			<b-col cols="2">
				<strong>Adult</strong>
				<b-form-input type="number" min="0" :max="resForm.selectedSeats.length" step="1" v-model="resForm.adultNum"
							  @input="resForm.youthNum = resForm.selectedSeats.length - resForm.adultNum"/>
			</b-col>
		</b-row>
		<b-row class="mb-4">
			<b-col cols="12">
				<strong>Select Seats</strong>
				<h2 class="ml-3 my-4" v-if="Object.keys(curSch).length === 0 && curSch.constructor === Object">
					There's no schedules available for this prerequisites.
				</h2>
				<b-button-group v-else class="d-block" vertical>
					<b-button-group size="sm" v-for="row in curSch.RowMax" :key="row">
						<b-button v-for="col in curSch.ColumnMax" :key="col"
 						   		 :disabled="(curSch.SeatsUnavailable || []).includes(seatConv(row, col))"
 								 :pressed="resForm.selectedSeats.includes(seatConv(row, col))" @click="seatsToggle(row, col)">{{ seatConv(row, col) }}</b-button>
					</b-button-group>
				</b-button-group>
			</b-col>
		</b-row>
		<b-row>
			<b-button class="my-1 mb-2" block @click="reservate">Reservate</b-button>
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
			curSch: {},
			schForm: {
				movieID: -1,
				cinemaID: -1,
				date: '',
			},
			resForm: {
				youthNum: 0,
				adultNum: 0,
				selectedSeats: []
			}
		}
	},
	created() {
		this.$http.get('api/cinema', {})
		.then(({data}) => { this.cinemas = data })
		
		this.$http.get('api/movie', {
			params: { // make the app simple becuz this is prototype
				from: 1,
				to: 100
			}
		}).then(({data}) => { this.movies = data })

	},
	methods: {
		seatConv(row, col) {
			return `${String.fromCharCode(65 + row - 1)}${col}`
		},
		seatsToggle(row, col) {
			var selection = this.resForm.selectedSeats
			var index = selection.indexOf(this.seatConv(row, col))
			if (index != -1) {
				selection.splice(index, 1)
				if (this.resForm.adultNum > 0) this.resForm.adultNum--
				else this.resForm.youthNum--
			} else if (selection.length < 10) {
				selection.push(this.seatConv(row, col))
				this.resForm.adultNum = selection.length - this.resForm.youthNum
			} else {
				alert('Cannot reserve more than 10 seats')
			}
		},
		bringSchedules() {
			if (this.schForm.movieID < 0 || this.schForm.cinemaID < 0 || !this.schForm) return
            this.$http.get('api/reservate', {
                params: {
                    movieID: this.schForm.movieID,
					cinemaID: this.schForm.cinemaID,
					date: this.schForm.date
                }
            }).then(({data}) => {
				if (data.length == 0) this.curSch = {}
				this.schedules = data
            })
		},
		reservate() {
			var seatList = []
			for (var x of this.resForm.selectedSeats) {
				let obj = { // this part is also simplified(prototype)
					rowNo: x[0],
					columnNo: x.slice(1)
				}
				seatList.push(obj)
			}
            this.$http.post('api/reservate', {
				cinemaID: this.schForm.cinemaID,
				roomID: this.curSch.RoomID,
				scheduleID: this.curSch.ScheduleID,
				youthNum: this.resForm.youthNum,
				selectedSeats: seatList
			}).then((res) => {
				alert('Reservated successfully')
				this.$router.push({ name: 'account' })
			}).catch((err) => { alert(err.response.data.message || err.message) })
		},
	}
}
</script>
