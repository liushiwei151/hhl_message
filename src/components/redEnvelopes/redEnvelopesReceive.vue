<template>
  <div class='redEnvelopesReceive'>
    <div class='redEnvelopes' @click="gotoWeb('recordWeb')"></div>
    <div class='back' @click="gotoWeb('/')"></div>
  </div>
</template>

<script>
  export default{
    name:'redEnvelopesReceive',
    methods:{
      gotoWeb(e){
        this.$router.push(e)
      }
    }
  }
</script>

<style lang="less" scoped>
.redEnvelopesReceive{
  background: url(../../../static/envelopes/shareBackground.png) no-repeat;
  background-size: 100% 100%;
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .back{
 background: url(../../../static/back.png) no-repeat;
    background-size: 100% 100%;
    width: 86px;
    height: 86px;
    position: absolute;
    top: 15px;
    left: 15px;
  }
  .redEnvelopes{
    background: url(../../../static/envelopes/share.png) no-repeat;
    background-size: 100% 100%;
    width: 487px;
    height: 631px;
  }
}
</style>
