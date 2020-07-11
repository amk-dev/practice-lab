<template>
	
	<div class="box floating-box" ref="floatingBoxContainer">
		<div class="level">
			<div class="level-left">
				<div class="icon level-item item-move">
					<i class="fa fa-grip-horizontal" ref="move-icon-speed-box"></i>
				</div>
			</div>
			<div class="level-center" v-if="title">
				<div class="level-item">
					<h3 class="title is-6">{{ title }}</h3>
				</div>
			</div>
			<div class="level-right">
				<a class="delete" @click="$emit('close')"></a>
			</div>
		</div>
		<slot></slot>
		
	</div>

</template>

<script>
	export default {
		name: 'FloatingBox',
		props: ['title', 'zIndex'],
		data: function() {
			return {
				currentX: null,
			    currentY: null,
			    initialX: null,
			    initialY: null,
			    xOffset: 0,
			    yOffset: 0,
			}
		},

		mounted() {

			console.log('Your Z-Index Is ', this.zIndex)

		}
	}
</script>

<style scoped>
	.floating-box {
		position: absolute;
		top: 10%;
		left: 5%;
		max-height: 70%;
		overflow-y: auto;
	}
	.item-move {
		cursor: move;
	}
	.level-center .title {

		margin: 0 20px;

	}
</style>