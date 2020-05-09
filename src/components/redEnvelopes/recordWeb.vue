<template>
	<div class="recordWeb">
		<div class='top'><i class="back" @click="gotoWeb('/')"></i></div>
		<div class="header" v-if="!isTime24">
			<div class="header-content">
				<ul>
					<li class="black">拼手气红包</li>
					<li>恭喜发财,大吉大利</li>
				</ul>
				<div class="red fsizebig">
					-5
					<span>楼币</span>
				</div>
			</div>
			<div class="header-button">
				<a href="#">去使用</a>
				<a href="#">查看余额</a>
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
				<li v-for="a in 5">
					<div class="custom">
						<i></i>
						<div>
							<span class="black">小北</span>
							<span>2020-05-07 10:47:40</span>
						</div>
					</div>
					<div class="cash">
						<span class="black">10楼币</span>
						<span class="red">手气最佳</span>
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
export default {
	name: 'recordWeb',
	data(){
		return{
			//是否超市
			isTime24:true
		}
	},
	methods: {
		gotoWeb(e) {
			this.$router.push(e);
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
			border-radius: 5px;
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
		padding: 0 30px;
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
					background-color: blue;
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
