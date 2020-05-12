<template>
	<div id="app">
		<router-view />
		<elastic :imgUrl="alertImgUrl" v-show="isShow" :class="showAnimate"></elastic>
		<!-- <div class="mask loadding" v-if="isshow"></div> -->
		<!-- todo -->
		<transition name="fade">
			<div class="boxs" v-show="tips.isShow">
				<div class="tips">{{ tips.text }}</div>
			</div>
		</transition>
	</div>
</template>

<script>
import elastic from './components/alert.vue';
import api from './getapi.js';
export default {
  name: 'App',
  components: {
    elastic
  },
  provide() {
    return {
      isloadingshow: this.isloadingshow,
      isAlertShow: this.appAlertShow,
      isTips: this.isTipsShow
    };
  },
  data() {
    return {
      isshow: false,
      isShow: false,
      showAnimate: {
        show_in: false,
        show_out: false
      },
      tips: {
        isShow: false,
        text: ''
      },
      alertImgUrl: ''
    };
  },
  created() {
    // this.$router.push('/');//todo
    this.prohibitFontSize();
		//禁止看到链接
		this.prohibit();
  },
  methods: {
	  prohibit(){
		  if(this.$route.path=='/'||this.$route.path=='upload'){
			return
		  }
		  this.slice(location.href);
		  console.log(this.$route.path)
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
		        jsApiList: ['hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
		      });
		      self.wx.ready(function() {
		        self.wx.hideAllNonBaseMenuItem();
		      });
		    } else {
		      self.isTips(res.data.msg);
		    }
		  });
		},
    //wx禁止调整字体大小
    prohibitFontSize() {
      if (typeof WeixinJSBridge == 'object' && typeof WeixinJSBridge.invoke == 'function') {
        handleFontSize();
      } else {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', handleFontSize, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', handleFontSize);

          document.attachEvent('onWeixinJSBridgeReady', handleFontSize);
        }
      }
      var handleFontSize = function() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', {
          fontSize: 0
        });

        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function() {
          WeixinJSBridge.invoke('setFontSizeCallback', {
            fontSize: 0
          });
        });
      };
    },
    isTipsShow(e) {
      var self = this;
      self.tips = {
        isShow: true,
        text: e
      };
      setTimeout(res => {
        self.tips.isShow = false;
      }, 1500);
    },
    isloadingshow(e) {
      this.isshow = e;
    },
    appAlertShow(e, f) {
      this.isShow = e;
      if (f && f.type == 1) {
        this.alertImgUrl = f.url;
        // this.alertImgUrl='http://qrhhl.yunyutian.cn/huanghelou1916-images/market_inform_image/96daaecf09e640f29246bf2a1c64d456.jpg'
        // this.alertImgUrl='https://pic.cwyyt.cn/upload/img/20200408/1130553055_icon.png'
      } else if (f && f.type == 2) {
      }
      if (e == true) {
        this.showAnimate.show_in = e;
        this.showAnimate.show_out = !e;
      } else {
        this.showAnimate.show_in = !e;
        this.showAnimate.show_out = e;
      }
    },
    closeAlert() {
      this.isShowAlert = false;
    }
  }
};
</script>

<style lang="less">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
.show_in {
	animation: go_in 1s;
	opacity: 1;
}
@keyframes go_in {
	0% {
		opacity: 0;
		transform: scale(0);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}
.show_out {
	animation: go_out 1s;
	opacity: 0;
}
/*  @keyframes go_out
	    {
	       0% {opacity: 1; transform: scale(1);visibility: visible;}
	       100%{opacity: 0; transform: scale(0);}

	    }*/
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
body,
ul {
	padding: 0;
	margin: 0;
}
ul {
	list-style-type: none;
}
.img > img {
	width: 100%;
	height: 100%;
}
.boxs {
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	position: fixed;
	.tips {
		max-width: 81vw;
		font-size: 30px;
		padding: 10px 20px;
		text-align: left;
		word-break: break-all;
		color: #fff;
		background-color: #000;
		opacity: 0.6;
		z-index: 100;
		-moz-border-radius: 20px;
		-webkit-border-radius: 20px;
		border-radius: 10px;
		filter: progid:DXImageTransform.Microsoft.Alpha(opacity=70);
	}
}
.loadding {
	background: url(../static/loading.gif) no-repeat;
	background-size: 60px 60px;
	color: #fff;
}
.mask {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	background-color: rgba(0, 0, 0, 0.6);
	background-position: center center;
	z-index: 99;
	filter: progid:DXImageTransform.Microsoft.Alpha(opacity=70);
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
