<template>
  <div class="investigationWeb">
    <div class='backHome' @click="backHome"></div>
    <!-- 初始开始不同状态页面 -->
    <div class="start" v-if="status.text!==''">
      <i :style="{ backgroundImage: 'url(./static/' + status.type + ')' }"></i>
      <p>{{status.text}}</p>
      </div>
    <!-- 初始开始页面 -->
    <div v-show="nowWeb === 0" class="startWeb" :style="{ backgroundImage: 'url(' + startBg + ')' }"><button @click="start()"></button></div>
    <div class="box" v-show="!(nowWeb === 0)">
      <div class="title">{{ nowWeb }}/{{ question.length }}</div>
      <div v-if="nowWeb === index + 1" class="body" v-for="(item, index) in question" :key="index">
        <div class="content">
          <span>{{ item.topic }}</span>
        </div>
        <ul v-if="item.type === 2" class="type1">
          <li v-for="(a, b) in item.options" :key="b" :class="item.answer === a.optionName ? 'active' : ''" @click="single(index, a.optionName)">{{ a.optionName }}</li>
        </ul>
        <ul v-if="item.type === 3" class="type2">
          <li v-for="(c, d) in item.options" :key="d" :class="item.answer[d] ? 'active' : ''" @click="multipl(index, d)">{{ c.optionName }}</li>
        </ul>
        <div v-if="item.type === 1" class="type0">
          <div class="textareaBox"><textarea :placeholder="item.prompt" maxlength="150" v-model="item.answer" /></div>
          <div class="textareaLength">{{ item.answer.length }}/150</div>
        </div>
      </div>
      <div class="footer">
        <button @click="goWeb('previous')">返回上一题</button>
        <button @click="ansNext()">{{ nextButton }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../getapi.js";
export default {
  name: "investigationWeb",
  data() {
    return {
      //当前是第几页 开始页面是0
      nowWeb: 0,
      //首页背景页面
      startBg: "",
      //问题 type 1输入，2单选3多选 content 问题文本 choice选择题内容type0时为空
      question: [
        { type: 1, topic: "测试", options: [], prompt: "123", answer: "" },
        { type: 2, topic: "测试1单选", options: ["123456", "234567"], prompt: "", answer: "" },
        { type: 3, topic: "测试2多选", options: ["3456789", "456789", "999999"], prompt: "", answer: [false, false, true] }
      ],
      answer: [],
      userInfo: {},
      //是否调取成功其中一个api
      isApi: false,
      //是否能点击开始按钮
      isStart:true,
      //当前问卷调查状态
      status:{
        text:"",
        type:0
      }
    };
  },
  inject: ["isTips", "isloadingshow"],
  computed: {
    nextButton() {
      if (this.nowWeb >= this.question.length) {
        return "提交问卷";
      } else {
        return "回答下一题";
      }
    }
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // this.getQuestionInfo();
    this.getQuestionnaire();
  },
  methods: {
    backHome(){
      this.$router.push('/')
    },
    //双接口同步
    getQuestionnaire() {
      let arr = [];
      let self = this;
      let data = {
        id: this.userInfo.questionnaireId,
        openid: this.userInfo.user.openid
      };
       this.isloadingshow(true);
      arr.push(api.questionnaire(data.id));
      arr.push(api.questionInfo(data));
      Promise.all(arr).then(arrs => {
        for (let i in arrs) {
          if (arrs[i].data.code === 200) {
            if (i === "0") {
              self.question = arrs[i].data.data.map(res => {
                if (res.type === 3) {
                  var arr1 = [];
                  for (let p in res.options) {
                    arr1.push(false);
                  }
                }
                return {
                  type: res.type,
                  topic: res.topic,
                  options: res.options,
                  prompt: res.prompt,
                  questionId:res.questionId,
                  answer: res.type === 3 ? arr1 : ""
                };
              });
            } else if (i === "1") {
              self.startBg = arrs[i].data.data.cover;
              self.isloadingshow(false);
            }
          } else {
            // self.isTips(arrs[i].data.msg);
            self.isloadingshow(false);
            self.isStart=false;
            if(arrs[i].data.code===6004){
              self.status={
                text:"您已填写过此问卷！",
                type:"peo1.png"
              }
            }else if(arrs[i].data.code===6003){
              self.status={
                text:"问卷已结束！",
                type:"peo2.png"
              }
            }else if(arrs[i].data.code===6002){
              self.status={
                text:"问卷暂未开始！",
                type:"peo4.png"
              }
            }else if(arrs[i].data.code===6001){
              self.status={
                text:"问卷不存在！",
                type:"peo3.png"
              }
            }
          }
        }
      });
    },
    //开始
    start(){
      if(this.isStart){
        this.goWeb(1);
      }else{
        this.isTips('您已填写过此问卷！')
      }
    },
    //去往哪一页
    goWeb(e) {
      if (typeof e === "number") {
        this.nowWeb = e;
      } else if (e === "add") {
        this.nowWeb++;
      } else if (e === "previous") {
        this.nowWeb--;
      }
    },
    //回答下一题
    ansNext() {
      let data = this.question[this.nowWeb - 1];
      let self = this;
      if (this.nextButton === "提交问卷") {
        this.isloadingshow(true);
        if (data.type === 3 && data.answer.indexOf(true) < 0) {
          this.isTips("请填写此题目！");
          this.isloadingshow(false);
        } else {
          //todo 转换数据调取接口
          let answer =this.question.map(res=>{
            let ans =res.answer;
            if(typeof ans==='object'){
              let anss = [];
              for(let s in res.options){
                if(res.answer[s]){
                  anss.push(res.options[s].optionName);
                }
              }
              ans =anss.toString().replace(/,/g,'&');
            }
            return{
              questionId:res.questionId,
              answer:ans
            }
          });
          let data = {
            id: this.userInfo.questionnaireId,
            openid: this.userInfo.user.openid,
            answer:answer
          };
          api.answers(data).then((res) => {
            this.isloadingshow(false);
            if (res.data.code === 200) {
              self.isTips('提交成功!');
              setTimeout(()=>{
                self.$router.push('/');
              },2000)
            } else {
              self.isTips(res.data.msg);
            }
          });
        }
      } else if (this.nextButton === "回答下一题") {
        if (data.answer === "" || data.answer === undefined || data.answer === null) {
          this.isTips("请填写此题目！");
        } else {
          if (data.type === 3 && data.answer.indexOf(true) < 0) {
            this.isTips("请填写此题目！");
          } else {
            this.goWeb("add");
          }
        }
      }
    },
    //单选
    single(e, f) {
      this.$set(this.question[e], "answer", f);
    },
    // 多选
    multipl(e, f) {
      let a = JSON.parse(JSON.stringify(this.question[e].answer));
      a[f] = !a[f];
      this.question[e].answer = a;
    }
  }
};
</script>

<style scoped lang="less">
.investigationWeb {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  background-color: #f0f0f0;
  .start{
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    padding-bottom: 200px;
    p{
      font-size: 40px;
      padding-left: 5vw;
    }
    i{
      display: block;
      width: 212px;
      height: 351px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .backHome{
    position: fixed;
    left: 10px;
    top: 10px;
    width: 86px;
    height: 86px;
    background: url(../../../static/back.png) no-repeat;
    background-size: 100% 100%;
    z-index: 100;
  }
  .startWeb {
    position: fixed;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    button {
      background: url(../../../static/btn_gz_start.png) no-repeat;
      background-size: 100% 100%;
      border: none;
      width: 520px;
      height: 147px;
      position: absolute;
      left: 115px;
      bottom: 100px;
      outline: none;
    }
  }
  .box {
    .title {
      background-color: #f96464;
      color: #fff;
      padding: 20px 0;
      font-size: 40px;
    }
    .body {
      padding: 0 30px;
      li {
        height: 100px;
        text-align: left;
        line-height: 100px;
        padding: 0 20px;
        box-sizing: border-box;
        border: 1px #cecece solid;
        border-radius: 8px;
        box-shadow: 0 2px 2px #dcdcdc;
        background: #fff;
        font-size: 30px;
        color: #666666;
        margin-bottom: 50px;
      }
      .active {
        border: 1px #dfa4a4 solid;
        box-shadow: none;
        background: #f96464;
        color: #fff;
      }
      .content {
        box-sizing: border-box;
        padding: 30px 0;
        font-size: 38px;
        font-weight: 520;
        margin-bottom: 50px;
        span {
          display: block;
          text-align: left;
        }
      }
      .type0 {
        .textareaLength {
          text-align: right;
          padding: 0 10px;
          box-sizing: border-box;
          margin: 20px 0;
        }
        .textareaBox {
          height: 200px;
        }
        textarea {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: 1px #c9c9c9 solid;
          border-radius: 10px;
          font-size: 40px;
          padding: 10px;
        }
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0 30px;
      button {
        border: none;
        width: 300px;
        height: 100px;
        line-height: 100px;
        font-size: 40px;
        white-space: nowrap;
        color: #fff;
        text-align: center;
        background: #f96464;
        border-radius: 100px;
        outline: none;
        box-shadow: 0 3px 6px #e54d4d;
      }
    }
  }
}
</style>
