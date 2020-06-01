<template>
	<!-- <div class='box'> -->
	<div class="home" :style="{ height: guding + 'px' }">
		<div class="address" v-show="isHave === true">
			<div class="img"><img :src="img[0]" /></div>
			<div>当前城市：{{ userInfo.user.city }}</div>
		</div>
		<div class='textBox'>
			<transition name="slide">
			   <p class="text" :key="text.id">{{ text.val }}</p>
			</transition>
		</div>
		<div class="home-body" v-show="isHave === true">
			<div v-for="(item, index) in button" :key="index" class="img" @click="click(index)"><img :src="item" /></div>
		</div>
		<div class="message" v-show="isHave === true">
			<div class="img" @click="gotoWeb('chat')"><img :src="img[1]" /></div>
		</div>
		<div class="noActivity" v-show="isHave === false">敬请期待！</div>
		<!-- 客户信息是否审核 -->
		<div class="isPass mask" v-if="status != 2">
			<!-- 填消息 0-->
			<div
				class="addInfo"
				v-if="status == 0"
				:style="{ height: guding * 0.8 + 'px', fontSize: guding * 0.03 + 'px', paddingTop: guding * 0.1 + 'px' }"
			>
				<div>
					<label for="userNum">用户编号 :</label>
					<input type="text" id="userNum" v-model="passInfo.inputMemberNo" :style="{ height: guding * 0.06 + 'px' }" />
				</div>
				<div>
					<label for="userName">姓名 :</label>
					<input type="text" id="userName" v-model="passInfo.realName" :style="{ height: guding * 0.06 + 'px' }" />
				</div>
				<div>
					<label for="addresName">店名 :</label>
					<input type="text" id="addresName" v-model="passInfo.storeName" :style="{ height: guding * 0.06 + 'px' }" />
				</div>
				<div>
					<label for="addresNum">专卖证号 :</label>
					<input type="text" id="addresNum" v-model="passInfo.monopolyNo" :style="{ height: guding * 0.06 + 'px' }" />
				</div>
				<div>
					<label for="phone">手机号码 :</label>
					<input type="number" id="phone" v-model="passInfo.phone" :style="{ height: guding * 0.06 + 'px' }" />
				</div>
				<div><i @click="inPass" :style="{ height: guding * 0.07 + 'px' }"></i></div>
			</div>
			<!-- 审核中 1-->
			<div v-if="status == 1"><div class="passing"></div></div>
			<!-- 审核未通过-1 -->
			<div v-if="status == -1">
				<div class="noPass"><div class="review" @click="rewview"></div></div>
			</div>
		</div>
		<!-- 红包管理 -->
		<div class="envelopes" v-if="userInfo.isRedPacketAdmin" @click="gotoWeb('administration')"></div>
	</div>
	<!-- </div> -->
</template>

