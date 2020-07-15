<template>

	<div class="content orders-wrapper">
		
		<table class="table" :class="{ 'hidden-with-space': allOrders.length == 0 }">
			
			<thead>
				
				<tr>
					<th>Direction</th>
					<th>Type</th>
					<th>Quantity</th>
					<th>Trigger Price</th>
					<th>Executed Price</th>
					<th>LTP</th>
					<th>Status</th>
				</tr>

			</thead>

			<tbody>

				<tr v-for="order in ordersReversed " :key="order.orderId" >
					
					<td>
						<span class="tag" :class="{ 'is-link': order.side == 'buy', 'is-danger': order.side == 'sell' }">
							{{ order.side == 'buy' ? 'Buy': 'Sell' }}
						</span>
					</td>
					<td> {{ formatOrderType( order.type ) }} </td>
					<td> {{ order.quantity }} </td>
					<td> {{ ( order.type == 'buy-market' || order.type == 'sell-market' ) ? 'N/A' : order.limitPrice }} </td>
					<td> {{ parseFloat(order.executedPrice).toFixed(2) }} </td>
					<td> {{ parseFloat(lastPrice).toFixed(2) }} </td>
					<td>
						<span class="tag" :class="{ 'is-success': order.status == 'filled', 'is-light': order.status == 'open', 'is-danger': order.status == 'rejected' }">
							{{ order.status.toUpperCase() }}
						</span>
					</td>

				</tr>

			</tbody>

		</table>

		<p v-if="allOrders.length == 0" class="no-order-text">No Orders Placed Yet</p>

		<!-- <div class="level">
			
			<div class="level-right">
				<button class="level-item button is-small">Previous</button>
				<button class="level-item button is-small">Next</button>
			</div>

		</div> -->

	</div>

</template>

<script>
	
	/* eslint-disable */

	import { mapGetters } from 'vuex'

	export default {

		name: 'Orders',
		computed: {

			...mapGetters(['allOrders', 'lastPrice']),

			ordersReversed() {

				return this.allOrders.slice().reverse()

			}

		},

		methods: {

			// refactor
			formatOrderType( orderType ) {
				
				return {

					'buy-market' : 'Market',
					'buy-limit' : 'Limit',
					'buy-stop-limit': 'Stoploss Limit',
					'buy-stop-market': 'Stoploss Market',
					'sell-market' : 'Market',
					'sell-limit' : 'Limit',
					'sell-stop-limit': 'Stoploss Limit',
					'sell-stop-market': 'Stoploss Market'

				}[ orderType ]

			}

		}

	}

</script>

<style>

	.no-order-text {
		
		text-align: center;

	}	

	.hidden-with-space {

		visibility: collapse;
		margin: 0 !important;

	}

</style>