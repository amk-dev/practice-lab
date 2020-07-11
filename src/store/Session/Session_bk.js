// /* eslint-disable */
// import { realtimedb } from './../../config.js'
// import { v4 as uuidv4 } from 'uuid'
// import Vue from 'vue'

// export default {

// 	state: {
// 		session: null,
// 		orders: [],
// 		notifications: [
// 		],
// 		lastBar: null,
// 		realisedProfit: 0,
// 	},

// 	getters: {

// 		getSession: ( state ) => {
// 			return state.session
// 		},
// 		notifications: ( state ) => {
// 			return state.notifications
// 		},
// 		allOrders: ( state ) => {
// 			return state.orders
// 		},
// 		filledOrders: ( state ) => {
// 			return state.orders.filter( order => order.filled == 1 )
// 		},
// 		openOrders: ( state ) => {
// 			return state.orders.filter( order => order.filled == 0 )
// 		},
// 		openQuantity: ( state, getters ) => {

// 			let buyQuantity = getters.filledOrders.filter( order => order.side == 'buy' ).reduce( ( quantitySum, order ) => quantitySum + parseInt(order.quantity), 0 )
// 			let sellQuantity = getters.filledOrders.filter( order => order.side == 'sell' ).reduce( ( quantitySum, order ) => quantitySum + parseInt(order.quantity), 0 )

// 			return buyQuantity - sellQuantity

// 		},
// 		totalBuyValue: ( state, getters ) => {

// 			let totalBuyValue = getters.filledOrders.filter( order => order.side == 'buy' ).reduce( ( buyValueSum, order ) => { return buyValueSum + order.orderValue }, 0 )

// 			console.log('Buy Value WithOut Open Quantity', totalBuyValue)

// 			if( getters.openQuantity < 0 )
				
// 				totalBuyValue = totalBuyValue + ( state.lastBar['close'] * Math.abs(getters.openQuantity) )

// 			return totalBuyValue

// 		},
// 		totalSellValue: ( state, getters ) => {

// 			let totalSellValue = getters.filledOrders.filter( order => order.side == 'sell' ).reduce( ( sellValueSum, order ) => { return sellValueSum + order.orderValue }, 0 )

// 			console.log('Sell Value WithOut Open Quantity', totalSellValue)

// 			if( getters.openQuantity > 0 ) 
				
// 				totalSellValue = totalSellValue + ( state.lastBar['close'] * getters.openQuantity )

// 			return totalSellValue

// 		},
// 		totalProfit: ( state, getters ) => {

// 			return getters.totalSellValue - getters.totalBuyValue

// 		},
// 		unrealisedProfit: ( state, getters ) => {

// 			return getters.totalProfit - state.realisedProfit

// 		},
// 		realisedProfit: ( state ) => {

// 			return state.realisedProfit

// 		},
// 		lastPrice: ( state ) => {

// 			return state.lastBar.close

// 		},

// 		marginAvailable: ( state, getters ) => {
// 			return state.session.marginAvailable
// 		}
// 	},

// 	mutations: {

// 		SET_SESSION( state, session ) {
// 			state.session = session
// 		},
// 		SET_LASTBAR( state, lastBar ) {
// 			state.lastBar = lastBar
// 		},
// 		ADD_ORDER( state, order ) {
// 			state.orders.push( { ...order, created: state.lastBar.time } )
// 		},
// 		SET_ORDERS( state, orders ) {
// 			state.orders = orders
// 		},
// 		ORDER_FILLED( state, details ) {

// 			let orderIndex = state.orders.findIndex( order => order.orderId == details.orderId )
// 			Vue.set( state.orders, orderIndex, {

// 				...state.orders[orderIndex],
// 				filled: 1,
// 				executedAt: state.lastBar.time,
// 				orderValue: details.executedPrice * state.orders[orderIndex].quantity,
// 				executedPrice: details.executedPrice

// 			 } )

// 			state.marginAvailable = state.marginAvailable + state.orders[ orderIndex ].orderValue
			
// 		},
// 		UPDATE_MARGIN( state, amount ) {
// 			state.session = {
// 				...state.session,
// 				marginAvailable: state.session.marginAvailable + amount
// 			}
// 		},
// 		UPDATE_REALISED_PROFIT( state, amount ) {
// 			state.realisedProfit = amount
// 		},
// 		CANCEL_ORDER( state, orderId ) {