<script>
import api from '@/getapi.js';
export default {
	name: 'home',
	data() {
		return {
			img: ['./static/address.png', './static/liuyan.png'],
			isHave: '',
			button: ['./static/button1.png', './static/button2.png', './static/button3.png', './static/button4.png'],
			userInfo: {
				informImgUrl: '',
				packageUrl: '',
				questionnaireUrl: '',
				pictureActivityId: '',
				isRedPacketAdmin: false,
				user: {
					city: ''
				}
			},
			//初始传值
			initData: [],
			//当前客户状态
			status: 2,
			passInfo: {
				realName: '',
				storeName: '',
				monopolyNo: '',
				inputMemberNo: '',
				userId: '',
				phone:''
			},
			guding: 0,
			number:0,
			textArr:[]
		};
	},
	inject: ['isAlertShow', 'isloadingshow', 'isTips'],
	created() {
		this.guding = document.documentElement.clientHeight;
		this.isloadingshow(true);
		//todo 以下修改
		// this.slice('http://qrhhl.yunyutian.cn/market/index.html?openid=oXslc0zEvV5RwspCzgWcQMmL-_yA&customerId=0000003#/');
		this.slice(location.href);
	},
	mounted() {
		this.startMove();
		    if (this.number === this.textArr.length-1) {
		      this.number = 0;
		    } else {
		      this.number += 1;
		    }
	},
	computed:{
		text() {
		  return {
		    id: this.number,
		    val: this.textArr[this.number]
		  };
		}
	},
	methods: {
    //获取轮播文字
    getTop20Record(e){
      let self = this;
      api.getTop20Record(e).then((res)=>{
        if(res.data.code==200){
         self.textArr= res.data.data.map((res)=>{
           var a ='恭喜'+res.memberNo+'获得'+res.prizeName+'一件'
            return a
          })
        }else{
          self.isTips(res.data.msg);
        }
      })
    },
		 startMove() {
		      let timer = setTimeout(() => {
		        if (this.number ===this.textArr.length-1) {
		          this.number = 0;
		        } else {
		          this.number += 1;
		        }
		        this.startMove();
		      }, 3000); // 滚动不需要停顿则将时间改成动画持续时间
		    },
		//重新上传用户信息
		rewview() {
			this.status = 0;
		},
		//调取上传用户信息的接口
		setEdit(data) {
			var self = this;
			api.edit(data).then(res => {
				if (res.data.code == 200) {
					self.status = 1;
				} else {
					this.isTips(res.data.msg);
				}
			});
		},
		// 提交
		inPass() {
			if (
				this.passInfo.realName == '' ||
				this.passInfo.storeName == '' ||
				this.passInfo.monopolyNo == '' ||
				this.passInfo.inputMemberNo == ''||
				this.passInfo.phone==''
			) {
				this.isTips('信息不能为空！');
				return;
			}
			this.passInfo.userId = this.userInfo.user.userId;
			this.setEdit(this.passInfo);
		},
		//截取url
		slice(url) {
			for (let i = 0; i < url.slice(44, -2).split('&').length; i++) {
				this.initData.push(
					url
						.slice(44, -2)
						.split('&')
						[i].split('=')[1]
				);
			}
			//todo以后return以前删除
			// let data = {
			// 	openid: this.initData[0],
			// 	customerId: this.initData[1],
			// 	latitude:  0,
			// 	longitude:  0
			// };
			// this.getMarket(data);
			// return;
			this.getJsSign();
		},
		//获取wx权限
		getJsSign() {
			let self = this;
			let url = location.href.split('#')[0];
			api.getJsSign(url).then(res => {
				if (res.data.code == 200) {
					self.wx.config({
						debug: false,
						appId: res.data.data.appid,
						timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
						nonceStr: res.data.data.nonceStr, // 必填，生成签名的随机串
						signature: res.data.data.signature, // 必填，签名
						jsApiList: ['getLocation', 'hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
					});
					self.wx.ready(function() {
						self.wx.hideAllNonBaseMenuItem();
						self.wx.getLocation({
							type: 'wgs84',
							success: function(res) {
								let data = {
									openid: self.initData[0],
									customerId: self.initData[1],
									latitude: res.latitude || 0,
									longitude: res.longitude || 0
								};
								self.getMarket(data);
							}
						});
					});
				} else {
					self.isTips(res.data.msg);
				}
			});
		},
		getMarket(e) {
			var self = this;
			api.market(e).then(res => {
				if (res.data.code == 200) {
					self.userInfo = res.data.data;
					self.status = res.data.data.user.status;
					localStorage.setItem('userInfo', JSON.stringify(self.userInfo));
					self.isHave = res.data.data.isHave;
					self.userInfo.isRedPacketAdmin=res.data.data.isRedPacketAdmin;
          setTimeout(()=>{
            self.getTop20Record(self.initData[0]);
          })
					self.isloadingshow(false);
				} else {
					self.isTips(res.data.msg);
				}
			});
		},
		//点击各个按钮
		click(e) {
			if (e == 0) {
				//问卷调查
        //todo
        // this.$router.push('investigationWeb')
       // return
				if (this.userInfo.questionnaireUrl == '') {
					this.isTips('敬请期待！');
					return;
				}
				window.location.href = this.userInfo.questionnaireUrl;
			} else if (e == 1) {
				if (this.userInfo.informImgUrl == '') {
					this.isTips('敬请期待！');
					return;
				}
				this.$router.push({
					path: '/actImg',
					query: {
						imgUrl: this.userInfo.informImgUrl
						// imgUrl:"./static/button3.png"
					}
				});
				//活动告知
				/*var alert={
						type:1,//1图片2wait
						url:this.userInfo.informImgUrl
						// url:"./static/button3.png"
					}
					this.isAlertShow(true,alert)*/
			} else if (e == 2) {
				//楼币红包
				if (this.userInfo.redPacketId == '') {
					this.isTips('敬请期待！');
					return;
				}
				this.$router.push('/redEnvelopesReceive');
			} else if (e == 3) {
				if (this.userInfo.pictureActivityId == '') {
					this.isTips('敬请期待！');
					return;
				}
				this.$router.push('/upload');
			}
		},
		//跳往别的页面
		gotoWeb(e) {
			this.$router.push(e);
		}
	}
};
</script>

<style scoped lang="less">
//红包图标
.envelopes {
	background: url(../../static/redPackage.gif) no-repeat;
	background-size: 100% 100%;
	width: 114px;
	height: 133px;
	position: fixed;
	right: 100px;
	bottom: 100px;
}
.isPass {
	overflow: hidden;
	overflow-y: auto;
	.noPass {
		background: url(../../static/noPass.png) no-repeat;
		background-size: 100% 100%;
		width: 620px;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		height: 53.15vh;
		padding-bottom: 7vh;
		box-sizing: border-box;
		.review {
			background: url(../../static/review.png) no-repeat;
			background-size: 100% 100%;
			width: 367px;
			height: 7.1vh;
		}
	}
	.passing {
		background: url(../../static/passing.png) no-repeat;
		background-size: 100% 100%;
		width: 620px;
		height: 53.15vh;
	}
	.addInfo {
		div {
			padding: 0 80px;
			box-sizing: border-box;
		}
		div:last-of-type {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 20px;
			i {
				display: block;
				background: url(../../static/sure.png) no-repeat;
				width: 367px;
				background-size: 100% 100%;
			}
		}
		box-sizing: border-box;
		background: url(../../static/infoBg.png) no-repeat;
		background-size: 100% 100%;
		width: 633px;
		color: black;
		font-size: 35px;
		input {
			border: none;
			width: 100%;
			border: solid 1px rgb(208, 159, 111);
			margin-bottom: 0.5%;
		}
		label {
			display: block;
			text-align: left;
			padding: 1% 0;
		}
	}
}
.iframe {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: #fff;
}

.noActivity {
	height: 50vh;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 1000;
	font-size: 50px;
}

.box {
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgb(246, 240, 229);
}

.home {
	overflow: hidden;
	background: url(../../static/bg.png) no-repeat;
	background-size: 100% 100%;
	position: fixed;
	width: 100%;
	padding-top: 22.6vh;
	box-sizing: border-box;
}
//文字滚动效果
.slide-enter-active,
.slide-leave-active {
  transition: all 3s linear;
}
.slide-enter {
  transform: translateY(40px) scale(1);
  opacity: 0.5;
}
.slide-enter-to {
  opacity: 1;
}
.slide-leave-to {
  transform: translateY(-40px) scale(0.8);
  opacity: 0;
}
.textBox {
  width: 100%;
  height: 5vh;
  margin: 2vh auto 0;
  position: relative;
  text-align: center;
  .text {
    width: 100%;
    position: absolute;
    bottom: 0;
    margin-top: 10px;
    color: rgb(200, 130, 45);
    font-size: 30px;
  }
}
.address {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding-left: 16.2vw;
	box-sizing: border-box;
	color: rgb(166, 141, 87);
	font-size: 20px;

	.img {
		margin-right: 1%;
		width: 2.5vw;
		height: 3.5vw;
	}
}

.home-body {
	padding: 0 8.2vw 0 16.2vw;
	box-sizing: border-box;
	height: 53vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin: 0 0 2.77vh;

	.img {
		height: 12.9vh;
	}
}

.message {
	display: flex;
	justify-content: center;
	align-items: center;

	.img {
		width: 34.8vw;
		height: 5.77vh;
	}
}
</style>
