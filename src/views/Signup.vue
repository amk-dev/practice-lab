<template>
	
	<div class="columns">
		
		<div class="column is-4 is-offset-4">

			<form action="#" @submit.prevent="firebaseSignUp" novalidate="true">

				<div class="field">
					<label for="name">Email</label>
					<input type="email" class="input" v-model.trim="email">
				</div>

				<template v-if="$v.email.$error">
					<p v-if="!$v.email.email">Enter A Valid Email</p>
					<p v-if="!$v.email.required">Please Enter An Email</p>
					<p v-if="!$v.email.isUnique">The Email Is Already In Use</p>
					<p v-if="!$v.email.isValidEmail">Please Enter A Valid Email</p>
				</template>

				<div class="field">
					<label for="name">Password</label>
					<input type="text" class="input" v-model.trim="password">
				</div>

				<template v-if="$v.password.$error">
					<p v-if="!$v.password.required">Please Enter A Password</p>
					<p v-if="!$v.password.minLength">Your Password Should Be Minimum Of 6 letters</p>
				</template>

				<div class="field">
					<label for="name">Confirm Your Password</label>
					<input type="text" class="input" v-model.trim="confirmPassword">
				</div>

				<template v-if="$v.confirmPassword.$error">
					<p v-if="!$v.confirmPassword.sameAsPassword">both passwords does not match</p>
				</template>

				<div class="field">
					<input type="submit" value="Signup" class="button is-info" :disabled="isLoading">
				</div>

			</form>
		</div>

	</div>

</template>

<script>
	
	/* eslint-disable */

	import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'
	import { auth } from '@/config.js'

	import { createUserWithEmailAndPassword, updateProfile } from '@/services/FirebaseAuth.js'

	export default {
		name: 'Signup',
		data() {

			return {

				name: null,
				email: null,
				password: null,
				confirmPassword: null,
				firebaseError: null,
				isLoading: false

			}

		},

		methods: {

			async firebaseSignUp() {

				this.$v.$reset()
				this.isLoading = true
				this.$v.$touch()

				if( this.$v.$error ) {

					this.isLoading = false
					return 

				}

				try {
					
					await createUserWithEmailAndPassword( this.email, this.password )

					console.log( `user created ${ auth.currentUser }` )

				} catch( e ) {

					this.firebaseError = e.code

					console.log( this.firebaseError )

				}

				this.isLoading = false


			}

		},

		validations: {

			email: {

				required,
				email,
				isUnique( email ) {
					return !( this.firebaseError == 'auth/email-already-in-use' )
				},
				isValidEmail( email ) {
					return !( this.firebaseError == 'auth/invalid-email' )
				}

			},

			password: {

				required,
				minLength: minLength(6),
				isStrong() {
					return !( this.firebaseError == 'auth/weak-password' )
				}

			},

			confirmPassword: {
				sameAsPassword: sameAs('password')
			}

		}
	}

</script> 