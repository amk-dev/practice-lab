<template>
	<div ref="drag-container" @mousedown="dragStart" @mouseup="dragEnd" @mousemove="drag">

		<div :id="containerId"></div>
		
		<transition name="fade">
			
			<floating-box
				:currently-active-box.sync="active"
				v-model="floatingBoxs.barSpeed"
				box-id="barSpeed"
				ref="barSpeed" >

				<bar-speed v-model="speed"></bar-speed>

			</floating-box>

		</transition>

		<transition name="fade">

			<floating-box 
				:currently-active-box.sync="active" 
				v-model="floatingBoxs.buyOrderForm"
				box-id="buyOrderForm"
				ref="buyOrderForm" 
				title="New Buy Order" >

				<OrderBox side="buy"></OrderBox>

			</floating-box>

		</transition>

		<transition name="fade">

			<floating-box 
				:currently-active-box.sync="active" 
				v-model="floatingBoxs.sellOrderForm"
				box-id="sellOrderForm"
				ref="sellOrderForm" 
				title="New Sell Order" >

				<OrderBox side="sell"></OrderBox>

			</floating-box>

		</transition>

		<transition name="fade">
			
			<floating-box 
				:currently-active-box.sync="active" 
				v-model="floatingBoxs.pnlBox"
				box-id="pnlBox"
				ref="pnlBox" 
				title="Profit / Loss" >

				<PnLBox></PnLBox>

			</floating-box>

		</transition>

	
		<transition name="fade">
			
			<floating-box 
				:currently-active-box.sync="active" 
				v-model="floatingBoxs.orders"
				box-id="orders"
				ref="orders" 
				title="Orders" >

				<orders></orders>

			</floating-box>

		</transition>	

		<transition name="fade">
		<modal-component v-model="sessionDetailsModal">
			
			<in-chart-session-details @closeModal=" sessionDetailsModal = false "></in-chart-session-details>
	
		</modal-component>
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
	import BarSpeed from './BarSpeed/BarSpeed.vue'

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
			Orders,
			BarSpeed,
			ModalComponent,
			InChartSessionDetails
		},
		data: () => {
			return {
				// TODO : Move This To Local Storage
				currentSession: null,
				mouseDown: false,
				active: null,
				dragTarget: null
			}
		},
		methods: {
			// todo: add touch events so mobile devices can also work with it 
			dragStart(e) {
				
				if( e.target === this.$refs.barSpeed.$refs['move-icon-speed-box'] ) {

					this.dragTarget = 'barSpeed'
					this.active = 'barSpeed'

				} else if( e.target === this.$refs.buyOrderForm.$refs['move-icon-speed-box'] ) {

					this.dragTarget = 'buyOrderForm'
					this.active = 'buyOrderForm'

				} else if( e.target === this.$refs.sellOrderForm.$refs['move-icon-speed-box'] ) {

					this.dragTarget = 'sellOrderForm'
					this.active = 'sellOrderForm'

				} else if( e.target === this.$refs.pnlBox.$refs['move-icon-speed-box'] ) {

					this.dragTarget = 'pnlBox'
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
		transition: opacity .2s;
	}

	.fade-enter, .fade-leave-to {
		opacity: 0;
	}

</style>