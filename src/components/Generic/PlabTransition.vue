<template>
	
	<transition :name="name">
		<slot></slot>
	</transition>

</template>

<script>
	
	export default {

		name: 'PlabTransition',
		props: ['name']

	}

</script>

<style scoped>
	
	/* Slide */

	.slide-enter, .slide-leave-to {
		transform: translateX(100%);
		opacity: 0
	}

	.slide-enter-active, .slide-leave-active {
		transition: all .2s ease
	}

	.slide-enter-to, .slide-leave {
		transform: translateX(0);
		opacity: 1
	}

	/* Fade */

	.fade-enter-active, .fade-leave-active {
		transition: opacity .2s;
	}

	.fade-enter, .fade-leave-to {
		opacity: 0;
	}

</style>