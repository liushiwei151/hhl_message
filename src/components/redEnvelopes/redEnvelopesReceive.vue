<template>
  <div class='redEnvelopesReceive'>
    <div class='redEnvelopes' @click="openRedPack"></div>
    <div class='back' @click="gotoWeb('/')"></div>
  </div>
</template>

<script>
	import api from '../../getapi.js'
  export default{
    name:'redEnvelopesReceive',
	data(){
		return{
			//客户信息
			userInfo:''
		}
	},
	created() {
		this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
	},
	inject: ['isTips'],
    methods:{
		//打开红包
		openRedPack(){
      const jwd =JSON.parse(localStorage.getItem('jwdcode'));
			let data={
				redPacketId:this.userInfo.redPacketId,
				memberNo:this.userInfo.user.memberNo,
				openid:this.userInfo.user.openid
			}
      let data2={
        longitude:jwd.jd,
        latitude:jwd.wd,
      }
			api.openRedPack(data,data2).then(res=>{
				this.$router.push('recordWeb');
				localStorage.setItem('resData',JSON.stringify(res.data))
			})
		},
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
