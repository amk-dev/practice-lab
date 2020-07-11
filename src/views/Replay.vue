<template>
	<div class="wrapper">
		<session-chart v-if="session" :session="session" containerId="chart-test"></session-chart>

		<div v-if="!session" class="loading">traveling to past and picking up the data</div>
	</div>
</template>

<script>
	/* eslint-disable */
	import SessionChart from '@/components/SessionChart.vue'
	
	export default {
		name: 'Home',
		components: {
			SessionChart
		},
		data() {
			return {
				error: null
			}
		},
		computed: {
			session: function() {
				
				return this.$store.getters.getSession

			}
		},
		async mounted() {

			try {
				
				await this.$store.dispatch('setSession', this.$route.params.session)

			} catch( err ) {
				
				if( err.message == 'session-does-not-exist' ) {

					this.error = 'Cannot Find Session'

				}

			}
		}
	}

</script>

<style>
	
</style>