<template>

	<div class="box new-session-form-wrapper">

		<header class="section new-session-form-description">
			
			<div class="level">
				<div class="level-left">
					<h1 class="title is-4">Create New Session</h1>
				</div>
				<div class="level-right">
					<a @click = "$emit('close', false)" class="delete is-medium"></a>
				</div>
			</div>
			<p class="new-session-description is-size-6">wow! another practice session. fill in the details and you can start.</p>

		</header>

		<form id="new-session-form" class="section" @submit.prevent="validateForm" novalidate="true">

			<div class="field">
				<label for="session-name" class="label">Session Name</label>

				<div class="control">
					<input type="text" id="session-name" class="input" placeholder="eg: Mastering VWAP" v-model="newSession.name" required>
				</div>

			</div>

			<error-message :message="errors.name"></error-message>

			<div class="field">
				<label for="" class="label">Symbol</label>
				<div class="control">
					<input type="text" class="input" placeholder="eg: ICICIBANK" v-model="newSession.symbol" required>
				</div>
			</div>

			<error-message :message="errors.symbol"></error-message>

			<div class="field">
				<label for="" class="label">Timeframe</label>
				<div class="control">
			
					<div class="select">
						<select v-model="newSession.timeframe" required>
							<option value="1minute" selected>1 Minute</option>
							<option value="3minute">3 Minute</option>
							<option value="5minute">5 Minute</option>
							<option value="10minute">10 Minute</option>
							<option value="15minute">15 Minute</option>
							<option value="30minute">30 Minute</option>
							<option value="60minute">60 Minute</option>
							<option value="day">Daily</option>
						</select>
					</div>

				</div>
			</div>

			<error-message :message="errors.timeframe"></error-message>

			<div class="field">
				<label for="#" class="label">Start Date</label>
				<div class="control">
					<input class="input" type="date" v-model="newSession.startDate" required>
				</div>
			</div>

			<div class="field" v-if="lastAvailableDay">
				<span class="tag is-primary is-light">

					{{ `We've data available from ${ lastAvailableDay.format('DD-MM-YYYY').toString()  } for ${newSession.timeframe}` }}

				</span>
			</div>

			<error-message :message="errors.startDate"></error-message>

			<div class="field">
				<label for="#" class="label">End Date</label>
				<div class="control">
					<input class="input" type="date" v-model="newSession.endDate" required>
				</div>
			</div>

			<error-message :message="errors.endDate"></error-message>

			<div class="new-session-form-footer">
				<button type="submit" class="button is-link is-fullwidth" :class="{ 'is-loading': isLoading, 'is-disabled': isLoading }">Create</button>
			</div>
		</form>


	</div>

</template>	

<script>

	/* eslint-disable */

	import moment from 'moment'
	import { getSymbolStub } from './../ChartApi/ChartApi.js'
	import { realtimedb } from './../config.js'
	import router from './../router/index.js'

	import ErrorMessage from './Generic/ErrorMessage.vue'
	
	export default {

		name: 'NewSessionForm',
		components: {

			ErrorMessage

		},
		data() {
			return {
				newSessionDialogueVisible: false,
				newSession: {
					name: null,
					symbol: null,
					timeframe: null,
					startDate: null,
					endDate: null
				},
				// limits
				historyLimits: {
					'1minute': 60,
					'3minute': 100,
					'5minute': 100,
					'10minute': 100,
					'15minute': 200,
					'30minute': 200,
					'60minute': 400,
					'day': 2000
				},
				errors : {

					name: false,
					symbol: false,
					timeframe: false,
					startDate: false,
					endDate: false

				},
				isLoading: false
			}
		},
		computed: {

			numberOfErrors() {
				return Object.values( this.errors ).filter( error =>  error ).length
			},

			lastAvailableDay() {

				return this.newSession.timeframe ? moment().subtract( this.historyLimits[ this.newSession.timeframe ], 'days' ) : false

			}

		},
		methods: {

			toggleModal() {
				this.newSessionDialogueVisible = !this.newSessionDialogueVisible
			},
			addError( title, message ) {

				this.errors = {
					...this.errors,
					[title]: message
				}

			},

			resetErrors() {

				this.errors = {
					name: false,
					symbol: false,
					timeframe: false,
					startDate: false,
					endDate: false
				}

			},

			async validateForm() {

				this.isLoading = true

				this.resetErrors()

				console.log('validation running')
				
				if( !this.newSession.name )

					this.addError( 'name', 'You have to give your session a name. please enter a name' )

				if( !this.newSession.symbol ) 

					this.addError( 'symbol', 'Enter a stock for this session. You can enter any NSE Stock or Futures Contracts.' )

				else {

					// TODO: refactor getSymbolStub
					let res = await getSymbolStub( this.newSession.symbol, 1 )
					
					if( res.error ) {
						this.addError( 'symbol', res.error.error )
					}

				}

				if( !this.newSession.timeframe || !this.historyLimits[this.newSession.timeframe] )

					this.addError('timeframe', 'Please select a timeframe from the list')

				let startDate = null,
					endDate = null

				if( !this.newSession.startDate ) 
					this.addError('startDate', 'Please select the start date')
				else {

					startDate = moment(this.newSession.startDate, 'YYYY-MM-DD')

					if( startDate.startOf('day').isBefore( this.lastAvailableDay.startOf('day') ) )

						this.addError('startDate', 'the last available date to practice for ' + this.newSession.timeframe + ' is ' + this.lastAvailableDay.format('DD-MM-YYYY').toString() + '. please select a date after that')

					if( startDate.isAfter( moment() ) )

						this.addError('startDate', "Sorry. We do not support future yet. Choose A Start Date less than today")

				}

				if( !this.newSession.endDate )
					this.addError('endDate', 'Please select the end date')
				else
					endDate = moment(this.newSession.endDate, 'YYYY-MM-DD')

				if( startDate && endDate ) {
					if( endDate.isBefore( startDate ) )
						this.addError('endDate', 'End Date should be after Start Date')
				}

				if( this.numberOfErrors == 0 ) {

					console.log('Validation Successful')
					this.createSession()

				} else {

					console.log('Validation Failed')
					console.log( this.errors )

				}

				this.isLoading = false

			},
			async createSession() {

				let session = await realtimedb.ref('/sessions').push( this.newSession )
				if( session ){
					
					this.$store.dispatch('showNotification', {
						message: 'New Session Created',
						context: 'info'
					})

				}
			},
		},

	}

</script>

<style class="scoped">
	
	.new-session-form-wrapper {
		min-height: 100%;
	}
	.new-session-form-footer {
		padding: 20px 0px;
		text-align: right;
	}

	.new-session-form-description {
		background: #2366d1;
	}

	.new-session-form-description h1 {
		color: #fff;
		font-family: 'Lato';
		margin: 0;
	}

	.new-session-form-description p {
		color: #fff;
		font-weight: 400;
		font-family: 'Lato';
		opacity: 0.4;
		max-width: 70%;
		margin-top: 10px
	}

	.new-session-form-wrapper {
		padding: 0 !important;
	}	


</style>