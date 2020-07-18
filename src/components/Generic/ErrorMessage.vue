<template>
	
	<plab-transition name="fade">
		<div class="field" v-if="message">
					
			<span class="tag is-danger is-light"> {{ message }} </span>

		</div>
	</plab-transition>

</template>

<script>
	
	import PlabTransition from '@components/Generic/PlabTransition.vue'

	export default {

		name: 'ErrorMessage',
		props: ['message'],
		components: {
			PlabTransition
		}

	}

</script>