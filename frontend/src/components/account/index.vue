<template>
	<div class="hello">
		<b-container fluid>
			<b-row class="my-4">
				<b-col>
					<b-card :title="privates.CustomerID" 
							:sub-title="`${privates.CustomerName} (${privates.Age}, ${privates.Gender})`">
						<b-container class="p-1" fluid>
							<b-row class="my-1">
								<b-col sm="2" md="1"><label class="font-weight-bold" for="contactInput">Contact:</label></b-col>
								<b-col>
									<b-input id="contactInput" :style="editing ? null : styleObj"
											 type="text" size="sm" :disabled="!editing"
											 v-model="privates.ContactNumber"/>
								</b-col>
							</b-row>
							<b-row class="my-1">
								<b-col sm="2" md="1"><label class="font-weight-bold" for="addrInput">Address:</label></b-col>
								<b-col>
									<b-input id="addrInput" :style="editing ? null : styleObj"
											 type="text" size="sm" :disabled="!editing"
											 v-model="privates.Address"/>
								</b-col>
							</b-row>
							<b-row class="my-1">
								<b-col sm="2" md="1"><label class="font-weight-bold" for="emailInput">Email:</label></b-col>
								<b-col>
									<b-input id="emailInput" :style="editing ? null : styleObj"
											 type="email" size="sm" :disabled="!editing"
											 v-model="privates.Email"/>
								</b-col>
							</b-row>
							<b-row class="mt-3 mr-2" align-h="start">
								<b-button v-if="!editing" class="ml-3" variant="primary" @click="editing=true">Edit Profile</b-button>
								<div v-else>
									<b-button class="ml-3 mr-1" variant="secondary" @click="editing=false">Cancel</b-button>
									<b-button class="mr-1" variant="success" @click="updatePrivates">OK, Update!</b-button>
									<b-button class="mr-1" variant="danger" @click="deleteAccount">Delete Account</b-button>
								</div>
							</b-row>
						</b-container>
					</b-card>
				</b-col>
			</b-row>
			<b-row class="mt-2 px-3">
				<b-table v-if="reservations.length > 0" hover :items="reservations" :fields="fields"
						@row-clicked="cancelReservation"/>
				<h2 v-else class="mx-3 mt-3 mb-5">You have no reservations.</h2>
			</b-row>
		</b-container>
	</div>
</template>


<script>
export default {
    name: 'account',
	data () {
		return {
			// private info
			privates: {},
			editing: false,
			styleObj: {
				backgroundColor: 'white',
				border: 'none'
			},
			// reserved tickets
            reservations: [],
            loadPoint: 1,
            loadCount: 5,
			isEnd: false,
			fields: [
				{
					key: 'ReservationID',
					label: 'ID',
					sortable: true
				},
				{
					key: 'MovieTitle',
					label: 'Movie',
				},
				{
					key: 'TotalPrice',
					label: 'Price',
					sortable: true
				},
				{
					key: 'AdultTicketCount',
					label: 'Adult',
				},
				{
					key: 'YouthTicketCount',
					label: 'Youth',
				},
				{
					key: 'ReservedDate',
					label: 'Reserved At',
					sortable: true
				},
				{
					key: 'CinemaName',
					label: 'Cinema',
					sortable: true
				},
				{
					key: 'RoomName',
					label: 'Room',
				},
				{
					key: 'Seats',
					label: 'Seats',
				},
				{
					key: 'PlayDate',
					label: 'Play At',
					sortable: true
				}
			]
		}
	},
	created() { // for api communication test
		this.bringPrivates()
		this.bringReservations()
	},
	methods: {
		bringPrivates() {
			this.$http.get('auth/account', {})
			.then(({data})=> {
				if (data.Gender == 'M') data.Gender = 'Male'
				else if (data.Gender == 'F') data.Gender = 'Female'

				this.privates = data
            })
		},
		updatePrivates() {
			this.$http.put('auth/account', {
				contactNumber: this.privates.ContactNumber,
				address: this.privates.Address,
				email: this.privates.Email
			}).then(res => { this.editing = false })
			.catch(err => { alert(err.message) })
		},
		deleteAccount() {
			if (!confirm('ALL ACCOUNT INFORMATIONS WILL BE DELETED PERMANENTLY.\n\n  Are you sure?')) return;
			this.$http.delete('auth/account')
			.then(res => {
				this.$store.dispatch('LOGOUT')
				this.$router.replace({ name: 'home' })
			}).catch(err => { alert(err.message) })
		},
		bringReservations() {
            this.$http.get('auth/account/reservation', {
					from: this.loadPoint,
					to: this.loadPoint + this.loadCount - 1
				}).then((res) => {
                let data = res.data
                if (data.length > 0) {
					this.reservations.push(...data)
					this.loadPoint += data.length
                }
                if (data.length < this.loadCount || data.length <= 0) {
                    this.isEnd = true
				}
            })
		},
		cancelReservation(item) {
			var resID = item.ReservationID
			var answer = confirm(`Cancel reservation for ${resID}?`)
			if (!answer) {
				return
			}
			this.$http.delete(`api/reservate/${resID}`)
			.then((res) => { 
				this.reservations = this.reservations.filter(x => x.ReservationID != resID)
            }).catch(err => { alert(err.message) })
		}
	}
}
</script>
