<template>
  <div class="investigationWeb">
    <!-- 初始开始页面 -->
    <div v-show="nowWeb === 0" class="startWeb" :style="{ backgroundImage: 'url(' + startBg + ')' }"><button @click="goWeb(1)"></button></div>
    <div class='box'>
      <div class='title'>{{ nowWeb }}/{{ question.length }}</div>
      <div v-if='nowWeb===(index+1)' class='body' v-for="(item,index) in question" :key='index'>
        <div class='content'><span>{{item.content}}</span></div>
        <ul v-if="item.type===1" class='type1'>
          <li v-for="(a,b) in item.choice" :key="b" :class="item.answer===b?'active':''" @click="single(index,b)">{{a}}</li>
        </ul>
        <ul v-if='item.type===2' class='type2'>
          <li v-for="(c,d) in item.choice" :key="d" :class="item.answer[d]?'active':''" @click="multipl(index,d)">{{c}}</li>
        </ul>
        <div v-if='item.type===0' class='type0'>
          <div class='textareaBox'><textarea  :placeholder="item.textareaPlaceholder" maxlength="150" v-model="item.answer"/></div>
          <div class='textareaLength'>{{item.answer.length}}/150</div>
        </div>
      </div>
      <div class='footer'>
        <button @click="goWeb('previous')">返回上一题</button><button @click="ansNext()">{{nextButton}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  name:'investigationWeb',
  data(){
    return{
      //当前是第几页 开始页面是0
      nowWeb:1,
      //首页背景页面
      startBg:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1590632412&di=210d7391194c6f17967c2c75a3495247&src=http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg'
      //问题 type 0输入，1单选2多选 content 问题文本 choice选择题内容type0时为空
      ,question:[{type:0,content:'测试',choice:[],textareaPlaceholder:'123',answer:''},
      {type:1,content:'测试1单选',choice:['123456','234567'],textareaPlaceholder:'',answer:''},
      {type:2,content:'测试2多选',choice:['3456789','456789','999999'],textareaPlaceholder:'',answer:[false,false,true]}]
    ,answer:[]
    }
  },
  inject:['isTips'],
  computed:{
    nextButton(){
      if(this.nowWeb>=this.question.length){
        return '提交问卷'
      }else{
        return '回答下一题'
      }
    }
  },
  mounted() {
  },
  methods:{
    //去往哪一页
    goWeb(e){
      if(typeof e === 'number'){
        this.nowWeb = e;
      }else if(e === 'add'){
        this.nowWeb++;
      }else if(e === 'previous'){
        this.nowWeb--;
      }
    },
    //回答下一题
    ansNext(){
      let data =this.question[this.nowWeb-1]
      if(this.nextButton==='提交问卷'){
        //todo 转换数据调取接口
        console.log(this.question);
      }else if (this.nextButton==='回答下一题'){
       if(data.answer===''||data.answer===undefined||data.answer===null){
          this.isTips('请填写此题目！')
        }else{
          if(data.type===2&&data.answer.indexOf(true)<0){
           this.isTips('请填写此题目！')
          }else{
            this.goWeb('add');
          }
        }
      }
    },
    //单选
    single(e,f){
      this.question[e].answer=f;
    },
    // 多选
    multipl(e,f){
      let a =JSON.parse(JSON.stringify(this.question[e].answer));
      a[f]=!a[f];
      this.question[e].answer=a;
    }
  }
}
</script>

<style scoped lang="less">
.investigationWeb {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  background-color: #f0f0f0;
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
    }
  }
  .box{
   .title{
     background-color: #f96464;
     color:#fff;
     padding: 20px 0;
     font-size: 40px;
   } 
   .body{
     padding: 0 30px;
     li{
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
     .active{
       border: 1px #dfa4a4 solid;
           box-shadow: none;
           background: #f96464;
           color: #fff;
     }
     .content{
       box-sizing: border-box;
       padding: 30px 0;
       font-size: 38px;
       font-weight: 520;
       margin-bottom: 50px;
       span{
         display: block;
         text-align: left;
       };
     }
     .type0{
       .textareaLength{
         text-align: right;
         padding: 0 10px;
         box-sizing: border-box;
         margin: 20px 0;
       }
       .textareaBox{
         height: 200px;
       }
       textarea{
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
  .footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 30px;
    button{
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
