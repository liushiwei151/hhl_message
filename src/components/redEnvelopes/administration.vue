<template>
	<div class="all">
		<div v-if="isPassage == 1" class="hand">
			<div class="hand-title">拼手气</div>
			<div class="hand-body">
				<div class="body-cash">
					<label for="cash">楼币红包总金额</label>
					<input type="number" id="cash" maxlength="50" v-model="redPackage.cash" />
					<label for="cash">楼币</label>
				</div>
				<div class="body-cash">
					<label for="redNum">楼币红包个数</label>
					<input type="number" id="redNum" maxlength="100" v-model="redPackage.num" />
					<label for="redNum">个</label>
				</div>
				<div class="body-cash">
					<textarea cols="30" rows="10" maxlength="100" placeholder="恭喜发财,大吉大利" v-model="redPackage.text" />
				</div>
			</div>
			<div class="hand-footer">
				<button @click="cancel">取消</button>
				<button @click="record">红包纪录</button>
				<button @click="confirm">确认</button>
			</div>
		</div>
		<div v-if="isPassage == -1" class="setPassage" :style="{height:guding+'px',paddingTop:guding*0.25+'px'}">
			<div class="login1" :style="{height:guding*0.117+'px'}"></div>
			<div class="passage">
				<p>{{ passText }}</p>
				<div class="box" :style="{height:guding*0.04+'px'}">
					<input maxlength="4" type="password" v-model="passageNum" />
					<ul>
						<li>{{ passageArray[0] }}</li>
						<li>{{ passageArray[1] }}</li>
						<li>{{ passageArray[2] }}</li>
						<li>{{ passageArray[3] }}</li>
					</ul>
				</div>
			</div>
			<div class="login2" :style="{height:guding*0.0592+'px',marginTop:guding*0.28+'px'}"></div>
		</div>
		<div class="passageAlert z99" v-show="isPassageAlert">
			<div class="tips">
				<div>
					<p>{{ warning.text1 }}</p>
					<p v-if="warning.show2">{{ warning.text2 }}</p>
				</div>
				<div>
					<span @click="buttonAlert(warning.button)">{{ warning.button }}</span>
					<span @click="buttonAlert(warning.button2)" v-show="warning.show">{{ warning.button2 }}</span>
				</div>
			</div>
		</div>
		<!-- 请输入支付密码 -->
		<div class="passageAlert z90" v-show="isPassageAlert2">
			<ul class="payment">
				<li class="firstLi">
					<i @click="closeAlert(2)"></i>
					请输入支付密码
				</li>
				<li class="twoLi">
					<div class="cash"></div>
					<div class="text">
						<div>红包总金额：</div>
						<span>{{ redPackage.cash }}楼币</span>
					</div>
				</li>
				<li class="lastLi">
					<div class="box">
						<input maxlength="4" type="password" v-model="paymentPassage" />
						<ul>
							<li>{{ paymentPassageArray[0] }}</li>
							<li>{{ paymentPassageArray[1] }}</li>
							<li>{{ paymentPassageArray[2] }}</li>
							<li>{{ paymentPassageArray[3] }}</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import api from '../../getapi.js'
