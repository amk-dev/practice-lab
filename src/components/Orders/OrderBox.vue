<template>
	<div>
		<form class="form" @submit.prevent="function() { checkBuyOrderForm( {...order[ side ]} ) }" novalidate="true">
			<div class="field">
				<div class="control">
					<label :for="prependWithSide('order-type-market')" class="radio">
						<input type="radio" :id="prependWithSide('order-type-market')" :name="getOrderTypeRadioName" :value="prependWithSide('market')" v-model="order[ side ].type" required>
						Market
					</label>
				</div>
			</div>

			<div class="field">
				<div class="control">
					<label :for="prependWithSide('order-type-limit')" class="radio">
						<input type="radio" :id="prependWithSide('order-type-limit')" :name="getOrderTypeRadioName" :value="prependWithSide('limit')" v-model="order[ side ].type" required>
						Limit
					</label>
				</div>
			</div>

			<div class="field">
				<div class="control">
					<label :for="prependWithSide('order-type-stop')" class="radio">
						<input type="radio" :id="prependWithSide('order-type-stop')" :name="getOrderTypeRadioName" :value="prependWithSide('stop-limit')" v-model="order[ side ].type" required>
						Stoploss
					</label>
				</div>
			</div>

			<div class="field">
				<div class="control">
					<label :for="prependWithSide('order-type-stop-market')" class="radio">
						<input type="radio" :id="prependWithSide('order-type-stop-market')" :name="getOrderTypeRadioName" :value="prependWithSide('stop-market')" v-model="order[ side ].type" required>
						Stoploss Market
					</label>
				</div>
			</div>

			<div class="field">
				<label :for="prependWithSide('order-price')" class="label">price</label>
				<div class="control">
					<input :id="prependWithSide('order-price')" type="number" class="input" min="0" step="0.05" placeholder="enter price" v-model="order[ side ].limitPrice" :disabled="order[ side ].type == prependWithSide('market')" required>
				</div>
			</div>

			<div class="field">
				<label :for="prependWithSide('order-quantity')" class="label">quantity</label>
				<div class="control">
					<input type="number" :id="prependWithSide('order-quantity')" class="input" min="0" placeholder="Amount to buy" v-model="order[ side ].quantity" required>
				</div>
			</div>

			<div class="field">
				<div class="control">
					<button type="submit" class="button is-fullwidth" :class="{ 'is-link': side == 'buy', 'is-danger': side == 'sell' }">{{ buttonTitle }}</button>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
	
	/* eslint-disable */

	import { v4 as uuidv4 } from 'uuid';

	export default {
		name: 'OrderBox',
		props: ['side'],
		data() {
			return {
				order: {
			    	buy: {
			    		type: 'buy-market',
				    	limitPrice: 352.05,
				    	quantity: 20000,
				    	orderline: null,
				    	side: 'buy'
			    	},
			    	sell: {
			    		type: 'sell-market',
				    	limitPrice: 352.05,
				    	quantity: 20000,
				    	orderline: null,
				    	side: 'sell'
			    	}
			    },
			    errors: [],
			    orderlines: []
			}
		},
		computed: {

			currentSession() {
				return this.$store.getters.getSession
			},

			buttonTitle() {
				return this.side == 'buy' ? 'Buy': 'Sell'
			},

			getOrderTypeRadioName() {
				return this.side + '-' + 'order-type'
			},

			orderLineColor() {

				return this.side == 'sell' ? '#ea675d' : '#4094e8'

			}

		},

		methods: {
			
			addError( error ) {
				this.errors.push( { error: error } )
			},

			prependWithSide( value ) {

				return this.side + '-' + value

			},

			addOrderLine( order ) {

				let that = this
				let orderline = tvWidget.activeChart().createOrderLine()
			    .setTooltip( order.type + ' ' + order.quantity + ' @ ' + order.limitPrice)
			    .setModifyTooltip("Order Quantity")
			    .setCancelTooltip("Cancel order")
			    .setPrice( order.limitPrice )
			    // .onModify("onModify called", function(text) {
			    //     that.$store.dispatch('cancelOrder', that.order[ that.side ].orderId)
			    // })
			    .onCancel("onCancel called", function() {
			    	console.log( order.orderId )
			        that.$store.dispatch('cancelOrder', order.orderId)
			        this.remove()
			    })
			    .setText( this.buttonTitle )
			    .setQuantity( order.quantity )
			    .setLineColor( this.orderLineColor )
			    .setBodyBorderColor( this.orderLineColor )
			    .setBodyTextColor( this.orderLineColor )
			    .setQuantityBorderColor( this.orderLineColor )
			    .setQuantityBackgroundColor( this.orderLineColor )
			    .setCancelButtonBorderColor( this.orderLineColor )
			    .setCancelButtonIconColor( this.orderLineColor )

			    return orderline._line._id

			},

			checkBuyOrderForm( order ) {
				// do we have an ordertype
				// do we have a price
					// do we have a price which is greater than 0
				// do we have a quantity 
				// do we have enough funds to buy that much quantity

				this.errors = []

				if( !order.type ) {
					this.addError( 'Please Select An Order Type' )
				}

				if( !order.limitPrice && order.type != 'buy-market' && order.type != 'sell-market' ) {
					this.addError( 'Please Enter A Price' )
				}

				if( !order.quantity ) {
					this.addError( 'Please Enter A Quantity' )
				}

				if( ( order.quantity * order.limitPrice ) > this.currentSession.currentCapital ) {
					this.addError( 'Insufficient Funds For This Order' )
				}

				if( this.errors.length == 0 ) {			

					order.orderId = uuidv4()
					order.processed = false
					order.status = 'open'

					if( order.type != 'buy-market' && order.type != 'sell-market' ) {
						order['orderlineId'] = this.addOrderLine( order )
					}

					this.$store.dispatch('addOrder', order)

				}

			}
		}
	}

</script>