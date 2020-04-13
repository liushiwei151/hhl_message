<template>
	<div class='actImg'>
		<div class='img' :style="{backgroundImage:'url('+actImgUrl+')'}">
		</div>
	</div>
</template>

<script>
	export default {
		name: 'actImg',
		data() {
			return {
				actImgUrl: ''
			}
		},
		created() {
			this.actImgUrl = this.$route.query.imgUrl
		}
	}
</script>

<style scoped>
	.actImg {
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.2);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 60px;
		box-sizing: border-box;
	}

	.img {
		z-index: 100;
		box-sizing: border-box;
		background-size: contain;
		background-position: center;
		max-width: 750px;
		max-height: 95vh;
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
	}
</style>
