<template>
  <div id="app">
    <router-view />
    <elastic :imgUrl="alertImgUrl" v-show="isShow" :class="showAnimate"></elastic>
    <div class="loading" v-if="isshow"></div>
    <transition name="fade">
      <div class="boxs" v-show="tips.isShow">
        <div class="tips">{{ tips.text }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
import elastic from './components/alert.vue';
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
    this.$router.push('/');
    this.prohibitFontSize();
  },
  methods: {
    //wx禁止调整字体大小
    prohibitFontSize(){
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
      var handleFontSize = function () {
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
      }
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
body {
  padding: 0;
  margin: 0;
}
.img > img {
  width: 100%;
  height: 100%;
}
.boxs {
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

.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  color: #fff;
  background: #000 url(../static/loading.gif) no-repeat;
  background-size: 100px 100px;
  background-position: center center;
  opacity: 0.6;
  z-index: 99;
  -moz-border-radius: 20px;
  -webkit-border-radius: 20px;
  border-radius: 20px;
  filter: progid:DXImageTransform.Microsoft.Alpha(opacity=70);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
