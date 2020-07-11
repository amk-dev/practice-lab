<template>
	<div class="div">
	<!-- <dashboard-navbar></dashboard-navbar> -->
		<div class="container">
			<div class="column">
				<div class="section">
					<h1 class="title is-4 section-title">Your Sessions</h1>
					<new-session-card></new-session-card>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	/* eslint-disable */
	import DashboardNavbar from './../components/DashboardNavBar.vue'	
	import NewSessionCard from './../components/NewSessionCard.vue'
	export default {
		name: 'Sessions',
		components: {
			DashboardNavbar,
			NewSessionCard
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

</style>