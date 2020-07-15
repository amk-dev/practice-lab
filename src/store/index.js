/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

import createLogger from 'vuex/dist/logger'

import Session from './Session/Session.js'
import Orders from './Orders/Orders.js'
import Notifications from './Notifications/Notifications.js'
import API from './Api/Api.js'

Vue.use(Vuex);

const chartingLibraryOrderLineRemover = store => {

	store.subscribe( ( mutation, state ) => {

		if( mutation.type == 'ORDER_FILLED' || mutation.type == 'ORDER_REJECTED' ) {

			console.log( mutation )

			let order = state.Orders.orders.filter( order => order.orderId == mutation.payload.orderId ) 

			console.log( order )

			if( order.type != 'buy-market' && order.type != 'sell-market' ) {

				tvWidget.activeChart().removeEntity( order[0].orderlineId )

			}

		}

	} )
 
}


export default new Vuex.Store({
	modules: {
		Session, Orders, Notifications, API
	},
	plugins: [ chartingLibraryOrderLineRemover ]
});