// 			let orderIndex = state.orders.findIndex( order => order.orderId == orderId )
// 			state.orders.splice( orderIndex, 1 )

// 		},
// 		ADD_NOTIFICATION( state, notification ) {
// 			state.notifications.push( notification )
// 		},
// 		REMOVE_NOTIFICATION( state, notificationId ) {
// 			let notifications = state.notifications.filter( ( notification ) => {
// 				return notification.id != notificationId
// 			} )
// 			Vue.set( state, 'notifications', notifications )
// 		}
// 	},

// 	actions: {

// 		showNotification( { commit }, details ) {

// 			let notification = {
// 				id: uuidv4(),
// 				message: details.message,
// 				context: details.context
// 			}

// 			commit('ADD_NOTIFICATION', notification)

// 			setTimeout( () => {
// 				commit('REMOVE_NOTIFICATION', notification.id)
// 			}, 3000 )

// 		},

// 		async setSession( { commit }, sessionId ) {

// 			let res = await realtimedb.ref('/sessions/' + sessionId ).once('value')
// 			let session = res.val()
			
// 			if( session ) {
// 				session['id'] = res.key
// 				commit('SET_SESSION', session)
// 			} else {
// 				throw new Error('session-does-not-exist')
// 			}
			
// 		},

// 		async addOrder( { commit, state, dispatch }, order ) {

// 			commit('ADD_ORDER', order)
// 			dispatch('showNotification', { message: 'Order Created', context: 'success' })

// 		},

// 		lastBarChanged( { dispatch, commit }, lastBar )  {
// 			commit('SET_LASTBAR', lastBar)
// 		},

// 		checkOrders( { dispatch, commit, getters, state } ) {

// 			let newBar = state.lastBar

// 			for( let order of state.orders ) {

// 				if( order.filled == 1 ) {

// 				} else  {

// 					let fillDetails = null

// 					switch( order.type ) {

// 						case 'buy-market': 

// 							fillDetails = {
// 								orderId: order.orderId,
// 								executedPrice: newBar['open'] 
// 							}

// 							break

// 						case 'buy-limit':
						
// 							if( order.limitPrice > newBar['high'] ) {

// 								fillDetails = {
// 									orderId: order.orderId,
// 									executedPrice: newBar['open'] 
// 								}

// 							}

// 							else if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {
								
// 								fillDetails = {
// 									orderId: order.orderId,
// 									executedPrice: order.limitPrice 
// 								}

// 							}

// 							break

// 						case 'buy-stop-limit':

// 							if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {
							
// 								fillDetails = {
// 									orderId: order.orderId,
// 									executedPrice: order.limitPrice
// 								}

// 							}

// 							break

// 						case 'buy-stop-market':
							
// 							if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {
															
// 								fillDetails = {
// 									orderId: order.orderId,
// 									executedPrice: newBar['high'] 
// 								}

// 							}

// 							break

// 						case 'sell-market': 

// 							fillDetails = {
// 								orderId: order.orderId,
// 								executedPrice: newBar['open']
// 							}

// 							break

// 						case 'sell-limit':
							
// 							if( order.limitPrice < newBar['low'] ) {
							
// 								fillDetails = {
// 									orderId: order.orderId, 
// 									executedPrice: newBar['open'] 
// 								}
						
// 							}
						
// 							else if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {

// 								fillDetails = {
// 									orderId: order.orderId, 
// 									executedPrice: order.limitPrice 
// 								}

// 							}

// 							break

// 						case 'sell-stop-limit':

// 							if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {
								
// 								fillDetails = {
// 									orderId: order.orderId, 
// 									executedPrice: order.limitPrice 
// 								}

// 							}

// 							break

// 						case 'sell-stop-market':
							
// 							if( order.limitPrice >= newBar['low'] && order.limitPrice <= newBar['high'] ) {
								
// 								fillDetails = {
// 									orderId: order.orderId, 
// 								 	executedPrice: newBar['low'] 
// 								}

// 							}

// 							break

// 					}

// 					if( fillDetails ) {

// 						let previousOpenQuantity = getters.openQuantity
// 						let previousRealisedProfit = getters.realisedProfit

// 						if( ( fillDetails.executedPrice * order.quantity ) <= state.session.marginAvailable ) {	

