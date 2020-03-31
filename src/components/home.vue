<template>
	<!-- <div class='box'> -->
		<div class='home'>
			<div class='address'>
				<div class='img'><img src="../../static/address.png" ></div>
				<div>当前城市：{{address}}</div>
			</div>
			<div class='home-body'>
				<div v-for='(item,index) in button' :key='index' class='img' @click="click(index)">
					<img :src="item" alt="">
				</div>
			</div>
			<div class='message'>
				<div class='img' @click="gotoWeb('chat')">
					<img src="../../static/liuyan.png" >
				</div>
			</div>
		</div>
	<!-- </div> -->
</template>

<script>
	export default{
		name: "home",
		data(){
			return{
				address:'武汉',
				button:['../../static/button1.png','../../static/button2.png','../../static/button3.png','../../static/button4.png']
			}
		},
		inject:['isAlertShow'],
		created() {
			console.log(this.$route.query)
		},
		methods:{
			click(e){
				if(e==1){
					this.isAlertShow(true)
				}
			},
			//跳往别的页面
			gotoWeb(e){
				this.$router.push(e)
			}
		}
	}
</script>

<style scoped lang="less">
	.box{
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgb(246,240,229);
	}
	.home{
		background: url(../../static/bg.png) no-repeat;
		background-size: 100% 100%;
		position: fixed;
		/*width: 750px;
		height: 1334px;*/
		width: 100%;
		height: 100%;
		padding-top: 22.6vh;
		box-sizing: border-box;
	}
	.address{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding-left: 16.2vw;
		box-sizing: border-box;
		color: rgb(166,141,87);
		font-size: 20px;
		.img{
			margin-right: 1%;
			width: 2.5vw;
			height: 3.5vw;
		}
	}
	.home-body{
		padding:0 8.2vw 0 16.2vw;
		box-sizing: border-box;
		height: 57.2vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 2.77vh 0;
		.img{
			height: 12.9vh;
		}
	}
	.message{
		display: flex;
		justify-content: center;
		align-items: center;
		.img{
			width: 34.8vw;
			height: 5.77vh;
		}
	}
</style>
