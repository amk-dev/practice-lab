<template>
	
	<transition name="fade">
		<div class="field" v-if="message">
					
			<span class="tag is-danger is-light"> {{ message }} </span>

		</div>
	</transition>

</template>

<script>
	
	export default {

		name: 'ErrorMessage',
		props: ['message']

	}

</script>

<style scoped>
	
	/* THIS ANIMATION IS A DUPLICATE, USED AT SESSION CHART FOR FLOATINGBOXS  */

	.fade-enter-active, .fade-leave-active {
		transition: opacity ease .3s;
	}

	.fade-enter, .fade-leave-to {
		opacity: 0;
	}

</style>