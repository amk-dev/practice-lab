<template>
		
	<div class="new-session-card">
		<div class="plus">
			<span class="icon is-large">
				<i class="fa fa-2x fa-plus"></i>
			</span>
		</div>
		<h1 class="title is-6 new-session-card-title">New Session</h1>
	</div>

</template>
<script>

	/* eslint-disable */

	export default {
		name: 'NewSessionCard'
	}

</script>

<style scoped>
	
	.new-session-card {
		width: 140px;
		height: 140px;
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.16);
		display: flex;
		flex-direction: column;
		transition: all 0.15s cubic-bezier(0.2, 0.3, 0.25, 0.9);
		font-family: 'Lato'
	}

	.new-session-card:hover {
		background: #fdfdfd;
		cursor: pointer;
	}

	.plus {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.new-session-card-title {
		font-family: 'Lato';
		text-align: center;
		padding: 10px;
	}

</style>