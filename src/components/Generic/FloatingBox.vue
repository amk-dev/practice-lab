<template>
	
	<div class="box floating-box" :class=" { 'is-on-top': currentlyActiveBox == boxId } " ref="floatingBoxContainer" v-if="isVisible" @click="$emit('update:currently-active-box', boxId)">
		
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
				<a class="delete" @click="$emit('close', false)"></a>
			</div>
		</div>

		<slot></slot>
		
	</div>

</template>

<script>
	export default {
		name: 'FloatingBox',
		model: {
			prop: 'is-visible',
			event: 'close'
		},
		props: ['is-visible', 'title', 'currently-active-box', 'box-id'],
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
	.is-on-top {
		z-index: 1
	}
	.item-move {
		cursor: move;
	}
	.level-center .title {
		margin: 0 20px;
	}
</style>