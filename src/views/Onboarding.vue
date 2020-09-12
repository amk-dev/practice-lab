<template>

	<div class="section column is-4" style="margin: auto;">

		<p> hey {{ displayName }} </p>
			
		<form action="#" @submit.prevent="updateOnboardingInfo">
		
			<div class="field">
				<label for="name">Name</label>
				<input type="text" class="input" v-model.trim="name">
			</div>

			<template v-if="$v.name.$error">
				<p v-if="!$v.name.required">Please Enter Your Name</p>
				<p v-if="!$v.name.minLength">Minimum Length Should Be 3</p>
			</template>

			<template v-if="firebaseError">
				<p>Something Went Wrong. Please Try Again</p>
			</template>

			<div class="field">
				<input type="submit" value="Save" class="button is-info" :disabled="isLoading">
			</div>

		</form>

	</div>

</template>

<script>

	import { required, minLength } from 'vuelidate/lib/validators'
	import { updateProfile } from "@/services/FirebaseAuth.js"

	import { mapGetters } from "vuex"
	
	export default {

		'name': 'Onboarding',		
		data() {
			return {

				name: null,
				isLoading: false,
				firebaseError: false
			}
		},

		computed: {

			...mapGetters(['displayName'])

		},

		methods: {

			async updateOnboardingInfo() {

				this.$v.$reset()
				this.isLoading = true
				this.$v.$touch()

				if( this.$v.$error ) {

					this.isLoading = false
					return 

				}

				try {

					await updateProfile( { name: this.name } )

				} catch( e ) {

					console.log( e ) 
					this.firebaseError = true

				}

			}

		},

		validations: {

			name: {
				required,
				minLength: minLength(3)
			}

		}

	}

</script>