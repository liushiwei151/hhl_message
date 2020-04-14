<template>
	<div class='actImg'>
		<div class='img' :style="{backgroundImage:'url('+actImgUrl+')'}">
		</div>
    <div class='backHome' @click="backHome"></div>
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
		},
    methods:{
      backHome(){
        this.$router.push('/')
      }
    }
	}
</script>

<style scoped>
  .backHome{
    position: fixed;
    left: 10px;
    top: 10px;
    width: 86px;
    height: 86px;
    background: url('../../static/back.png') no-repeat;
    background-size: 100% 100%;
    z-index: 100;
  }
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