export default {
	name: 'administration',
	data() {
		return {
			//是否设置了支付密码1设置-1未设置0默认
			isPassage: 0,
			//支付密码
			passageNum: null,
			passText: '请设置支付密码',
			setPassageNum: '',
			//显示弹窗
			isPassageAlert: false,
			//输入支付密码的弹窗
			isPassageAlert2: false,
			//红包内容
			redPackage: {
				cash: '',
				num: '',
				text: ''
			},
			//弹窗提示
			warning: {
				text1: '两次输入的支付密码不一致',
				text2: '',
				button: '重新设置',
				show: false,
				button2: '',
				show2: false
			},
			//弹窗按钮文本
			paymentPassage: null,
			//客户信息
			userInfo:'',
			//手机高度
			guding:0
		};
	},
	inject: ['isTips'],
	watch: {
		passageNum: {
			handler(newVal, oldVal) {
				if (this.passageNum != null && this.passageNum.length == 4) {
					if (this.setPassageNum == '') {
						this.passText = '请再输入一次密码';
						this.setPassageNum = this.passageNum;
						this.passageNum = null;
					} else {
						if (this.setPassageNum === this.passageNum) {
							this.sendPassage(this.passageNum);
						} else {
							this.isPassageAlert = true;
						}
					}
				}
			}
		},
		paymentPassage() {
			if (this.paymentPassage != null && this.paymentPassage.length == 4) {
				this.creatRed(this.paymentPassage)
			}
		}
	},
	computed: {
		passageArray() {
			var a = ['', '', '', ''];
			if (this.passageNum != null && this.passageNum != '' && this.passageNum != undefined) {
				let b = this.passageNum.split('');
				for (let i = 0; i < b.length; i++) {
					a[i] = '*';
				}
			}
			return a;
		},
		paymentPassageArray() {
			var a = ['', '', '', ''];
			if (this.paymentPassage != null && this.paymentPassage != '' && this.paymentPassage != undefined) {
				let b = this.paymentPassage.split('');
				for (let i = 0; i < b.length; i++) {
					a[i] = '*';
				}
			}
			return a;
		}
	},
	created() {
		this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
		this.guding = document.documentElement.clientHeight;
		this.getAdminInfo();
	},
	methods: {
		//进入红包纪录
		sendRecords(){
			this.$router.push()
		},
		//创建红包
		creatRed(e){
			var data={
				openid:this.userInfo.user.openid,
				password:e,
				memberNo:this.userInfo.user.memberNo,
				totalAmount:this.redPackage.cash,
				totalPacket :this.redPackage.num,
				description :this.redPackage.text
			}
			if(this.redPackage.text==''||this.redPackage.text==null){
				var data={
					openid:this.userInfo.user.openid,
					password:e,
					memberNo:this.userInfo.user.memberNo,
					totalAmount:this.redPackage.cash,
					totalPacket :this.redPackage.num,
					description :'恭喜发财,大吉大利'
				}
			}
			console.log(this.redPackage.text)
			api.create(data).then((res)=>{
				if(res.data.code==200){
					this.elastic('楼币红包创建成功','返回首页')
				}else if(res.data.code==4006){
					this.elastic('楼币红包账户余额不足','取消','查看余额','请核实后重试');
				}else if(res.data.code==4003){
					this.elastic('支付密码错误,请重试', '忘记密码', '立即重试');
				}
			})
		},
		//获取用户是否有支付密码
		getAdminInfo(){
			let data =this.userInfo.user.memberNo;
			api.adminInfo(data).then((res)=>{
				if(res.data.code==200){
					if(res.data.data.isSetPassword){
						this.isPassage=1
					}else{
						this.isPassage=-1
					}
				}else{
					this.isTips(res.data.msg)
				}
			})
		},
		//点击弹框按钮
		buttonAlert(e) {
			if (e == '知道了') {
				this.closeAlert(1);
			} else if (e == '返回首页') {
				this.$router.push('/');
			} else if (e == '立即重试'||e=='取消') {
				this.paymentPassage = null;
				this.closeAlert(1);
			} else if (e == '忘记密码') {
				this.elastic('如忘记密码，请联系管理员', '退出');
			} else if (e == '退出') {
				this.closeAlert(3);
			}else if(e=='查看余额'){
				this.$router.push('record')
			}else if(e=='重新设置'){
				this.passText='请设置支付密码';
				this.setPassageNum="";
				this.passageNum=null;
				this.isPassageAlert=false;
			}else if(e=='查看余额'){
				this.$router.push('record')
			}
		},
		//显示指定内容的弹窗
		elastic(a, b, c, d) {
			if (c) {
				this.warning.button2 = c;
				this.warning.show = true;
			} else {
				this.warning.show = false;
			}
			if (d) {
				this.warning.show2 = true;
				this.warning.text2 = d;
			} else {
				this.warning.show2 = false;
			}
			this.warning.text1 = a;
			this.warning.button = b;
			this.isPassageAlert = true;
		},
		//取消
		cancel() {
			this.$router.push('/');
		},
		confirm() {
			let text2 = '知道了';
			if (this.redPackage.cash == 0 || this.redPackage.cash == '') {
				this.elastic('红包金额必须大于0', text2);
				return;
			}
			if (this.redPackage.num == 0 || this.redPackage.num == '') {
				this.elastic('红包数量必须大于0', text2);
				return;
			}
			if (this.redPackage.num - 0 > this.redPackage.cash - 0) {
				var test = '红包金额必须大于' + this.redPackage.num;
				this.elastic(test, text2);
				return;
			}
			this.isPassageAlert2 = true;
		},
		record() {
			this.$router.push('/record');
		},
		//发送支付密码
		sendPassage(e) {
			//发送密码接口
			var data ={
				memberNo:this.userInfo.user.memberNo,
				password:e
			}
			api.savePassword(data).then((res)=>{
				if(res.data.code==200){
					this.isPassage = 1;
				}else{
					this.isTips(res.data.msg)
				}
			})
		},
		//关闭弹窗
		closeAlert(e) {
			//1是关闭普通弹窗，2是关闭支付弹窗3是关闭所有弹窗
			if (e == 1) {
				this.isPassageAlert = false;
				this.passageNum = null;
				this.setPassageNum = '';
				this.passText = '请设置支付密码';
			} else if (e == 2) {
				this.isPassageAlert2 = false;
				this.paymentPassage = null;
			} else if (e == 3) {
				this.isPassageAlert2 = false;
				this.isPassageAlert = false;
				this.passageNum = null;
				this.setPassageNum = '';
				this.paymentPassage = null;
			}
		}
	}
};
</script>

