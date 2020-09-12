<template>

	<div class="content session-card">

		<div class="top">
			
			<div class="level">

				<div class="level-left">

					<div>
						<h1 class="is-6 title">Mastering VWAP</h1>
						<span class="tag tag-completed">Completed</span>
					</div>
		
				</div>

				<div class="level-right price-wrapper">
						
					<h1 class="is-4 title">+210 INR</h1>

				</div>

			</div>

		</div>

		<div class="bottom">
			
			<div class="level">
				
				<div class="level-left">
					
					<div>
						<h1 class="is-6 title">ICICIBANK</h1>
						<h1 class="is-6 title">1 Minute</h1>
					</div>

				</div>

			</div>

		</div>

	</div>

</template>

<script>

	export default {

		name: 'SessionCard',
		props: ['session']

	}
	
</script>

<style scoped>
	
	/* Duplicated Style */
	.session-card {
		background: #fff;
		border-radius: 10px;
		/*box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.16);*/
		box-shadow: 0 4px 6px hsla(0, 0%, 0%, .1);
		display: flex;
		flex-direction: column;
		transition: all 0.15s cubic-bezier(0.2, 0.3, 0.25, 0.9);
		font-family: 'Lato';
	}

	.top {
		padding: 25px 30px;
	}

	.bottom {
		padding: 10px 30px;
	}

	.top h1 {
		margin: 0;
		margin-bottom: 8px;
	}

	.bottom h1 {
		margin: 0;
		margin-top: 8px !important;
	}

	.tag-completed {

		background: #DBF3E1;
		color: #2E7940;
		font-weight: 700
	}

	.price-wrapper {
		align-self: baseline;
	}

	.bottom {

		background: #f6f6f6;

	}

</style>