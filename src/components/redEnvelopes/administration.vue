<template>
  <div>
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
        <div class="body-cash"><textarea cols="30" rows="10" maxlength="100" placeholder="恭喜发财,大吉大利" v-model="redPackage.text" /></div>
      </div>
      <div class="hand-footer">
        <button @click="cancel">取消</button>
        <button @click="record">红包纪录</button>
        <button @click="confirm">确认</button>
      </div>
    </div>
    <div v-if="isPassage == -1" class="setPassage">
      <div class="login1"></div>
      <div class="passage">
        <p>{{ passText }}</p>
        <div class="box">
          <input maxlength="4" type="password" v-model="passageNum" />
          <ul>
            <li>{{ passageArray[0] }}</li>
            <li>{{ passageArray[1] }}</li>
            <li>{{ passageArray[2] }}</li>
            <li>{{ passageArray[3] }}</li>
          </ul>
        </div>
      </div>
      <div class="login2"></div>
    </div>
    <div class="passageAlert" v-show="isPassageAlert">
      <div class="tips">
        <p>{{ warningText }}</p>
        <span @click="closeAlert">{{ warningButton }}</span>
      </div>
    </div>
    <!-- 请输入支付密码 -->
    <div class="passageAlert">
      <ul class="payment">
        <li class="firstLi">
          <i></i>
          请输入支付密码
        </li>
        <li class="twoLi">
          <div class="cash"></div>
          <div class="text">
            红包总金额：
            <span>2楼币</span>
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
export default {
  name: 'administration',
  data() {
    return {
      //是否设置了支付密码1设置-1未设置0默认
      isPassage: 1,
      //支付密码
      passageNum: null,
      passText: '请设置支付密码',
      setPassageNum: '',
      //显示弹窗
      isPassageAlert: false,
      //红包内容
      redPackage: {
        cash: '',
        num: '',
        text: ''
      },
      //弹窗警告文本
      warningText: '两次输入的支付密码不一致',
      //弹窗按钮文本
      warningButton: '重新设置',
      paymentPassage: null
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
              this.sendPassage();
            } else {
              this.isPassageAlert = true;
            }
          }
        }
      }
    },
    paymentPassage() {
      if (this.paymentPassage != null && this.paymentPassage.length == 4) {
        console.log(this.paymentPassage);
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
  methods: {
    //取消
    cancel() {
      this.$router.push('/');
    },
    confirm() {
      if (this.redPackage.cash == 0 || this.redPackage.cash == '') {
        this.warningText = '红包金额必须大于0';
        this.warningButton = '知道了';
        this.isPassageAlert = true;
        return;
      }
      if (this.redPackage.num == 0 || this.redPackage.num == '') {
        this.warningText = '红包数量必须大于0';
        this.warningButton = '知道了';
        this.isPassageAlert = true;
        return;
      }
      if (this.redPackage.num - 0 > this.redPackage.cash - 0) {
        this.warningText = '红包金额必须大于' + this.redPackage.num;
        this.warningButton = '知道了';
        this.isPassageAlert = true;
        return;
      }
      console.log('支付密码');
    },
    record() {},
    //发送支付密码
    sendPassage() {
      //发送密码接口
      this.isPassage = 1;
    },
    //关闭弹窗
    closeAlert() {
      this.isPassageAlert = false;
      this.passageNum = null;
      this.setPassageNum = '';
      this.passText = '请设置支付密码';
    }
  }
};
</script>

<style scoped lang="less">
.passageAlert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(70, 70, 70, 0.6);
  z-index: 99;
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
        left: 5px;
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
        padding-bottom: 10px;
        span {
          color: red;
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
    p {
      font-size: 35px;
      color: #4d4d4d;
      text-align: center;
      line-height: 13vh;
      margin: 0;
      white-space: nowrap;
    }
    span {
      display: inline-block;
      font-size: 25px;
      color: #589bdc;
      width: 100%;
      height: 7vh;
      line-height: 7vh;
      text-align: center;
      border-top: 1px solid #ccc;
    }
  }
}
.setPassage {
  background: url(../../../static/envelopes/login.png) no-repeat;
  background-size: 100% 100%;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: 25vh;

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
      height: 4vh;
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
        border-bottom: solid 0.5vh #fff;
        margin-right: 10px;
        font-size: 4vh;
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
    height: 11.7vh;
    z-index: 5;
    margin-bottom: 2vh;
  }
  .login2 {
    background: url(../../../static/envelopes/login3.png) no-repeat;
    background-size: 100% 100%;
    width: 358px;
    height: 5.92vh;
    z-index: 5;
    position: absolute;
    bottom: 10vh;
  }
}
.hand {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgb(235, 235, 235);
  .hand-title {
    height: 7vh;
    line-height: 7vh;
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
      height: 6vh;
      line-height: 6vh;
      color: #fff;
      font-size: 35px;
      border-radius: 10px;
      z-index: 80;
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
