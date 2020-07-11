<template>

	<div class="content pnl-box">
		
		<!-- <div class="content">
			<h1 class="subtitle is-6">Open Profit</h1>
			<h2 class="title green is-4">+ 10750.50</h2>
		</div> -->

		<div class="content">
			<h1 class="subtitle is-6">Unrealised Profit</h1>
			<h2 class="title is-4" :class="{ 'green': unrealisedProfit > 0, 'red': unrealisedProfit < 0, 'neutral': unrealisedProfit == 0 }">{{ parseFloat(unrealisedProfit).toFixed(2) }}</h2>
		</div>

		<div class="content">
			<h1 class="subtitle is-6">Realised Profit</h1>
			<h2 class="title is-4" :class="{ 'green': realisedProfit > 0, 'red': realisedProfit < 0, 'neutral': realisedProfit == 0 }">{{ parseFloat(realisedProfit).toFixed(2) }}</h2>
		</div>

		<div class="content">
			<h1 class="subtitle is-6">Session Profit</h1>
			<h2 class="title is-4" :class="{ 'green': totalProfit > 0, 'red': totalProfit < 0, 'neutral': totalProfit == 0 }">{{ parseFloat(totalProfit).toFixed(2) }}</h2>
		</div>

		<div class="content">
			<h1 class="subtitle is-6">Open Quantity</h1>
			<h2 class="title is-4">{{ openQuantity }}</h2>
		</div>

		<div class="content">
			<h1 class="subtitle is-6">Account Value</h1>
			<h2 class="title is-4">{{ parseFloat(marginAvailable).toFixed(2) }}</h2>
		</div>

	</div>
	
</template>

<script>
	
	import { mapGetters } from 'vuex'

	export default {

		name: 'PnLBox',

		computed: {

			...mapGetters( ['openQuantity', 'realisedProfit', 'unrealisedProfit', 'totalProfit', 'marginAvailable'] )

		}

	}

</script>

<style scoped>
	
	.green {
		color: green;
	}

	.red {
		color: red;
	}

	.neutral {
		color: black;
	}

</style>