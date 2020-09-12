<template>
	<!-- <dashboard-navbar></dashboard-navbar> -->
		
		<div class="columns dashboard-content is-gapless">
				
			<div class="column">

				<div class="dashboard-content-main">

					<div class="columns">
					
						<div class="column">

							<div class="your-sessions">

								<h1 class="title is-4 section-title">Your Sessions</h1>
								<new-session-card @click.native="showSessionForm = !showSessionForm"></new-session-card>

							</div>

						</div>

					</div>

					<div class="columns">	
						
						<div class="column is-12">
							
							<div class="columns is-multiline">
								
								
								<div class="column is-6">
									
									<session-card :session="{name: 'Mastering VWAP', symbol: 'ICICIBANK', timeframe: '1 Minute', profit: 1000}"></session-card>

								</div>

								<div class="column is-6">
									
									<session-card :session="{name: 'Mastering VWAP', symbol: 'ICICIBANK', timeframe: '1 Minute', profit: 1000}"></session-card>

								</div>

								<div class="column is-6">
									
									<session-card :session="{name: 'Mastering VWAP', symbol: 'ICICIBANK', timeframe: '1 Minute', profit: 1000}"></session-card>

								</div>

								

							</div>

						</div>

					</div>

				</div>

			</div>

			<div class="column is-one-third dashboard-right-sidebar">
				
				<plab-transition name="slide">
					<new-session-form v-if="showSessionForm" @close="showSessionForm = !showSessionForm"></new-session-form>
				</plab-transition>

			</div>
			
		</div>
</template>

<script>
	/* eslint-disable */
	import DashboardNavbar from './../components/DashboardNavBar.vue'	
	import NewSessionCard from './../components/NewSessionCard.vue'
	import NewSessionForm from './../components/NewSessionForm.vue'
	import PlabTransition from './../components/Generic/PlabTransition.vue'
	import SessionCard from '@components/Dashboard/SessionCard.vue'

	import { mapGetters } from 'vuex'
	
	export default {
		name: 'Sessions',
		data: () => {

			return {
			
				showSessionForm: false

			}

		},
		computed: {

			...mapGetters(['allSessions'])

		},
		components: {
			DashboardNavbar,
			NewSessionCard,
			NewSessionForm,
			PlabTransition,
			SessionCard
		},

		mounted() {

			this.$store.dispatch('getAllSessions')

		}
	}

</script>

<style scoped>
	
	body {
		font-family: 'Lato';
		background: #f6f6f6;
	}

	.section-title {
		font-family: 'Lato'!important;
	}

	.dashboard-content-main {
		padding: 3rem 5rem;
	}

	.dashboard-content {
		min-height: 100%;
		margin-bottom: 0 !important;
	}

	.dashboard-content > .column {
		min-height: 100%
	}

</style>