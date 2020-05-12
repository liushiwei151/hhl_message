<template>
	<div class="record" ref="Width">
		<div class="recordBox">
			<div class="icon" :style="{ background: 'url(' + redPackInfo.headImgUrl + ') no-repeat', backgroundSize: '100% 100%' }"></div>
			<p>
				余额:
				<span>{{ redPackInfo.lastAmount }}楼币</span>
			</p>
			<p>小北共发出</p>
			<p>
				<span class="bigSize">{{ redPackInfo.usedAmount }}</span>
				楼币红包
			</p>
			<p>
				发出楼币红包
				<span class="bigSize">{{ redPackInfo.sentPacket }}</span>
				个
			</p>
			<div class="query" @click="showCalendar">
				<span>按月查询</span>
				<i></i>
			</div>
		</div>
		<ul class="recordList">
			<li v-for="item in redPackInfo.redPacketList" @click="gotoDetails(item.redPacketId)">
				<div class="listBody">
					<div>
						<span>红包</span>
						<div>Id:{{ item.redPacketId }}</div>
						<div class="body-time">{{ item.insertTime }}</div>
					</div>
					<span>{{ item.totalAmount }}</span>
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
import api from '../../getapi.js';
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
			calendarNums: 0,
			//客户信息
			userInfo: '',
			//红包信息
			redPackInfo: '',
			//定时器
			isShow: true
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
	inject: ['isTips'],
	created() {
		this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
		this.sendRecords();
	},
	methods: {
		//跳转详情页面
		gotoDetails(e) {
			api.sendDetail(e).then(res => {
				if (res.data.code == 200) {
					this.$router.push({
						name: 'redPackDetails',
						params: {
							data: res.data.data
						}
					});
					console.log(res.data.data);
				} else {
					this.isTips(res.data.msg);
				}
			});
		},
		//获取信息
		sendRecords(e) {
			let data = {
				openid: this.userInfo.user.openid,
				memberNo: this.userInfo.user.memberNo,
				time: e || ''
			};
			api.sendRecords(data).then(res => {
				if (res.data.code == 200) {
					this.redPackInfo = res.data.data;
				} else {
					this.isTips(res.data.msg);
				}
			});
		},
		//完成日历
		complete() {
			this.closeCalendar();
			this.calendarNum = this.calendarNums;
			if (this.allTime[this.calendarNum] == '全部') {
				this.sendRecords();
				return;
			}
			var b = this.allTime[this.calendarNum].slice(0, -1).split('年');
			var time = b[0] + '-' + b[1] + '-01 00:00:00';
			this.sendRecords(time);
		},
		//销毁并关闭日历
		closeCalendar() {
			let self = this;
			document.removeEventListener('touchmove', self.prev, { passive: false });
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
		prev(ev) {
			ev.preventDefault();
		},
		//初始化日历
		initCalendar() {
			var self = this;
			// 阻止浏览器的默认行为
			document.addEventListener('touchmove', self.prev, { passive: false });
			var wrapper = document.getElementById('wrapper');
			self.iscroll = new Iscroll('#wrapper', {
				snap: 'li'
			});
			var width = self.$refs.Width.offsetWidth * 0.095;
			if (self.calendarNum != null) {
				self.iscroll.scrollTo(0, -(self.calendarNum * width), 500);
			} else {
				self.iscroll.scrollTo(0, -(self.allTime.length - 1) * width, 100);
			}
			self.iscroll.on('scrollEnd', function() {
				self.calendarNums = Math.round(-this.y / width);
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
		border-radius: 10px;
		background-size: 100% 100%;
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
			padding: 0 10px;
			box-sizing: border-box;
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
