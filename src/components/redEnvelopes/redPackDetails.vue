<template>
	<div class="redPackDetails">
		<p>
			{{ detail.totalPacket }}个红包共{{ detail.totalAmount }}楼币，已领取
			<span>{{ detail.receivedPacket }}/{{ detail.totalPacket }}</span>
		</p>
		<ul class='content'>
			<li v-for="item in detail.receivePacketRecords">
				<div class="custom">
					<i :style="{ background: 'url(' + item.headImgUrl + ') no-repeat', backgroundSize: '100% 100%' }"></i>
					<div>
						<span class="black">{{ item.nickName }}</span>
						<span>{{ item.insertTime }}</span>
					</div>
				</div>
				<div class="cash">
					<span class="black">{{ item.amount }}楼币</span>
					<span class="red" v-if="item.isMax">手气最佳</span>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'redPackDetails',
	data() {
		return {
			detail: ''
		};
	},
	created() {
		this.detail = this.$route.params.data;
	}
};
</script>

<style scoped lang="less">
@center: {
	display: flex;
	align-items: center;
	justify-content: space-between;
};
.redPackDetails > p {
	text-align: left;
	padding: 0 20px;
	box-sizing: border-box;
	font-size: 40px;
	span {
		color: red;
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
			padding-right: 10px;
			span {
				font-weight: 700;
			}
		}
		.custom {
			@center();
			height: 100%;
			padding-left: 10px;
			i {
				width: 80px;
				height: 80px;
				display: block;
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
</style>
