import { auth } from '@/config.js'

export default {
	state: {
		user: null,
	},

	getters: {
		isAuthenticated(state) {
			return !!state.user
		},

		displayName(state) {
			return state.user.displayName
		},
	},

	mutations: {
		SET_USER(state, user) {
			state.user = user
		},
	},

	actions: {
		auth({ commit }) {
			return new Promise((resolve) => {
				auth.onAuthStateChanged(function(user) {
					console.log('auth state changed')

					commit('SET_USER', user)
					resolve()
				})
			})
		},
	},
}
