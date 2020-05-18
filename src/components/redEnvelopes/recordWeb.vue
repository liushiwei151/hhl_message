<template>
	<div class="recordWeb">
		<div class='top'><i class="back" @click="gotoWeb('/')"></i></div>
		<div class="header" v-if="!isTime24">
			<div class="header-content">
				<ul>
					<li class="black">拼手气红包</li>
					<li>{{redPackInfo.description}}</li>
				</ul>
				<div class="red fsizebig">
					{{redPackInfo.amount}}
					<span>楼币</span>
				</div>
			</div>
			<div class="header-button">
				<a href="https://wx.hhl1916.com/huanghelou1916-center/wx/gCode?name=toMall">去使用</a>
				<a :href="url">查看余额</a>
			</div>
		</div>
		<div v-if='isTime24' class='touxiang'>
			<div class='img'></div>
			<p>红包已超过24小时,无法领取哦</p>
		</div>
		<div class="content-li">
			<div class="title">
				<i class="xian xianleft"></i>
				<span class="text">看看大家手气</span>
				<i class="xian xianright"></i>
			</div>
			<ul class="content">
				<li v-for="item in redPackInfo.receivePacketRecords">
					<div class="custom">
						<i :style="{backgroundImage:'url('+item.headImgUrl+')'}"></i>
						<div>
							<span class="black">{{item.nickName}}</span>
							<span>{{item.insertTime}}</span>
						</div>
					</div>
					<div class="cash">
						<span class="black">{{item.amount}}楼币</span>
						<span class="red" v-if='item.isMax'>手气最佳</span>
					</div>
				</li>
			</ul>
		</div>
		<div class="rule">
			<div class="title">
				<i class="xian xianleft"></i>
				<span class="text">规则说明</span>
				<i class="xian xianright"></i>
			</div>
			<ul class="content">
				<li>
					<i></i>
					<span>每个楼币红包每人仅能领取一次</span>
				</li>
				<li>
					<i></i>
					发出的楼币红包,超过24小时未被领取的部分,将退回发送方的账户
				</li>
				<li>
					<i></i>
					<span>已领取的楼币红包存入到个人沙龙账户中,无法转让给他人</span>
				</li>
				<li>
					<i></i>
					<span>已领取的楼币红包可以在楼币流水中查看记录,在楼币商场中使用</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import api from '../../getapi.js'
export default {
	name: 'recordWeb',
	data(){
		return{
			//是否超时
			isTime24:false,
			//红包弹框信息
			redcordInfo:'',
			//客户信息
			userInfo:'',
			//红包信息
			redPackInfo:''
		}
	},
	inject: ['isTips'],
	created() {
		this.redcordInfo=JSON.parse(localStorage.getItem('resData'));
		this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
		this.doData(this.redcordInfo);
		this.receiveRecords();
	},
	computed:{
		url(){
			var a = 'https://wx.hhl1916.com/opc/ms/score/queryScoreLogList?openid=' + this.userInfo.user.openid;
			// var a ='https://wx.hhl1916.com/opc/ms/score/queryScoreLogList?back=gome&openid='+this.userInfo.user.openid+'&customerId='+this.userInfo.user.memberNo
			return a
		}
	},
	methods: {
		// 红包信息接口
		receiveRecords(){
			var data ={
				redPacketId:this.userInfo.redPacketId,
				memberNo:this.userInfo.user.memberNo
			}
			api.receiveRecords(data).then((res)=>{
				if(res.data.code==200){
					this.redPackInfo=res.data.data;
				}else{
					this.isTips(res.data.msg)
				}
			})
		},
		gotoWeb(e) {
			this.$router.push(e);
		},
		//执行接口传的值
		doData(e){
			console.log(e);
			if(e.code==200){
				
			}else{
				this.isTips(e.msg)
			}
		}
	}
};
</script>

