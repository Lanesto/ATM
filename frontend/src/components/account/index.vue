<template>
	<div class="hello">
		<b-container fluid>
			<b-row class="my-4">
				<b-col cols="8" sm="6">
					<b-card :title="privates.CustomerID" 
							:sub-title="`${privates.CustomerName} (${privates.Age}, ${privates.Gender})`">
						<p class="mb-1 card-text">
							Contact: {{ privates.ContactNumber }}
						</p>
						<p class="mb-1 card-text">
							Address: {{ privates.Address }}
						</p>
						<p class="card-text">
							Email: {{ privates.Email }}
						</p>
					</b-card>
				</b-col>
			</b-row>
			<b-row class="mt-2">
				<b-table v-if="reservations.length > 0" hover :items="reservations" :fields="fields"
						@row-clicked="cancelReservation"/>
				<h2 class="mx-3 my-3" v-else>You have no reservations.</h2>
			</b-row>
		</b-container>
	</div>
</template>


<script>
export default {
    name: 'account',
	data () {
		return {
			privates: {},
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
					sortable: false
				},
				{
					key: 'TotalPrice',
					label: 'Price',
					sortable: true
				},
				{
					key: 'AdultTicketCount',
					label: 'Adult',
					sortable: false
				},
				{
					key: 'YouthTicketCount',
					label: 'Youth',
					sortable: false
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
					sortable: false
				},
				{
					key: 'Seats',
					label: 'Seats',
					sortable: false
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
		this.bringPrivates();
		this.bringReservations();
	},
	methods: {
		bringPrivates() {
            this.$http.post('auth/account', {}, {
				headers: {
					'Authorization': `Bearer ${sessionStorage['token']}`
				},
            }).then((res) => {
				this.privates = res.data;
				if (this.privates.Gender == 'M') this.privates.Gender = 'Male';
				else if (this.privates.Gender == 'F') this.privates.Gender = 'Female';
            })
		},
		bringReservations() {
            this.$http.post('auth/account/reservation', {
					from: this.loadPoint,
					to: this.loadPoint + this.loadCount - 1
				},{
				headers: {
					'Authorization': `Bearer ${sessionStorage['token']}`
				}
				}).then((res) => {
                let data = res.data
                if (data.length > 0) {
					this.reservations.push(...data);
					this.loadPoint += data.length;
                }
                if (data.length < this.loadCount || data.length <= 0) {
                    this.isEnd = true;
				}
            })
		},
		cancelReservation(item) {
			var resID = item.ReservationID;
			var answer = confirm(`Cancel reservation for ${resID}?`);
			if (!answer) {
				return;
			}
            this.$http.delete(`api/reservate/${resID}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage['token']}`
                }
            }).then((res) => {
				this.reservations = this.reservations.filter(x => x.ReservationID != resID);
            }).catch(err => {
                var msg = '';
                if (err.response) { // Response Error
                    var res = err.response;
                    msg = res.data.message;
                } else if (err.request) { // Server Error
                    msg = err.message;
                } else { // Request Error
                    msg = err.message;
                }
                alert(msg);
            });
		}
	}
}
</script>
