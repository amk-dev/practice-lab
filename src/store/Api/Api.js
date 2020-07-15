/* eslint-disable */

export default {

	state: {
		apiBaseUrl: 'http://localhost:8080',
	},

	getters: {
		apiBaseUrl( state ) {
			return state.apiBaseUrl
		}
	}

}