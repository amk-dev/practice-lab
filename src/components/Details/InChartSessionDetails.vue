<template>
	
	<div class="session-details-wrapper column"> 
			
		<div class="session-details column is-two-thirds">

			<div class="close">
				<span class="icon" @click="$emit('closeModal')">
					<i class="fa fa-close"></i>
				</span>
			</div>				
					
			<div class="section">

				<header>
					
					<div class="text-group is-medium">
					
						<span class="text-group-title">Session Name</span>
						<h1 class="text-group-value">{{ sessionName }}</h1>

					</div>

				</header>

				<div class="text-group is-large">

					<span class="item-title">Symbol</span>
					<h1 class="text-group-value session-symbol">{{ symbol }}</h1>

				</div>

				<div class="text-group is-large">

					<span class="item-title">Period</span>
					<h1 class="text-group-value session-symbol">{{ startDate }} - {{ endDate }}</h1>

				</div>

				<div class="text-group is-large">

					<span class="item-title">Interval</span>
					<h1 class="text-group-value session-symbol">{{ timeframe }}</h1>

				</div>


			</div>

		</div>

	</div>

</template>

<script>

	/* eslint-disable */

	import { mapGetters } from 'vuex'

	export default {

		name: 'SessionDetails',
		computed: {

			...mapGetters(['sessionName', 'symbol', 'startDate', 'endDate', 'timeframe'])

		}
		
	}

</script>

<style scoped>

	.session-details-wrapper {

		display: flex;
		justify-content: center;

	}

	.session-details {
		
		background: #f1f3f6;
		border-radius: 5px;

	}

	header {
		margin-bottom: 24px;
	}

	header .text-group {
		margin-top: 0;
	}

	.text-group {
		margin-top: 10px;
		font-family: 'Lato';
		color: #000
	}

	.text-group.is-medium .text-group-value {
		font-size: 24px;
	}

	.text-group.is-medium .text-group-title {
		font-size: 12px;
	}

	.text-group.is-large .text-group-value {

		font-size: 18px;
	
	}

	.text-group.is-large .item-title {

		font-size: 12px;
	
	}

	.close {
		display: flex;
		justify-content: flex-end;		
	}

	.close span {
		transition: transform ease .2s;
		cursor: pointer;
	}

	.close span:hover {
		transform: scale(1.2);
	}

</style>