<style scoped lang="less">
.z90 {
	z-index: 90;
}
.z99 {
	z-index: 99;
}
.all {
	font-size: 30px;
	position: fixed;
	width: 100%;
	height: 100%;
	overflow: hidden;
	overflow-y: auto;
}
.passageAlert {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(70, 70, 70, 0.6);
	box-sizing: border-box;
	padding-top: 20vh;
	.payment {
		width: 500px;
		margin: 0 auto;
		background-color: #fff;

		.firstLi {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			line-height: 70px;
			font-size: 30px;
			border-bottom: 1px #ccc solid;
			i {
				display: inline-block;
				width: 40px;
				height: 5px;
				background: #ccc;
				line-height: 0;
				font-size: 0;
				vertical-align: middle;
				-webkit-transform: rotate(45deg);
				position: absolute;
				left: 10px;
			}
			i:after {
				content: '/';
				display: block;
				width: 40px;
				height: 5px;
				background: #ccc;
				-webkit-transform: rotate(-90deg);
			}
		}
		.twoLi {
			border-bottom: solid 1px #ccc;
			.cash {
				background: url(../../../static/envelopes/create_03.png) no-repeat;
				background-size: 100% 100%;
				width: 80px;
				height: 80px;
				margin: 10px auto;
			}
			.text {
				color: gray;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 10px 10px;
				div {
					white-space: nowrap;
					width: 200px;
				}
				span {
					color: red;
					display: block;
					box-sizing: border-box;
					width: auto;
					word-break: break-all;
					text-align: left;
				}
			}
		}
		.lastLi {
			.box {
				width: 350px;
				position: relative;
				height: 80px;
				margin: 0 auto;
				input {
					border: none;
					width: 100%;
					opacity: 0;
					position: absolute;
					left: 0;
					top: 0;
					height: 100%;
					z-index: 100;
				}
				ul {
					display: flex;
					justify-content: space-between;
					width: 100%;
					height: 100%;
					position: absolute;
					left: 0;
					top: 0;
				}
				li {
					width: 22%;
					border-bottom: solid 1px #ccc;
					margin-right: 10px;
					font-size: 40px;
					font-weight: 1000;
					height: 80%;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #ccc;
				}
			}
		}
	}

	.tips {
		width: 70%;
		background: #fff;
		border-radius: 10px;
		margin: 0 auto;
		div:first-of-type {
			padding: 6vw 0;
			p:first-of-type {
				margin-bottom: 4vw;
			}
			p:last-of-type {
				margin: 0;
			}
		}
		div:last-of-type {
			display: flex;
			justify-content: space-around;
			align-items: center;
			border-top: 1px solid #ccc;
			span:last-of-type {
				color: #f95c5b;
			}
		}
		p {
			font-size: 35px;
			color: #4d4d4d;
			text-align: center;
			margin: 0;
			white-space: nowrap;
		}
		span {
			display: inline-block;
			font-size: 25px;
			color: #589bdc;
			width: 100%;
			height: 10vw;
			line-height: 10vw;
			text-align: center;
		}
	}
}
.setPassage {
	background: url(../../../static/envelopes/login.png) no-repeat;
	background-size: 100% 100%;
	width: 100%;
	z-index: -1;
	display: flex;
	align-items: center;
	flex-direction: column;
	box-sizing: border-box;
	.passage {
		margin-bottom: 50px;
		input {
			border: none;
			width: 100%;
			opacity: 0;
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			z-index: 100;
		}
		.box {
			width: 350px;
			position: relative;
			ul {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
			}
			li {
				width: 22%;
				border-bottom: solid 1vw #fff;
				margin-right: 10px;
				font-size: 6vw;
				font-weight: 1000;
				color: #fff;
			}
		}
		p {
			color: #fff;
			font-size: 35px;
			font-weight: 600;
			margin-bottom: 3vh;
		}
	}
	.login1 {
		background: url(../../../static/envelopes/login2.png) no-repeat;
		background-size: 100% 100%;
		width: 161px;
		z-index: 5;
		margin-bottom: 3.5vw;
	}
	.login2 {
		background: url(../../../static/envelopes/login3.png) no-repeat;
		background-size: 100% 100%;
		width: 358px;
		z-index: 5;
	}
}
.hand {
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgb(235, 235, 235);
	.hand-title {
		height: 60px;
		line-height:60px;
		font-size: 35px;
		font-weight: 600;
		color: #fff;
		background-color: #f95c5b;
	}
	.hand-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 700px;
		position: fixed;
		bottom: 3vh;
		left: 25px;
		button {
			border: none;
			background-color: #3696e0;
			width: 200px;
			height: 60px;
			line-height: 60px;
			color: #fff;
			font-size: 35px;
			border-radius: 10px;
			z-index: 80;
			outline: none;
			white-space: nowrap;
		}
		button:last-of-type {
			background-color: #f95c5b;
		}
	}
	.hand-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 3vh;
		.body-cash {
			background-color: #fff;
			width: 660px;
			display: flex;
			justify-content: space-between;
			padding: 20px;
			margin-bottom: 3vh;
			textarea {
				width: 100%;
				height: 15vh;
				background-color: #ffffff;
				border-radius: 10px;
				border: none;
				box-sizing: border-box;
				font-size: 35px;
				outline: none;
			}
			textarea::-webkit-input-placeholder {
				/* WebKit browsers */
				color: #ccc;
			}
			textarea:-moz-placeholder {
				/* Mozilla Firefox 4 to 18 */
				color: #ccc;
			}
			textarea::-moz-placeholder {
				/* Mozilla Firefox 19+ */
				color: #ccc;
			}
			textarea::-ms-input-placeholder {
				/* Internet Explorer 10+ */
				color: #ccc;
			}

			label {
				white-space: nowrap;
				font-size: 35px;
			}
			label:first-of-type {
				width: 300px;
				text-align: left;
			}
			input {
				border: none;
				outline: none;
				text-align: right;
				font-size: 40px;
				width: 200px;
				color: #ccc;
			}
			label:last-of-type {
				width: 100px;
				text-align: right;
			}
		}
	}
}
</style>
