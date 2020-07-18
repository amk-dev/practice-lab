<template>
	<plab-transition name="fade">
		<div class="notification-box" :class="{ 'success': context == 'success', 'failure': context == 'failure', 'info': context == 'info' }">
			<span>{{ message }}</span>
		</div>
	</plab-transition>
</template>

<script>
	
	import successAudio from './../../assets/success.ogg'
	import failureAudio from './../../assets/error.ogg'
	import infoAudio from './../../assets/info.ogg'
	import PlabTransition from '@components/Generic/PlabTransition.vue'

	export default {	
		name: 'NotificationBox',
		props: ['message', 'context'],
		components: {
			PlabTransition
		},
		data() {
			return {
				type: '',
			}
		},
		methods: {

			playAudio( source, volume ) {

				let audio = new Audio( source )
				audio.volume = volume
				audio.play()

			}

		},
		mounted() {

			console.log('Mounting Notification')

			let sources = {
				'success': successAudio,
				'failure': failureAudio,
				'info': infoAudio
			}

			this.playAudio(  sources[ this.context ], 0.3 )

		}
	}

</script>

<style scoped>
	
	.notification-box {
		display: flex;
		padding: 10px;
		border-radius: 3px;
		font-family: 'Lato';
		background: #23262b;
		color: #ccc;
		z-index: 999;
	}

	.success {
		border-left: 4px solid #009688;
	}

	.failure {
		border-left: 4px solid #ef5350;	
	}

	.info {
		border-left: 4px solid #4fc3f7;
	}

</style>