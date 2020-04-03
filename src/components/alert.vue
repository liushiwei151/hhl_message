<template>
	<div class='elastic' @click="close">
		<div class='img' >
			<img :src="imgUrl" alt="">
		</div>
	</div>
</template>

<script>
	export default{
		name:'elastic',
		inject:['isAlertShow'],
		props:{
			imgUrl:{
				default:""
			}
		},
		methods:{
			close(){
				this.isAlertShow(false)
			}
		}
	}
</script>

<style scoped lang="less">
	.elastic{
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.2);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 60px;
		box-sizing: border-box;
		.img{
			z-index: 100;
			box-sizing: border-box;
		}
	}
</style>
