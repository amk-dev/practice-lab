<template>
	<nav class="level dashboard-navbar">
		<div class="level-left">
			<div class="level-item">
				<h4 class="title is-5 tg-brand">
					practicelab
				</h4>
			</div>
		</div>
		<div class="level-right">
			<a href="#" class="dashboard-navbar-icon-link level-item">
				<span class="icon">
					<i class="fa fa-bell"></i>
				</span>
			</a>
			<a href="#" class="dashboard-navbar-icon-link level-item">
				<span class="icon">
					<i class="fa fa-cog"></i>
				</span>
			</a>
		</div>		
	</nav>
</template>
<script>
	export default {
		name: 'DashboardNavbar'
	}
</script>
<style scoped>
	
	.dashboard-navbar {
		background: #fff;
		padding: 10px 2rem;
	}

	.tg-brand {
		color: #000;
	}

	.dashboard-navbar-icon-link {
		color: #000
	}

</style>