// 							commit('ORDER_FILLED', fillDetails )
							
// 							// commit('UPDATE_MARGIN', order.side == 'buy' ? -(orderValue) : ( orderValue ) )
// 							dispatch('updateMargins', { executedPrice: fillDetails.executedPrice, previousOpenQuantity, previousRealisedProfit, side: order.side })
// 							dispatch('showNotification', {
// 								message: 'Order Filled',
// 								context: 'success'
// 							} )

// 						} else {
						
// 							dispatch('showNotification', {
// 								message: 'Insufficient Balance',
// 								context: 'failure'
// 							} )

// 						}
						

// 					}

// 				}

// 			}
			
// 		},

// 		updateMargins( { commit, getters }, details ){

// 			let change = getChangeInPosition( details.previousOpenQuantity, getters.openQuantity )
			
// 			let marginChange

// 			if( change.squredOff < 0 ) {

// 				let totalProfit = getters.totalProfit

// 				// if( change.added != 0 ){
// 				// 	console.log('Debugging Info')
// 				// 	console.log('totalProfit', totalProfit )
// 				// 	console.log( change )
// 				// 	console.log( 'lastPrice', getters.lastPrice )
// 				// 	console.log( 'executedPrice', getters.executedPrice )
// 				// 	totalProfit = totalProfit - ( Math.abs(change.added) * getters.lastPrice ) + ( Math.abs(change.added) * details.executedPrice )
// 				// 	console.log( totalProfit )
// 				// 	console.log('Debugging Info Stop')
// 				// }

// 				console.log( getters.totalSellValue )
// 				console.log( getters.totalBuyValue )

// 				let realisedProfit = ( ( Math.abs( change.squredOff ) / Math.abs( details.previousOpenQuantity ) ) * ( getters.totalProfit ) )
// 				commit('UPDATE_REALISED_PROFIT', realisedProfit)
// 				console.log( 'change ', change )
// 				console.log( 'Executed Price ', details.executedPrice )
// 				console.log( 'Realised Profit ', realisedProfit )
// 				console.log( 'Previous Realised Profit ', details.previousRealisedProfit )
// 				console.log( 'Realised Profit ', details.previousRealisedProfit )

// 				marginChange = ( ( Math.abs( change.squredOff ) * details.executedPrice ) + ( 2 * ( realisedProfit - details.previousRealisedProfit ) ) ) - ( Math.abs(change.added) * details.executedPrice )

// 			} else {

// 				marginChange = ( Math.abs(change.squredOff) * details.executedPrice ) - ( Math.abs(change.added) * details.executedPrice )

// 			}

// 			if( marginChange != 0 ) {
// 				commit('UPDATE_MARGIN', marginChange)
// 			}

// 		},

// 		cancelOrder( { dispatch, commit }, orderId  ) {
// 			commit('CANCEL_ORDER', orderId)
// 			dispatch('showNotification', 'Order Canceled')
// 		}

// 	}

// }

// // function getChangeInPosition( previous, current ) {

// // 	if( Math.abs( previous - current ) > Math.abs( previous ) ) {

// //         return {
// //             squredOff: Math.abs(previous),
// //             added: Math.abs( current )
// //         }

// // 	} else if( ( Math.abs(current)  - Math.abs(previous) )  > 0 ) {

// //         return {

// //             squredOff: 0,
// //             added: Math.abs(current)  - Math.abs(previous)

// //         }

// // 	} else {
        
// //         return {
// //             squredOff: Math.abs(previous) - Math.abs(current),
// //             added: 0
// //         }    
    
// //     }

// // }

// function getChangeInPosition( previous, current ) {

// 	if( Math.abs( previous - current ) > Math.abs( previous ) ) {

//         return {
//             squredOff: previous,
//             added: current 
//         }

// 	} else if( ( Math.abs(current)  - Math.abs(previous) )  > 0 ) {

//         return {

//             squredOff: 0,
//             added: ( current - previous ) > 0 ? Math.abs(current)  - Math.abs(previous) : -1 * ( Math.abs(current)  - Math.abs(previous) )

//         }

// 	} else {
        
//         return {
//             squredOff: ( previous - current ) > 0 ? Math.abs(previous) - Math.abs(current) : -1 * ( Math.abs(previous) - Math.abs(current) ) ,
//             added: 0
//         }    
    
//     }

// }