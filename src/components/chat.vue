<template>
	<div class='chat'>
		<div class='header'>
			<div class='img' @click="gotoWeb('/')"><img :src="img[0]" alt=""></div>
			<div>楼楼</div>
			<div class='img'><img :src="img[1]" alt=""></div>
		</div>
		<div class='body'>
			<div class='chat-box' v-for="(item,index) in charData" :key='index'>
				<div v-if="item.isTime">
					<div class='time'>{{item.time}}</div>
				</div>
				<div v-if="item.type==1" class='left'>
					<div class='img'>
						<img :src="item.img" alt="">
					</div>
					<div class='card'>
						<div class='arrow-left'></div>
						{{item.content}}
					</div>
				</div>
				<div v-if="item.type==2" class='right'>
					<div class='card'>
						<div class='arrow-right'></div>
						{{item.content}}
					</div>
					<div class='img'>
						<img :src="item.img" alt="">
					</div>
				</div>
			</div>
		</div>
		<div class='footer'>
			<div class='footer-input'><input type="text"  v-model="text"></div>
			<div class='sendOut' @click="sendOut">发送</div>
		</div>
	</div>
</template>

<script>
	import api from '@/getapi.js'
	export default{
		name:'chat',
		data(){
			return{
				img:['./static/right.png','./static/ellipsis.png'],
				text:'',
				charData:[
					{img:'./static/tou.png',type:1,isTime:true,time:'昨天 16：25',content:'您好,欢迎留言。'},
				],
				screenHeight:'',
				//客户留言和id
				userChat:''
			}
		},
		created() {
			this.getChat()
		},
		mounted() {
			this.scroll()
		},
		watch:{
			screenHeight(){
				this.scrollBottom()
			}
		},
		methods:{
			//获取消息
			getChat(){
				api.getChat(JSON.parse(localStorage.getItem('userInfo')).user.openid).then((res)=>{
					if(res.data.code==200){
						this.userChat=res.data.data
						this.charData=res.data.data.messages;
						this.scrollBottom();
					}
				})
			},
			gotoWeb(e){
				this.$router.push(e)
			},
			//发送
			sendOut(){
				if(this.text==''){
					return
				}
				
				let data={
					userId:this.userChat.userId,
					content:this.text
				}
				
				api.send(data).then(res=>{
					if(res.data.code==200){
						this.getChat();
						this.text="";
						
					}
				})
			},
			//监听消息box高度变化
			scroll(){
				 var container = this.$el.querySelector(".body");
				 this.screenHeight = container.clientHeight;
				 	 window.onresize=()=>{
				 	return (() => {
				 			 this.screenHeight = container.clientHeight;
				 			 })();
				 	}
			},
			//滚动滚至最下
			scrollBottom(){
				this.$nextTick(()=>{
						var container = this.$el.querySelector(".body");
						container.scrollTop = container.scrollHeight;
						// container.scrollTop = 0;			 
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.card{
		 position: relative;
		 background: #ffffff;
		 border-radius: 5px;//外部矩形给圆角
		 display: flex;//布局选用flex布局
		 align-items: center;//内部元素垂直居中
		padding: 27px 36px;
		box-sizing: border-box;
		font-size: 28px;
		.arrow-right{
			position: absolute;//相对定位
			background:  rgb(158,234,106);
			width: 10px;
			height: 10px;
			right: -6px;
			font-size: 0;
			// border-bottom: #ccc solid 1px;
			// border-left: #ccc solid 1px;
			box-sizing: border-box;
			transform:rotate(225deg);
			-ms-transform:rotate(225degdeg);    /* IE 9 */
			-moz-transform:rotate(225degdeg);   /* Firefox */
			-webkit-transform:rotate(225degdeg); /* Safari 和 Chrome */
			-o-transform:rotate(225degdeg);     /* Opera */  
		}
		.arrow-left{
			 position: absolute;//相对定位
			 background: #fff;
			 width: 10px;
			 height: 10px;
			 left: -6px;
			 font-size: 0;
			 // border-bottom: #ccc solid 1px;
			 // border-left: #ccc solid 1px;
			 box-sizing: border-box;
			 transform:rotate(45deg);
			 -ms-transform:rotate(45deg);    /* IE 9 */
			 -moz-transform:rotate(45deg);   /* Firefox */
			 -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
			 -o-transform:rotate(45deg);     /* Opera */
		}
	}
	@center:{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.chat{
		position: fixed;
		width: 100%;
		height: 100%;
	}
	.header{
		z-index: 100;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 88px;
		padding: 0 30px;
		box-sizing: border-box;
		background-color: rgb(246,240,229);
		font-size: 36px;
		position: absolute;
		top: 0;
		width: 100%;
		.img:first-of-type{
			width: 15px;
		}
		.img:last-of-type{
			width: 33px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.body{
		height: 100%;
		padding-top:88px;
		padding-bottom:96px;
		box-sizing: border-box;
		background-color: rgb(246,240,229);
		overflow: scroll;
		.chat-box{
			margin-bottom:20px ;
			text-align: left;
			.left{
				display: flex;
				justify-content: left;
				align-items: center;
				padding-right: 20px;
				box-sizing: border-box;
				.card{
					max-width: 600px;
				}
			}
			.right{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding-left: 20px;
				box-sizing: border-box;
				.card{
					background-color: rgb(158,234,106);
					max-width: 600px;
				}
			}
		}
		.time{
			color: rgb(153,153,153);
			font-size: 24px;
			height: 100px;
			@center()
		}
		.img{
			width: 80px;
			height: 80px;
			margin: 0 30px;
		}
	}
	.footer{
		z-index: 100;
		height: 96px;
		width: 100%;
		background-color: rgb(248,211,164);
		position: absolute;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.footer-input{
			width: 490px;
			height: 73px;
			input{
				width: 100%;
				height: 100%;
				border: none;
			}
		}
		.sendOut{
			border: solid 4px black;
			border-radius: 10px;
			padding: 12px 42px;
		}
	}
</style>
