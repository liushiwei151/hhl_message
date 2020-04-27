<template>
  <div class="home">
    <div class="dayNum" v-show="!isSubmission">签到：{{ dayNum }}天</div>
    <div class="upImgTitle" v-show="!isSubmission">
      <div>
        <div class="titleRight">
          <div><img src="https://wxfile.hhl1916.com/opc/static/common/ms/images/app/shareActivity/icon_upload.png" /></div>
          上传照片
        </div>
        <div>最多可上传{{ imgNum }}张</div>
      </div>
    </div>
    <div class="review" v-show="isSubmission">
      <div><img src="https://pic.cwyyt.cn/upload/img/20200407/1743324332_icon.png" /></div>
      <p v-if="status == -1">审核不通过</p>
      <p v-if="status == 0">审核中</p>
      <p v-if="status == 1">审核通过</p>
    </div>
    <div class="addImg">
      <ul>
        <li class="imgLi" v-for="(item, index) in cwlocalIdImgs" :key="index" @click="previewImage(item)">
          <div v-show="!isSubmission" class="close" @click.stop="delImg(index)"></div>
          <img :src="item" />
        </li>
        <li class="add" @click="add_img" v-show="!isSubmission && isLi"></li>
      </ul>
    </div>
    <div class="textarea" v-show="!isSubmission">
      <textarea class="textarea_style" rows="7" placeholder="说点什么吧......" maxlength="150" v-model="textarea"></textarea>
      <div>{{ textarea.length }}/150</div>
    </div>
    <div class="tijiao">
      <div v-show="status == 0" @click="Submission" :class="{ active: !isActive, active2: isClick }">{{ buttonContent }}</div>
    </div>
    <div class="textbottom" v-show="isSubmission">
      <div class="gth">!</div>
      <div>仅在审核中可重新上传。</div>
    </div>
    <div class="backHome" @click="backHome"></div>
    <div class='isCalendar' @click="isCalendar"></div>
    <!-- 日期组件 -->
      <vue-hash-calendar @confirm='sureTime' :markDate='markDate' model='dialog' :disabled-date="disabledDate" :scrollChangeDate='false'  :visible.sync="isShowCalendar" :showTodayButton='false' pickerType='date'></vue-hash-calendar>
  </div>
</template>

