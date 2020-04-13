<template>
	<!-- <div class='box'> -->
	<div class='home'>
		<div class='address' v-show="isHave===true">
			<div class='img'><img :src="img[0]"></div>
			<div>当前城市：{{address}}</div>
		</div>
		<div class='home-body' v-show="isHave===true">
			<div v-for='(item,index) in button' :key='index' class='img' @click="click(index)">
				<img :src="item">
			</div>
		</div>
		<div class='message' v-show="isHave===true">
			<div class='img' @click="gotoWeb('chat')">
				<img :src="img[1]">
			</div>
		</div>
		<div class='noActivity' v-show="isHave===false">
			敬请期待！
		</div>
		<iframe v-show='iframeData.isShow' class='iframe' :src="iframeData.url" frameborder="0"></iframe>
	</div>
	<!-- </div> -->
</template>

<script>
	import api from '@/getapi.js'
	export default {
		name: "home",
		data() {
			return {
				img: ['./static/address.png', './static/liuyan.png'],
				isHave: "",
				button: ['./static/button1.png', './static/button2.png', './static/button3.png', './static/button4.png'],
				userInfo: {
					informImgUrl: "",
					packageUrl: "",
					questionnaireUrl: '',
					pictureActivityId: ''
				},
				//初始传值
				initData: [],
				iframeData: {
					isShow: false,
					url: ''
				}
			}
		},
		computed: {
			//是否有活动
			// isActivity(){
			// 	if(this.isHave){
			// 		return 1
			// 	}else{
			// 		return -1
			// 	}
			// }
		},
		inject: ['isAlertShow', 'isloadingshow', 'isTips'],
		created() {
			this.isloadingshow(true);
			this.slice(location.href);
		},
		methods: {
			//截取url
			slice(url) {
				for (let i = 0; i < url.slice(44, -2).split('&').length; i++) {
					this.initData.push(url.slice(44, -2).split('&')[i].split('=')[1])
				}
				this.getJsSign();
			},
			//获取wx权限
			getJsSign() {
				let self = this;
				let url = location.href.split('#')[0];
				api.getJsSign(url).then((res) => {
					if (res.data.code == 200) {
						self.wx.config({
							debug: false,
							appId: res.data.data.appid,
							timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
							nonceStr: res.data.data.nonceStr, // 必填，生成签名的随机串
							signature: res.data.data.signature, // 必填，签名
							jsApiList: ['getLocation', 'hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
						})
						self.wx.ready(function() {
							self.wx.hideAllNonBaseMenuItem();
							self.wx.getLocation({
								type: 'wgs84',
								success: function(res) {
									let data = {
										openid: self.initData[0],
										latitude: res.latitude || 0,
										longitude: res.longitude || 0
									}
									self.getMarket(data)
								}
							})
						})
					} else {
						self.isTip(res.data.msg)
					}
				})
			},
			getMarket(e) {
				api.market(e).then((res) => {
					if (res.data.code == 200) {
						this.userInfo = res.data.data;
						localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
						this.isHave = res.data.data.isHave;
						this.isloadingshow(false);
					} else {
						self.isTip(res.data.msg)
					}
				})
			},
			//点击各个按钮
			click(e) {
				if (e == 0) {
					//问卷调查
					if (this.userInfo.questionnaireUrl == "") {
						this.isTips('敬请期待！');
						return
					}
					this.iframeData = {
						isShow: true,
						url: this.userInfo.questionnaireUrl
					}
					// window.location.href=this.userInfo.questionnaireUrl;
				} else if (e == 1) {
					if (this.userInfo.informImgUrl == "") {
						this.isTips('敬请期待！')
						return
					}
					this.$router.push({
						path: '/actImg',
						query: {
							// imgUrl: this.userInfo.informImgUrl,
							imgUrl:"./static/button3.png"
						}
					})
					//活动告知
					/*var alert={
						type:1,//1图片2wait
						url:this.userInfo.informImgUrl
						// url:"./static/button3.png"
					}
					this.isAlertShow(true,alert)*/
				} else if (e == 2) {
					//楼币红包
					if (this.userInfo.packageUrl == "") {
						this.isTips('敬请期待！')
						return
					}
					window.location.href = this.userInfo.packageUrl
				} else if (e == 3) {
					if (this.userInfo.pictureActivityId == "") {
						this.isTips('敬请期待！')
						return
					}
					this.$router.push('/upload')
				}
			},
			//跳往别的页面
			gotoWeb(e) {
				this.$router.push(e)
			}
		}
	}
</script>

<style scoped lang="less">
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
		height: 57.2vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 2.77vh 0;

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
