<template>
	
	<div class="field" v-if="message">
				
		<span class="tag is-danger is-light"> {{ message }} </span>

	</div>

</template>

<script>
	
	export default {

		name: 'ErrorMessage',
		props: ['message']

	}

</script>