<script>
import api from '@/getapi.js';
export default {
  name: 'upload',
  data() {
    return {
      dayNum: 0,
      imgUrl: [],
      //初始传值
      initData: [],
      //微信的照片地址
      localIdImgs: [],
      //策微的照片地址
      cwlocalIdImgs: [],
      serverId: [],
      textarea: '',
      buttonContent: '提交',
      //是否提交
      isSubmission: false,
      //可上传的图片数量
      imgNum: 3,
      //图片组id
      pictureWorksId: '',
      //审核状态
      status: 0,
      //是否点击
      isClick: false,
      //上传图片中不允许点击
      isUpload: true,
      isShowCalendar:false,
      markDate:[{color: 'red',date: []}],
      timeArray:[],
      //存储的历史日期和id
      historyTime:[]
    };
  },
  computed: {
    isActive() {
      if (this.cwlocalIdImgs.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    isLi() {
      if (this.cwlocalIdImgs.length >= this.imgNum) {
        return false;
      } else {
        return true;
      }
    }
  },
  inject: ['isloadingshow','isTips'],
  created() {
    this.slice(location.href);
  },
  methods: {
    //确认时间
    sureTime(date){
      var time =date.getFullYear()+'-'+this.add0(date.getMonth()+1)+'-'+this.add0(date.getDate());
      if(this.timeArray.length!=0){
        for(let i =0;i<this.timeArray.length;i++){
          if(this.timeArray[i].time==time){
            this.getActivityInfo(this.timeArray[i].id);
          }
        }
      }
      console.log(time)
    },
    //加0
    add0(e){
      if(e-0>0&&e-0<10){
        return '0'+e
      }
      return e
    },
    //日期禁用
    disabledDate(date){
      var time =date.getFullYear()+'-'+this.add0(date.getMonth()+1)+'-'+this.add0(date.getDate());
      for(let i =0;i<this.timeArray.length;i++){
        if(time==this.timeArray[i].time){
          return false;
        }
      }
      return true
    },
    // 显示日历
    isCalendar(){
      var self =this;
      self.isloadingshow(true);
      let data=JSON.parse(localStorage.getItem('userInfo')).user.userId;
      api.getHistory(data).then(res=>{
        if(res.data.code==200){
          self.isloadingshow(false);
          self.timeArray=res.data.data.all.map((res)=>{
            return {
              time:res.insertTime,
              id:res.pictureWorksId
            }
          });
          self.markDate[0].date=res.data.data.unCheck.map((res)=>{
            return res.insertTime
          });
          console.log(self.markDate)
          self.isShowCalendar=!self.isShowCalendar;
        }
      })
    },
    backHome() {
      this.$router.push('/');
    },
    //删除照片
    delImg(e) {
      this.localIdImgs.splice(e, 1);
      this.cwlocalIdImgs.splice(e, 1);
    },
    //提交
    Submission() {
      if (!this.isActive || this.isClick) {
        return;
      }
      if (this.isUpload === false) {
        return;
      }
      //接口
      if (this.buttonContent == '提交') {
        //提交成功
        this.isClick = true;
        this.addPicture();
      } else {
        //取消提交
        if (this.status == 0) {
          this.delPicture();
        } else {
          return;
        }
      }
    },
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
      this.isloadingshow(true);
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
            jsApiList: ['hideAllNonBaseMenuItem', 'previewImage', 'uploadImage', 'downloadImage', 'chooseImage'] // 必填，需要使用的JS接口列表
          });
          self.wx.ready(function() {
            self.wx.hideAllNonBaseMenuItem();
            self.getActivityInfo();
          });
        } else {
          self.isTips(res.data.msg);
        }
      });
    },
    //获取用户活动状态
    getActivityInfo(e) {
      var self = this;
      var useInfo = JSON.parse(localStorage.getItem('userInfo'));
      if(e){
        var data={
          pictureActivityId: useInfo.pictureActivityId,
          userId: useInfo.user.userId,
          pictureWorksId:e
        }
      }else{
        var data = {
          pictureActivityId: useInfo.pictureActivityId,
          userId: useInfo.user.userId
        };
      }
      api.getActivityInfo(data).then(res => {
        if (res.data.code == 200) {
          self.isloadingshow(false);
          self.isSubmission = res.data.data.isHaveWorks;
          self.dayNum = res.data.data.countDay;
          if (res.data.data.isHaveWorks === false) {
            return;
          } else {
            var imgUrl = [res.data.data.img1Url, res.data.data.img2Url, res.data.data.img3Url];
            self.buttonContent = '删除, 重新上传';
            self.cwlocalIdImgs=[];
            for (let i = 0; i < imgUrl.length; i++) {
              if (imgUrl[i] != '') {
                self.cwlocalIdImgs.push(imgUrl[i]);
              }
            }
            self.textarea = res.data.data.remark;
            self.status = res.data.data.status;
            self.pictureWorksId = res.data.data.pictureWorksId;
          }
        } else {
          self.isTips(res.data.msg);
        }
      });
    },
    //预览图片
    previewImage(e) {
      var self = this;
      this.wx.previewImage({
        current: e,
        urls: self.cwlocalIdImgs
      });
    },
    //选择图片
    add_img(e) {
      var _this = this;
      this.wx.chooseImage({
        count: _this.imgNum - _this.cwlocalIdImgs.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          // 判断 ios
          if (window.__wxjs_is_wkwebview) {
            _this.wxgetLocalImgData(localIds);
          } else {
            localIds.forEach((item, index) => {
              _this.localIdImgs.push(item);
            });
          }
          _this.wxuploadImage(localIds);
        }
      });
    },
    // 上传图片
    wxuploadImage(localIds) {
      let _this = this;
      _this.isUpload = false;
      var i = 0;
      var length = localIds.length;
      var upload = function() {
        let loacId = localIds[i];
        if (window.__wxjs_is_wkwebview) {
          if (loacId.indexOf('wxlocalresource') != -1) {
            loacId = loacId.replace('wxlocalresource', 'wxLocalResource');
          }
        }
        _this.wx.uploadImage({
          localId: loacId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function(res) {
            var serverId = {
              id: '',
              serverid: res.serverId
            };
            _this.uploadImg(res.serverId);
            _this.serverId.push(serverId);
            i++;
            i < length && upload();
          }
        });
      };
      upload();
    },
    //提交作品
    addPicture() {
      var self = this;
      var useInfo = JSON.parse(localStorage.getItem('userInfo'));
      var data = {
        pictureActivityId: useInfo.pictureActivityId,
        userId: useInfo.user.userId,
        img1Url: this.cwlocalIdImgs[0],
        img2Url: this.cwlocalIdImgs[1],
        img3Url: this.cwlocalIdImgs[2],
        remark: this.textarea
      };
      api.addPicture(data).then(res => {
        if (res.data.code == 200) {
          self.pictureWorksId = res.data.data;
          self.isClick = false;
          self.isSubmission = true;
          self.buttonContent = '删除, 重新上传';
        }
      });
    },
    //删除提交的作品
    delPicture() {
      var self = this;
      self.isClick = true;
      api.delPicture(this.pictureWorksId).then(res => {
        if (res.data.code == 200) {
          self.isSubmission = false;
          self.isClick = false;
          self.buttonContent = '提交';
          self.localIdImgs = [];
          self.cwlocalIdImgs = [];
          self.textarea = '';
        }
      });
    },
    //上传图片
    uploadImg(e) {
      var self = this;
      api.uploadImg(e).then(res => {
        if (res.data.code == 200) {
          if (self.isClick === false) {
            self.cwlocalIdImgs.push(res.data.data);
          }
          self.isUpload = true;
        } else {
          self.isTips('图片上传失败');
        }
      });
    },
    //ios获取本地图片接口
    wxgetLocalImgData(localIds) {
      let _this = this;
      var i = 0;
      var length = localIds.length;
      var upload = function() {
        _this.wx.getLocalImgData({
          localId: localIds[i], // 图片的localID
          success: function(res) {
            let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            localData = localData.replace('jgp', 'jpeg');
            _this.localIdImgs.push(localData);
            i++;
            i < length && upload();
          }
        });
      };
      upload();
    }
  }
};
</script>


