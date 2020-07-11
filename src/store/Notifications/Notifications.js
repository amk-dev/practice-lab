/* eslint-disable */
import { v4 as uuidv4 } from 'uuid'
import Vue from 'vue'

export default {

	state: () => {

		return {

			notifications: []

		}

	},

	getters: {

		notifications: ( state ) => {
			return state.notifications
		}

	},

	mutations: {

		ADD_NOTIFICATION( state, notification ) {
			state.notifications.push( notification )
		},

		REMOVE_NOTIFICATION( state, notificationId ) {
			let notifications = state.notifications.filter( ( notification ) => {
				return notification.id != notificationId
			} )
			Vue.set( state, 'notifications', notifications )
		}

	},

	actions: {

		showNotification( { commit }, details ) {

			let notification = {
				id: uuidv4(),
				message: details.message,
				context: details.context,
			}

			commit('ADD_NOTIFICATION', notification)

			setTimeout( () => {
				commit('REMOVE_NOTIFICATION', notification.id)
			}, 2000 )

		}

	}

}