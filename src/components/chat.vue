<template>
  <div class="chat">
    <!-- <div class="header">
      <div class="img" @click="gotoWeb('/')"><img :src="img[0]" alt="" /></div>
      <div>楼楼测试</div>
      <div class="img"><img :src="img[1]" alt="" /></div>
    </div> -->
    <div class='backHome' @click="backHome"></div>
    <div class="body" @click="closePress">
      <div class="chat-box" v-for="(item, index) in charData" :key="index">
        <div v-if="item.isTime">
          <div class="time">{{ item.time }}</div>
        </div>
        <div v-if="item.type == 1" class="left">
          <div class="img"><img :src="item.img" alt="" /></div>
          <div class="card" v-longTap="pressLeft(item.content)">
            <div class="arrow-left"></div>
            {{ item.content }}
          </div>
        </div>
        <div v-if="item.type == 2" class="right">
          <div class="icon wait" v-show="isSend == 'send'"></div>
          <div class="icon sendErr" v-show="isSend == 'err'">!</div>
          <div class="card" v-longTap="pressRight(item,index)">
            <div class="arrow-right"></div>
            {{ item.content }}
          </div>
          <div class="img"><img :src="item.img" alt="" /></div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-input" ><input  type="text" v-model="text" /></div>
      <div class="sendOut" @click="sendOut">发送</div>
    </div>
    <ul class="press" :style="{ left: popupAdress.left, top: popupAdress.top }" v-show="popup.isShow">
      <li v-for="(item, index) in popup.data" :key='item' class="pressCopy" :data-clipboard-text="copyText" @click="pressClick(item)">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
