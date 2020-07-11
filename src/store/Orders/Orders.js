/* eslint-disable */
import Vue from 'vue'
export default {

	state: () => {
		return {

			orders: [],
			realisedProfit: 0,	
			marginAvailable: 0,
			lastBar: null
		}
	},

	mutations: {

		// Order Related
		ADD_ORDER( state, order ) {
			state.orders.push( { ...order, created: state.lastBar.time } )
		},
		CANCEL_ORDER( state, orderId ) {

			let orderIndex = state.orders.findIndex( order => order.orderId == orderId )
			state.orders.splice( orderIndex, 1 )

		},
		ORDER_REJECTED( state, { orderId } ) {

			let orderIndex = state.orders.findIndex( order => order.orderId == orderId )			
			Vue.set( state.orders, orderIndex, {

				...state.orders[orderIndex],
				status: 'rejected',
				processed: 1,
				processedAt: state.lastBar.time,

			})

		},
		ORDER_FILLED( state, details ) {

			let orderIndex = state.orders.findIndex( order => order.orderId == details.orderId )
			Vue.set( state.orders, orderIndex, {

				...state.orders[orderIndex],
				status: 'filled',
				processed: true,
				processedAt: state.lastBar.time,
				orderValue: details.executedPrice * state.orders[orderIndex].quantity,
				executedPrice: details.executedPrice

			 } )	
		},
		SET_ORDERS( state, orders ) {
			state.orders = orders
		},
		// Margin Related
		SET_MARGIN_AVAILABLE( state, amount ) {
			state.marginAvailable = amount
		},
		UPDATE_MARGIN( state, amount ) {
			state.marginAvailable += amount
		},
		UPDATE_REALISED_PROFIT( state, amount ) {
			state.realisedProfit = amount
		},

		// Other
		SET_LASTBAR( state, lastBar ) {
			state.lastBar = lastBar
		},

	},

	getters: {

		allOrders: ( state ) => {
			return state.orders
		},
		filledOrders: ( state ) => {
			return state.orders.filter( order => order.status == 'filled' )
		},
		openOrders: ( state ) => {
			return state.orders.filter( order => order.processed == false )
		},
		openQuantity: ( state, getters ) => {

			let buyQuantity = getters.filledOrders.filter( order => order.side == 'buy' ).reduce( ( quantitySum, order ) => quantitySum + parseInt(order.quantity), 0 )
			let sellQuantity = getters.filledOrders.filter( order => order.side == 'sell' ).reduce( ( quantitySum, order ) => quantitySum + parseInt(order.quantity), 0 )

			return buyQuantity - sellQuantity

		},
		totalBuyValue: ( state, getters ) => {

			let totalBuyValue = getters.filledOrders.filter( order => order.side == 'buy' ).reduce( ( buyValueSum, order ) => { return buyValueSum + order.orderValue }, 0 )
			
			if( getters.openQuantity < 0 )
				
				totalBuyValue = totalBuyValue + ( state.lastBar['close'] * Math.abs(getters.openQuantity) )

			return totalBuyValue

		},
		totalSellValue: ( state, getters ) => {

			let totalSellValue = getters.filledOrders.filter( order => order.side == 'sell' ).reduce( ( sellValueSum, order ) => { return sellValueSum + order.orderValue }, 0 )

			if( getters.openQuantity > 0 ) 
				
				totalSellValue = totalSellValue + ( state.lastBar['close'] * getters.openQuantity )

			return totalSellValue

		},
		totalProfit: ( state, getters ) => {

			return getters.totalSellValue - getters.totalBuyValue

		},
		unrealisedProfit: ( state, getters ) => {

			return getters.totalProfit - state.realisedProfit

		},
		realisedProfit: ( state ) => {

			return state.realisedProfit

		},
		marginAvailable: ( state, getters ) => {
			return state.marginAvailable
		},
		lastPrice: ( state, getters ) => {

			return state.lastBar.close

		}

	},

	actions: {

		lastBarChanged( { dispatch, commit }, lastBar )  {
			commit('SET_LASTBAR', lastBar)
		},

		async addOrder( { commit, state, dispatch }, order ) {

			commit('ADD_ORDER', order)
			dispatch('showNotification', { message: 'Order Created', context: 'success' })

		},

		checkOrders( { dispatch, commit, getters, state } ) {

			let newBar = state.lastBar

			for( let order of state.orders ) {

				if( order.processed == true ) {

				} else  {

					let fillDetails = null

					switch( order.type ) {

						case 'buy-market': 

							fillDetails = {
								orderId: order.orderId,
								executedPrice: newBar['open'] 
							}

							break

						case 'buy-limit':
						
							if( order.limitPrice > newBar['high'] ) {

								fillDetails = {
									orderId: order.orderId,
									executedPrice: newBar['open'] 
								}

							}

							else if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {
								
								fillDetails = {
									orderId: order.orderId,
									executedPrice: order.limitPrice 
								}

							}

							break

						case 'buy-stop-limit':

							if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {
							
								fillDetails = {
									orderId: order.orderId,
									executedPrice: order.limitPrice
								}

							}

							break

						case 'buy-stop-market':
							
							if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {
															
								fillDetails = {
									orderId: order.orderId,
									executedPrice: newBar['high'] 
								}

							}

							break

						case 'sell-market': 

							fillDetails = {
								orderId: order.orderId,
								executedPrice: newBar['open']
							}

							break

						case 'sell-limit':
							
							if( order.limitPrice < newBar['low'] ) {
							
								fillDetails = {
									orderId: order.orderId, 
									executedPrice: newBar['open'] 
								}
						
							}
						
							else if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {

								fillDetails = {
									orderId: order.orderId, 
									executedPrice: order.limitPrice 
								}

							}

							break

						case 'sell-stop-limit':

							if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {
								
								fillDetails = {
									orderId: order.orderId, 
									executedPrice: order.limitPrice 
								}

							}

							break

						case 'sell-stop-market':
							
							if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {
								
								fillDetails = {
									orderId: order.orderId, 
								 	executedPrice: newBar['low'] 
								}

							}

							break

					}

					if( fillDetails ) {

						let previousOpenQuantity = getters.openQuantity
						let previousRealisedProfit = getters.realisedProfit
						let previousTotalProfit = getters.totalProfit
						let previousTotalSellValue = getters.totalSellValue
						let previousTotalBuyValue = getters.totalBuyValue

						if( ( fillDetails.executedPrice * order.quantity ) <= state.marginAvailable ) {	

							commit('ORDER_FILLED', fillDetails )

							let marginUpdateDetails = {
								executedPrice: fillDetails.executedPrice,
								previousOpenQuantity,
								previousRealisedProfit,
								side: order.side,
								previousTotalBuyValue,
								previousTotalSellValue
							}

							dispatch('updateMargins', marginUpdateDetails)
							dispatch('showNotification', {
								message: 'Order Filled',
								context: 'success'
							} )

						} else {

							commit('ORDER_REJECTED', { orderId: order.orderId })
						
							dispatch('showNotification', {
								message: 'Insufficient Balance',
								context: 'failure'
							} )

						}
						

					}

				}

			}
			
		},

		updateMargins( { commit, getters }, details ){

			
			let change = getChangeInPosition( details.previousOpenQuantity, getters.openQuantity )
			let marginChange,
				realisedProfit

			let totalProfit = getAdjustedTotalProfit( change, getters.totalProfit, {

				previousTotalSellValue: details.previousTotalSellValue,
				previousTotalBuyValue: details.previousTotalBuyValue,
				totalSellValue: getters.totalSellValue,
				totalBuyValue: getters.totalBuyValue,
				executedPrice: details.executedPrice

			} )

			console.log( totalProfit )

			if( change.squredOff != 0 ) {

				realisedProfit = ( ( Math.abs( change.squredOff ) / Math.abs( details.previousOpenQuantity ) ) * ( totalProfit ) )
				commit('UPDATE_REALISED_PROFIT', realisedProfit)

			}

			if( change.squredOff < 0 ) {

				marginChange = ( ( Math.abs( change.squredOff ) * details.executedPrice ) + ( 2 * ( realisedProfit - details.previousRealisedProfit ) ) ) - ( Math.abs(change.added) * details.executedPrice )

			} else {

				marginChange = ( Math.abs(change.squredOff) * details.executedPrice ) - ( Math.abs(change.added) * details.executedPrice )

			}

			if( marginChange != 0 ) {
				commit('UPDATE_MARGIN', marginChange)
				console.log('Current Margin Is ', getters.marginAvailable )
			} 

		},

		cancelOrder( { dispatch, commit }, orderId  ) {
			commit('CANCEL_ORDER', orderId)
			dispatch('showNotification', 'Order Canceled')
		}

	}

}

/**
* finds squared off quantity and newly added quantity
*/
function getChangeInPosition( previous, current ) {

	if( Math.abs( previous - current ) > Math.abs( previous ) ) {

        return {
            squredOff: previous,
            added: current 
        }

	} else if( ( Math.abs(current)  - Math.abs(previous) )  > 0 ) {

        return {

            squredOff: 0,
            added: ( current - previous ) > 0 ? Math.abs(current)  - Math.abs(previous) : -1 * ( Math.abs(current)  - Math.abs(previous) )

        }

	} else {
        
        return {
            squredOff: ( previous - current ) > 0 ? Math.abs(previous) - Math.abs(current) : -1 * ( Math.abs(previous) - Math.abs(current) ) ,
            added: 0
        }    
    
    }

}

/**
* the total profit has some changes from the desired value due to the differences in Last Traded Price And Executed Price. this function eliminate that issue
*/
function getAdjustedTotalProfit( change, totalProfit, details ) {

	if( change.added > 0 ) 
		return details.previousTotalSellValue - details.totalBuyValue + ( change.added * details.executedPrice )

	if( change.added < 0 ) 
		return totalProfit = details.totalSellValue - details.previousTotalBuyValue + ( change.added * details.executedPrice )

	return totalProfit

}