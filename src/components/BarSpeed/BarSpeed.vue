<template>
	
	<div class="field">
		
		<label for="" class="label">bar speed (in seconds)</label>
		<div class="control">
			<input type="number" class="input" min="0" placeholder="enter bar speed in seconds" :value="speed" @input="$emit('speedUpdated', $event.target.value )">
		</div>

	</div>

</template>

<script>
	
	export default {

		name: 'BarSpeed',
		model: {
			prop: 'speed',
			event: 'speedUpdated'
		},
		props: ['speed']


	}

</script>