<template>
	
	<div class="notifications-wrapper">
		
		<notification-box class="notification-wrapper" v-for=" notification in notifications " :message="notification.message" :context="notification.context" :key="notification.id">
		</notification-box>
		
	</div>

</template>

<script>
	
	/* eslint-disable */
	import NotificationBox from './NotificationBox.vue'
	import { mapGetters } from 'vuex'

	export default {
		name: 'Notifications',
		data() {
			return {
			}
		},
		components: {
			NotificationBox
		},
		computed: {
			...mapGetters(['notifications'])
		}
		
	}

</script>

<style>

	.notifications-wrapper {
		position: absolute;
		bottom: 100px;
		right: 100px;
	}

	.notification-wrapper {
		margin: 2px 0;
	}


</style>