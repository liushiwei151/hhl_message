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
    methods:{
		//打开红包
		openRedPack(){
			let data={
				redPacketId:'',
				memberNo:'',
				// openid:this.userInfo.
			}
			api.openRedPack(data).then(res=>{
				if(res.data.code==200){
					
				}else{
					this.isTips(res.data.msg)
				}
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