<style scoped lang="less">
@center: {
	display: flex;
	align-items: center;
	justify-content: space-between;
};
.recordWeb {
	font-size: 30px;
	background-color: rgb(235, 235, 235);
	position: absolute;
	.top{
		height: 120px;
		background-color: #fff;
	}
	.touxiang{
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		p{
			color:#f95c5b;
			font-weight: 600;
		}
		.img{
			width: 126px;
			height: 191px;
			background: url(../../../static/envelopes/receive1.png) no-repeat;
			background-size: 100% 100%;
		}
	}
}
.back {
	display: block;
	background: url(../../../static/back.png) no-repeat;
	background-size: 100% 100%;
	width: 86px;
	height: 86px;
	position: absolute;
	top: 15px;
	left: 15px;
}
.fsizebig {
	font-size: 55px;
	font-weight: 700;
	span {
		font-size: 40px;
		margin-left: 10px;
	}
}
.black {
	font-weight: 700;
	color: black !important;
	font-size: 35px !important;
}
.red {
	color: #f95c5b;
}
.header {
	padding: 20px;
	background-color: #fff;
	margin-bottom: 20px;
	.header-content {
		@center();
		text-align: left;
		box-sizing: border-box;
		li {
			color: gray;
			margin-bottom: 20px;
		}
	}
	.header-button {
		@center();
		a {
			display: block;
			width: 300px;
			height: 50px;
			text-decoration: none;
			color: #fff;
			border-radius: 10px;
			padding: 10px 0;
		}
		a:first-of-type {
			background-color: #f95c5b;
		}
		a:last-of-type {
			background-color: rgb(54, 150, 224);
		}
	}
}
.content-li {
	background-color: #fff;
	margin-bottom: 20px;
	.title {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #f95c5b;
		font-weight: 700;
		.text {
			margin: 0 15px;
		}
		.xian {
			display: block;
			width: 200px;
			height: 2px;
		}
		.xianright {
			background: linear-gradient(left, #f95c5b -4%, #f95c5b 50%, #fff 100%);
		}
		.xianleft {
			background: linear-gradient(left, #fff -4%, #f95c5b 50%, #f95c5b 100%);
		}
	}
	.content {
		padding: 0 30px 30px;
		box-sizing: border-box;
		li {
			@center();
			height: 150px;
			border-bottom: solid 2px rgb(235, 235, 235);
			.cash {
				display: flex;
				flex-direction: column;
				span {
					font-weight: 700;
				}
			}
			.custom {
				@center();
				height: 100%;
				i {
					width: 80px;
					height: 80px;
					display: block;
					background-size: 100% 100%;
					background-repeat: no-repeat;
				}
				div {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					height: 100%;
					justify-content: center;
					margin-left: 15px;
					span {
						margin-bottom: 15px;
						font-size: 26px;
					}
				}
			}
		}
		li:last-of-type{
			margin-bottom: 0;
		}
	}
}
.rule {
	background-color: #fff;
	padding-top: 50px;
	.title {
		display: flex;
		justify-content: center;
		align-items: center;
		color: rgb(54, 150, 224);
		margin-bottom: 20px;
		.text {
			margin: 0 15px;
		}
		.xian {
			display: block;
			width: 200px;
			height: 2px;
		}
		.xianright {
			background: linear-gradient(left, rgb(54, 150, 224) -4%, rgb(54, 150, 224) 50%, #fff 100%);
		}
		.xianleft {
			background: linear-gradient(left, #fff -4%, rgb(54, 150, 224) 50%, rgb(54, 150, 224) 100%);
		}
	}
	.content{
		padding: 0 20px;
		color: gray;
		i{
			border-radius: 50%;
			width: 34px;
			height: 32px;
			margin-right: 15px;
			display: inline-block;
			vertical-align:middle
		}
		li:first-of-type i{
			background: url(../../../static/envelopes/one.png) no-repeat;
			background-size: 100% 100%;
		}
		li:nth-of-type(2) i{
			background: url(../../../static/envelopes/two.png) no-repeat;
			background-size: 100% 100%;
		}
		li:nth-of-type(3) i{
			background: url(../../../static/envelopes/three.png) no-repeat;
			background-size: 100% 100%;
		}
		li:last-of-type i{
			background: url(../../../static/envelopes/four.png) no-repeat;
			background-size: 100% 100%;
		}
		li{
			text-align: left;
			font-size: 25px;
			font-weight: 600;
			margin-bottom: 15px;
		}
	}
}
</style>
