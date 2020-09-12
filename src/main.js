import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import vuelidate from 'vuelidate'
import { getIdToken } from '@/services/FirebaseAuth.js'

console.log(getIdToken)

import 'normalize.css'
import 'bulma'

Vue.config.productionTip = false

Vue.use(vuelidate)

store.dispatch('auth').then(() => {
	new Vue({
		router,
		store,
		render: (h) => h(App),
	}).$mount('#app')
})
