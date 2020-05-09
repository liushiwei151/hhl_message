<template>
	<div class="record" ref="Width">
		<div class="recordBox">
			<div class="icon"></div>
			<p>
				余额:
				<span>523楼币</span>
			</p>
			<p>小北共发出</p>
			<p>
				<span class="bigSize">1078</span>
				楼币红包
			</p>
			<p>
				发出楼币红包
				<span class="bigSize">84</span>
				个
			</p>
			<div class="query" @click="showCalendar">
				<span>按月查询</span>
				<i></i>
			</div>
		</div>
		<ul class="recordList">
			<li v-for="a in 15">
				<div class="listTitle">
					<span>红包</span>
					<span>30</span>
				</div>
				<div class="listBody">
					<div>
						<div>Id:200</div>
						<div class="body-time">2020-04-21 21:10:49</div>
					</div>
					<div class="body-button">已完成</div>
				</div>
			</li>
		</ul>
		<div class="calendarMask" v-show="isCalendarShow">
			<div class="calendar">
				<div class="title">
					<span @click="closeCalendar">取消</span>
					<span @click="complete">完成</span>
				</div>
				<div class="body">
					<div id="wrapper" class="body-month">
						<ul>
							<li></li>
							<li></li>
							<li v-for="item in allTime">{{ item }}</li>
							<li></li>
							<li></li>
						</ul>
					</div>
					<div class="xian"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Iscroll from 'iscroll';
export default {
	name: 'record',
	data() {
		return {
			isCalendarShow: false,
			//日历的对象
			iscroll: '',
			//日历获取的值的下标
			calendarNum: null,
			//存储的下标
			calendarNums: 0
		};
	},
	computed: {
		allTime() {
			var a = new Date();
			var b = [];
			for (let i = 1; i < 5; i++) {
				var year = a.getFullYear() - i;
				for (let p = 0; p < 12; p++) {
					var c;
					if (p < 3) {
						c = year + '年' + (12 - p) + '月';
					} else {
						c = year + '年' + '0' + (12 - p) + '月';
					}
					b.unshift(c);
				}
			}
			for (let i = 0; i < a.getMonth() + 1; i++) {
				var c;
				if (i < 9) {
					c = a.getFullYear() + '年' + '0' + (i + 1) + '月';
				} else {
					c = a.getFullYear() + '年' + (i + 1) + '月';
				}
				b.push(c);
			}
			b.push('全部');
			return b;
		}
	},
	methods: {
		//完成日历
		complete() {
			this.isCalendarShow = false;
			this.calendarNum = this.calendarNums;
			console.log(this.allTime[this.calendarNum]);
		},
		//销毁并关闭日历
		closeCalendar() {
			this.isCalendarShow = false;
			this.iscroll.destroy();
		},
		// 显示日历
		showCalendar() {
			var self = this;
			this.isCalendarShow = true;
			setTimeout(() => {
				self.initCalendar();
			}, 0);
		},
		//初始化日历
		initCalendar() {
			var self = this;
			// 阻止浏览器的默认行为
			document.addEventListener(
				'touchmove',
				function(ev) {
					ev.preventDefault();
				},
				{ passive: false }
			);
			var wrapper = document.getElementById('wrapper');
			self.iscroll = new Iscroll('#wrapper', {
				snap: 'li'
			});
			var width = self.$refs.Width.offsetWidth * 0.095;
			console.log(width);
			if (self.calendarNum != null) {
				self.iscroll.scrollTo(0, -(self.calendarNum * width), 500);
			} else {
				self.iscroll.scrollTo(0, -(self.allTime.length - 2) * width, 100);
			}
			self.iscroll.on('scrollEnd', function() {
				self.calendarNums = Math.ceil(-this.y / 30);
			});
		}
	}
};
</script>

<style scoped lang="less">
//日历样式
.calendarMask {
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 98;
	position: fixed;
	width: 100%;
	height: 100%;
	font-size: 25px;
	.calendar {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #fff;
			padding: 20px 40px;
			color: #418fe0;
		}
		.body {
			background-color: #d2d6db;
			height: 350px;
			display: flex;
			justify-content: center;
			overflow: hidden;
			position: relative;
			.xian {
				height: 70px;
				width: 100%;
				position: absolute;
				border-top: solid 1px black;
				border-bottom: solid 1px black;
				box-sizing: border-box;
				position: absolute;
				pointer-events: none;
				top: 140px;
			}
			.body-month {
				// height: 350px;
				width: 100%;
			}
			ul {
				li {
					height: 9.5vw;
					line-height: 9.5vw;
				}
			}
		}
	}
}
.record {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 11px;
	box-sizing: border-box;
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: #ebebeb;
}
.recordBox {
	width: 728px;
	height: 400px;
	background: url(../../../static/envelopes/record.png) no-repeat;
	background-size: 100% 100%;
	margin-bottom: 1vh;
	padding: 30px;
	box-sizing: border-box;
	font-size: 25px;
	position: relative;
	.query {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 30px;
		top: 30px;
		i {
			width: 0;
			height: 0;
			border-right: 15px solid transparent;
			border-left: 15px solid transparent;
			border-top: 15px solid #fff;
		}
	}
	span {
		color: #fff;
	}
	.icon {
		width: 120px;
		height: 120px;
		background-color: #fff;
		border-radius: 10px;
	}
	p {
		margin: 0;
		text-align: left;
		margin-top: 15px;
		color: #ebd986;
		.bigSize {
			font-size: 40px;
		}
	}
}
.recordList::-webkit-scrollbar {
	display: none;
}
.recordList {
	width: 100%;
	padding: 0 11px;
	box-sizing: border-box;
	flex: 1;
	overflow: hidden;
	overflow-y: auto;
	font-size: 30px;
	li {
		background-color: #fff;
		padding: 10px;
		border-radius: 5px;
		margin-top: 20px;
		.listTitle {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.listBody {
			display: flex;
			justify-content: space-between;
			align-items: center;
			text-align: left;
			.body-time {
				font-size: 25px;
				color: #afafaf;
			}
			.body-button {
				border-radius: 30px;
				background-color: #9a9a9a;
				color: #fff;
				font-size: 25px;
				padding: 5px 10px;
			}
		}
	}
}
</style>