import api from '@/getapi.js';
export default {
  name: 'chat',
  data() {
    return {
      img: ['./static/right.png', './static/ellipsis.png'],
      text: '',
      charData: [
        {
          content: '您好，欢迎留言123。',
          img: 'https://wxfile.hhl1916.com/wx/1/headimg/5d6bb2dae5654addbddb8d356826004b.jpg',
          isTime: true,
          nickName: '楼楼',
          time: '星期三 13:03',
          type: 1,
          userId: 'admin'
        },
      ],
      screenHeight: '',
      //客户留言和id
      userChat: '',
      initData: [],
      //是否发送
      isSend: '',
      //长按弹出的按钮
      popup: {
        data: ['复制', '撤销'],
        isShow: false
      },
      //弹出框的位置
      popupAdress: { left: 0, top: 0 },
      copyText: '',
      //长按选中的内容
      longTapContent:''
    };
  },
  inject: ['isloadingshow', 'isTips'],
  created() {
    this.isloadingshow(true);
    // this.slice(location.href);
    this.getChat();
  },
  mounted() {
    this.scroll();
  },
  watch: {
    screenHeight() {
      this.scrollBottom();
    }
  },
  methods: {
    backHome(){
      this.$router.push('/')
    },
    //隐藏功能框
    closePress() {
      this.popup.isShow = false;
    },
    pressClick(e) {
      if (e == '复制') {
        this.copy();
      } else if (e == '撤销') {
        this.delChat()
      }
    },
    //撤销
    delChat(){
      var self =this;
      console.log(this.longTapContent)
      let data={
        userId:this.longTapContent[0].userId,
        messageId:this.longTapContent[0].messageId
      }
      api.revoke(data).then((res)=>{
        if(res.data.code==200){
          self.charData.splice(self.longTapContent[1],1);
		  self.isTips('撤销成功');
        }else{
          self.isTips(res.data.msg)
        }
		self.closePress();
      })
    },
    //复制
    copy() {
      var self = this;
      var clipboard = new this.clipboard('.pressCopy');
      clipboard.on('success', function(e) {
        self.isTips('复制成功');
       console.log(self.copyText)
        e.clearSelection();
         clipboard.destroy();
      });

      clipboard.on('error', function(e) {
        self.isTips('复制失败');
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
         clipboard.destroy();
      });
      self.popup.isShow = false;
    },
    pressLeft(f) {
      var self = this;
      return e => {
        self.popup = {
          isShow: true,
          data: ['复制']
        };
        self.popupAdress = {
          left: e.x + 'px',
          top: e.bottom - e.height / 3 + 'px'
        };
        self.copyText = f;
		console.log(self.copyText)
      };
    },
    pressRight(f,g) {
      var self = this;
      return e => {
        self.popup = {
          isShow: true,
          data: ['复制', '撤销']
        };
        self.popupAdress = {
          left: e.x + 'px',
          top: e.bottom - e.height / 3 + 'px'
        };
        self.copyText = f.content;
		console.log(self.copyText)
        self.longTapContent=[f,g];
      };
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
    //获取消息
    getChat() {
      api.getChat(JSON.parse(localStorage.getItem('userInfo')).user.openid).then(res => {
        if (res.data.code == 200) {
          this.userChat = res.data.data;
          this.charData = res.data.data.messages;
          this.scrollBottom();
          this.isloadingshow(false);
        } else {
          this.isTips(res.data.msg);
        }
      });
    },
    gotoWeb(e) {
      this.$router.push(e);
    },
    //发送
    sendOut() {
      if (this.text == '') {
        return;
      }
      // this.isSend='wait';
      let data = {
        userId: this.userChat.userId,
        content: this.text
      };

      api.send(data).then(res => {
        if (res.data.code == 200) {
          /*let newData = {
							img: this.charData.img,
							type: 2,
							isTime: false,
							time: '',
							content: this.text
						}
						this.charData.push()
						 this.isSend = "";*/
          this.getChat();
          this.text = '';
        } else {
          this.isTips(res.data.msg);
          // this.isSend = 'err'
        }
      });
    },
    //监听消息box高度变化
    scroll() {
      var container = this.$el.querySelector('.body');
      this.screenHeight = container.clientHeight;
      window.onresize = () => {
        return (() => {
          this.screenHeight = container.clientHeight;
        })();
      };
    },
    //滚动滚至最下
    scrollBottom() {
      this.$nextTick(() => {
        var container = this.$el.querySelector('.body');
        container.scrollTop = container.scrollHeight;
        // container.scrollTop = 0;
      });
    }
  }
};
</script>

<style scoped lang="less">
  .backHome{
    position: fixed;
    left: 10px;
    top: 10px;
    width: 86px;
    height: 86px;
    background: url('../../static/back.png') no-repeat;
    background-size: 100% 100%;
  }
//长按后的弹出框
.press {
  background-color: #fff;
  position: absolute;
  border: 1px solid #d6d6d6;
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.1) 2px 3px 10px;
  li {
    padding: 20px;
  }
  li:hover {
    background-color: #f5f5f5;
  }
}
.card {
  position: relative;
  background: #ffffff;
  border-radius: 5px; //外部矩形给圆角
  display: flex; //布局选用flex布局
  align-items: center; //内部元素垂直居中
  padding: 27px 36px;
  box-sizing: border-box;
  font-size: 28px;

  .arrow-right {
    position: absolute; //相对定位
    background: rgb(158, 234, 106);
    width: 10px;
    height: 10px;
    right: -6px;
    font-size: 0;
    // border-bottom: #ccc solid 1px;
    // border-left: #ccc solid 1px;
    box-sizing: border-box;
    transform: rotate(225deg);
    -ms-transform: rotate(225deg);
    /* IE 9 */
    -moz-transform: rotate(225deg);
    /* Firefox */
    -webkit-transform: rotate(225deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(225deg);
    /* Opera */
  }

  .arrow-left {
    position: absolute; //相对定位
    background: #fff;
    width: 10px;
    height: 10px;
    left: -6px;
    font-size: 0;
    // border-bottom: #ccc solid 1px;
    // border-left: #ccc solid 1px;
    box-sizing: border-box;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    /* IE 9 */
    -moz-transform: rotate(45deg);
    /* Firefox */
    -webkit-transform: rotate(45deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(45deg);
    /* Opera */
  }
}

@center: {
  display: flex;
  justify-content: center;
  align-items: center;
};

.chat {
  position: fixed;
  width: 100%;
  height: 100%;
}

.header {
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88px;
  padding: 0 30px;
  box-sizing: border-box;
  background-color: rgb(246, 240, 229);
  font-size: 36px;
  position: absolute;
  top: 0;
  width: 100%;

  .img:first-of-type {
    width: 15px;
  }

  .img:last-of-type {
    width: 33px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.body {
  height: 100%;
  padding-top: 86px;
  padding-bottom: 96px;
  box-sizing: border-box;
  background-color: rgb(246, 240, 229);
  overflow: scroll;
 -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .chat-box {
    margin-bottom: 20px;
    text-align: left;

    .left {
      display: flex;
      justify-content: left;
      align-items: center;
      padding-right: 20px;
      box-sizing: border-box;

      .card {
        max-width: 540px;
        word-break: break-all;
      }
    }

    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-left: 20px;
      box-sizing: border-box;

      .icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }

      .sendErr {
        border-radius: 50%;
        background-color: red;
        font-weight: 1000;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .wait {
        background: url(../../static/loading.gif) no-repeat;
        background-size: 100% 100%;
      }

      .card {
        background-color: rgb(158, 234, 106);
        max-width: 540px;
        word-break: break-all;
      }
    }
  }

  .time {
    color: rgb(153, 153, 153);
    font-size: 24px;
    height: 100px;
    @center();
  }

  .img {
    width: 80px;
    height: 80px;
    margin: 0 30px;
  }
}

.footer {
  z-index: 100;
  height: 96px;
  width: 100%;
  background-color: rgb(248, 211, 164);
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .footer-input {
    width: 490px;
    height: 73px;
    -webkit-user-select: text !important;
    input {
      width: 100%;
      height: 100%;
      border: none;
      text-indent: 10px;
      -webkit-user-select: text !important;
    }
  }

  .sendOut {
    border: solid 4px black;
    border-radius: 10px;
    padding: 12px 42px;
  }
}
</style>
