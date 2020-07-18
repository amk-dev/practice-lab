<template>
	<!-- <dashboard-navbar></dashboard-navbar> -->
		
		<div class="columns dashboard-content is-gapless">
				
			<div class="column">

				<div class="dashboard-content-main">
					
					<div class="section your-sessions">

						<h1 class="title is-4 section-title">Your Sessions</h1>
						<new-session-card @click.native="showSessionForm = !showSessionForm"></new-session-card>

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
	
	export default {
		name: 'Sessions',
		data: () => {

			return {
			
				showSessionForm: false

			}

		},
		components: {
			DashboardNavbar,
			NewSessionCard,
			NewSessionForm,
			PlabTransition
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