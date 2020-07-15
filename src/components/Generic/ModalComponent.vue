<template>
		
	<div class="modal is-active" v-if="active">
		<div class="modal-background"></div>
		<div class="modal-content">			

			<slot></slot>
				
		</div>
	</div>

</template>

<script>
	
	export default {

		model: {
			prop: 'active',
			event: 'close'
		},
		props: ['active'],
		name: 'ModalComponent',

	}

</script>

<style scoped>

	.modal-background {

		background-color: rgba(10, 10, 10, .4);

	}

	.head {

		display: flex;
		justify-content: space-between;

	}

	h4.title {

		font-family: 'Lato'

	}

	.head span.icon {

		border-radius: 20px;
		transition: transform ease .1s

	}

	.head span.icon:hover {

		transform: scale(1.1);
		cursor: pointer;

	}
	
</style>