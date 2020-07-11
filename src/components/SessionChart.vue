<template>
	<div ref="drag-container" @mousedown="dragStart" @mouseup="dragEnd" @mousemove="drag">
		<div :id="containerId"></div>
		
		<transition name="fade">
			<floating-box @click.native=" active = 'barSpeed' " :class="{ active: active == 'barSpeed' }" ref="replaySpeedBox" @close="floatingBoxs.barSpeed = false" v-show="floatingBoxs.barSpeed">

				<div class="field">
					<label for="" class="label">bar speed (in seconds)</label>
					<div class="control">
						<input type="number" class="input" min="0" placeholder="enter bar speed in seconds" v-model="speed">
					</div>
				</div>

			</floating-box>
		</transition>

		<transition name="fade">
			<floating-box @click.native=" active = 'buyOrderForm' " :class="{ active: active == 'buyOrderForm' }" ref="newBuyOrderBox" @close="floatingBoxs.buyOrderForm = false" title="New Buy Order" v-show="floatingBoxs.buyOrderForm">
				<OrderBox side="buy"></OrderBox>
			</floating-box>
		</transition>

		<transition name="fade">
		<floating-box @click.native=" active = 'sellOrderForm' " :class="{ active: active == 'sellOrderForm' }" ref="newSellOrderBox" @close="floatingBoxs.sellOrderForm = false" title="New Sell Order" v-show="floatingBoxs.sellOrderForm">
			<OrderBox side="sell"></OrderBox>
		</floating-box>
		</transition>

		<transition name="fade">
			<floating-box @click.native=" active = 'pnlBox' " :class="{ active: active == 'pnlBox' }" ref="profitAndLossBox" @close="floatingBoxs.pnlBox = false" title="Profit / Loss" v-show="floatingBoxs.pnlBox">

				<PnLBox></PnLBox>

			</floating-box>
		</transition>

	
		<transition name="fade">
			<floating-box @click.native=" active = 'orders' " :class="{ active: active == 'orders' }" ref="orders" @close="floatingBoxs.orders = false" title="Orders" v-show="floatingBoxs.orders">

				<orders></orders>

			</floating-box>
		</transition>
	
		<notifications></notifications>

	</div>
</template>

<script>

	 /* eslint-disable */
	
	import ChartApiMixin, { getBarsSession, subscribeBarsSession } from '../ChartApi/ChartApi.js'
	import FloatingBox from './Generic/FloatingBox.vue'
	import OrderBox from './Orders/OrderBox.vue'
	import Notifications from './Generic/Notifications.vue'
	import PnLBox from './Orders/PnLBox.vue'
	import Orders from './Orders/Orders.vue'

	ChartApiMixin.methods.getBars = getBarsSession
	ChartApiMixin.methods.subscribeBars = subscribeBarsSession

	export default {
		name: 'SessionChart',
		mixins: [ChartApiMixin],
		props: {
			'session': Object,
			'containerId': String
		},
		components: {
			FloatingBox,
			Notifications,
			OrderBox,
			PnLBox,
			Orders
		},
		data: () => {
			return {
				// TODO : Move This To Local Storage
				currentSession: null,
				mouseDown: false,
				dragTarget: null
			}
		},
		methods: {
			// todo: add touch events so mobile devices can also work with it 
			dragStart(e) {
				
				if( e.target === this.$refs.replaySpeedBox.$refs['move-icon-speed-box'] ) {

					this.dragTarget = 'replaySpeedBox'
					this.active = 'barSpeed'

				} else if( e.target === this.$refs.newBuyOrderBox.$refs['move-icon-speed-box'] ) {

					this.dragTarget = 'newBuyOrderBox'
					this.active = 'buyOrderForm'

				} else if( e.target === this.$refs.newSellOrderBox.$refs['move-icon-speed-box'] ) {

					this.dragTarget = 'newSellOrderBox'
					this.active = 'sellOrderForm'

				} else if( e.target === this.$refs.profitAndLossBox.$refs['move-icon-speed-box'] ) {

					this.dragTarget = 'profitAndLossBox'
					this.active = 'pnlBox'

				} else if( e.target === this.$refs.orders.$refs['move-icon-speed-box'] ) {

					this.dragTarget = 'orders'
					this.active = 'orders'
				} 

				if( this.dragTarget ) {

					this.$refs[ this.dragTarget ].initialX = e.clientX - this.$refs[ this.dragTarget ].xOffset;
				    this.$refs[ this.dragTarget ].initialY = e.clientY - this.$refs[ this.dragTarget ].yOffset;

				}

		    },

		    dragEnd(e) {
		    	
		    	if( this.dragTarget ) {
		    	
		    		this.$refs[ this.dragTarget ].initialX = this.$refs[ this.dragTarget ].currentX;
					this.$refs[ this.dragTarget ].initialY = this.$refs[ this.dragTarget ].currentY;
					this.dragTarget = null
					
				}
				

		    },

			drag(e) {

				if (this.dragTarget) {

					console.log('Drag In Progress')

					e.preventDefault();

					this.$refs[ this.dragTarget ].currentX = e.clientX - this.$refs[ this.dragTarget ].initialX;
					this.$refs[ this.dragTarget ].currentY = e.clientY - this.$refs[ this.dragTarget ].initialY;

					this.$refs[ this.dragTarget ].xOffset = this.$refs[ this.dragTarget ].currentX;
					this.$refs[ this.dragTarget ].yOffset = this.$refs[ this.dragTarget ].currentY;

					this.setTranslate(this.$refs[ this.dragTarget ].currentX, this.$refs[ this.dragTarget ].currentY, this.$refs[ this.dragTarget ].$refs['floatingBoxContainer']);
				}
			},

			setTranslate(xPos, yPos, el) {
				el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
			},
		}
	}

</script>

<style>
	
	.active {
		z-index: 1
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity .1s;
	}

	.fade-enter, .fade-leave-to {
		opacity: 0;
	}

</style>