<style scoped lang="less">
  .rili{
    width: 100%;
    position: fixed;
    bottom: 0;
  }
  .isCalendar{
    position: fixed;
    right: 10px;
    top: 10px;
    width: 70px;
    height: 70px;
    background: url('../../static/rili.png') no-repeat;
    background-size: 100% 100%;
  }
.backHome {
  position: fixed;
  left: 10px;
  top: 10px;
  width: 70px;
  height: 70px;
  background: url('../../static/back.png') no-repeat;
  background-size: 100% 100%;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.tijiao .active,
.tijiao .active2 {
  background-color: #ccc;
  color: dimgray;
}
.review {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 20px;
  background-color: #fafafa;
  border-bottom: solid 2px #ccc;
  p {
    font-size: 35px;
  }
  div {
    width: 250px;
    height: 250px;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.textbottom {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: gray;
  font-size: 25px;
  padding: 0 20px;
  .gth {
    border: solid 3px red;
    border-radius: 50%;
    font-weight: 1000;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
    margin-right: 10px;
  }
}
.home {
  width: 100%;
  height: 100%;
}
.tijiao {
  padding: 20px;
  div {
    background-color: rgb(235, 45, 73);
    color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-sizing: border-box;
  }
}
.textarea {
  padding: 20px;
  padding-bottom: 0;
  border-bottom: solid 2px #ccc;
  background-color: #fafafa;
  div {
    text-align: right;
  }
  .textarea_style {
    border: solid 1px #ccc;
    border-radius: 10px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
}
.gelidai {
  border-top: solid 2px #ccc;
  height: 20px;
  background-color: rgb(240, 240, 240);
  border-bottom: solid 2px #ccc;
}
.dayNum {
  padding: 20px;
  padding-right: 100px;
  display: flex;
  justify-content: flex-end;
  border-bottom: solid 2px #ccc;
  background-color: #fafafa;
}
.upImgTitle {
  background-color: #fafafa;
  padding: 20px;
  .titleRight {
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      width: 40px;
      height: 40px;
      margin: 0;
      margin-right: 10px;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.upImgTitle > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 2px #ccc;
  div {
    margin-bottom: 15px;
  }
}
.addImg {
  background-color: #fafafa;
  padding-top: 20px;
  .imgLi {
    position: relative;
    .close {
      position: absolute;
      right: -15px;
      top: -15px;
      width: 30px;
      height: 30px;
      border: solid 1px red;
      border-radius: 50%;
    }
    .close::before,
    .close::after {
      position: absolute;
      content: ' ';
      background-color: red;
      top: 2.5px;
      left: 14.5px;
      width: 1px;
      height: 25px;
    }
    .close::before {
      transform: rotate(45deg);
    }
    .close::after {
      transform: rotate(-45deg);
    }
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding: 0 20px;
  }
  li {
    width: 149px;
    height: 150px;
    position: relative;
    margin-right: 20px;
    margin-bottom: 20px;
    border: solid 4px #fff;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .add {
    border: dashed 4px #ccc;
    border-radius: 10px;
    position: relative;
  }
  .add::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50px;
    margin-left: -25px;
    margin-top: -5px;
    border-top: 10px solid #ccc;
  }
  .add::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    height: 50px;
    margin-left: -5px;
    margin-top: -25px;
    border-left: 10px solid #ccc;
  }
}
</style>
