<template>
	
	<div class="columns">
		
		<div class="column is-4 is-offset-4">

			<form action="#" @submit.prevent="firebaseSignInEmail" novalidate="true">

				<div class="field">
					<label for="name">Email</label>
					<input type="email" class="input" v-model.trim="email">
				</div>

				<template v-if="$v.email.$error">

					<p v-if="!$v.email.email">Enter A Valid Email</p>
					<p v-if="!$v.email.required">Please Enter An Email</p>
					<p v-if="!$v.email.isValidEmail">Your Email Is Invalid</p>
					<p v-if="!$v.email.doesUserExists">This Email Does Not Exist On Our Systems</p>

				</template>

				<div class="field">
					<label for="name">Password</label>
					<input type="password" class="input" v-model.trim="password">
				</div>

				<template v-if="$v.password.$error">
					<p v-if="!$v.password.required">Please Enter A Password</p>
					<p v-if="!$v.password.minLength">Your Password Should Be Minimum Of 6 letters</p>
					<p v-if="!$v.password.isWrongPassword">Incorrect Password</p>
				</template>

				<div class="field">
					<input type="submit" value="Login" class="button is-info" :disabled="isLoading">
				</div>

				<template v-if="generalErrorMessage">
					
					<p>{{ generalErrorMessage }}</p>

				</template>


			</form>

			<div class="buttons" style="padding: 20px 0">
				<button class="button is-link" @click="firebaseSignInGoogle">Sign In With Google</button>
			</div>
			

		</div>

	</div>

</template>

<script>
	
	/* eslint-disable */

	import { signInWithEmailAndPassword, signInWithGoogle } from '@/services/FirebaseAuth.js'
	import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'

	export default {
		name: 'Login',
		data() {

			return {

				email: null,
				password: null,
				firebaseError: null,
				isLoading: false,
				generalError: null

			}

		},

		computed: {

			generalErrorMessage() {

				let errorMessages = {

					'auth/popup-blocked': 'The signin popup is blocked. please check your browser settings',
					'auth/network-request-failed': 'Oops. Network Request Failed. please check your internet connection'

				}

				return errorMessages[this.generalError]

			}

		},

		methods: {

			resetErrors() {

				this.$v.$reset()
				this.firebaseError = null
				this.generalError = null

			},

			async firebaseSignInEmail() {

				this.resetErrors()
				this.isLoading = true
				this.$v.$touch()

				if( this.$v.$error ) {

					this.isLoading = false
					return 

				}

				try {

					await signInWithEmailAndPassword( this.email, this.password )
 
				} catch( e ) {

					this.firebaseError = e.code

				} finally {

					this.isLoading = false

				}

			},

			async firebaseSignInGoogle() {

				this.isLoading = true

				try {

					await signInWithGoogle()

				} catch( e ) {

					this.generalError = e.code

				} finally {

					this.isLoading = false

				}

			}

		},

		validations: {

			email: {

				required,
				email,
				isValidEmail( email ) {
					return !( this.firebaseError == 'auth/invalid-email' )
				},
				doesUserExists( email ) {
					return !( this.firebaseError == 'auth/user-not-found' )
				}

			},

			password: {

				required,
				minLength: minLength(6),
				isWrongPassword( password ) {
					return !( this.firebaseError == 'auth/wrong-password' )
				}

			}
		}
	}

</script> 