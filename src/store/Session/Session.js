/* eslint-disable */
import { realtimedb } from './../../config.js'
import { v4 as uuidv4 } from 'uuid'
import Vue from 'vue'

export default {

	state: () => {
	
		return {

			id: null,
			name: null,
			symbol: null,
			timeframe: null,
			startDate: null,
			endDate: null,
			initialBalance: null

		}

	},

	getters: {

		getSession: ( state ) => {

			if( state.id )
				return {
					id: state.id,
					name: state.name,
					symbol: state.symbol,
					timeframe: state.timeframe,
					startDate: state.startDate,
					endDate: state.endDate,
					initialBalance: state.initialBalance
				}
			else
				return null
		},

		sessionName: ( state ) => {

			return state.name

		},

		symbol: ( state ) => {

			return state.symbol

		},

		timeframe: ( state ) => {

			return state.timeframe

		},

		startDate: ( state ) => {

			return state.startDate

		},

		endDate: ( state ) => {

			return state.endDate

		}
	
	},

	mutations: {

		SET_SESSION( state, session ) {
			
			state.id = session.id
			state.name = session.name
			state.symbol = session.symbol
			state.timeframe = session.timeframe
			state.startDate = session.startDate
			state.endDate = session.endDate
			state.initialBalance = session.marginAvailable

		}

	},

	actions: {

		async setSession( { commit }, sessionId ) {

			let res = await realtimedb.ref('/sessions/' + sessionId ).once('value')
			let session = res.val()
			
			if( session ) {

				console.log( session )

				session['id'] = res.key
				commit('SET_SESSION', session)
				commit('SET_MARGIN_AVAILABLE', session.marginAvailable)
			} else {
				throw new Error('session-does-not-exist')
			}
			
		}
	}

}

// function getChangeInPosition( previous, current ) {

// 	if( Math.abs( previous - current ) > Math.abs( previous ) ) {

//         return {
//             squredOff: Math.abs(previous),
//             added: Math.abs( current )
//         }

// 	} else if( ( Math.abs(current)  - Math.abs(previous) )  > 0 ) {

//         return {

//             squredOff: 0,
//             added: Math.abs(current)  - Math.abs(previous)

//         }

// 	} else {
        
//         return {
//             squredOff: Math.abs(previous) - Math.abs(current),
//             added: 0
//         }    
    
//     }

// }