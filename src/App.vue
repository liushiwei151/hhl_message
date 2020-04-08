<template>
  <div id="app">
    <router-view/>
	<elastic :imgUrl="alertImgUrl" v-show='isShow' :class='showAnimate' ></elastic>
	<div class="loading" v-if="isshow"></div>
  </div>
</template>

<script>
	import elastic from './components/alert.vue'
export default {
  name: 'App',
	components:{
		elastic
	},
	provide(){
		return{
			isloadingshow: this.isloadingshow,
			isAlertShow:this.appAlertShow
		}
	},
	data(){
		return{
			isshow: false,
			isShow:false,
			showAnimate:{
				show_in:false,
				 show_out:false
			},
			alertImgUrl:''
		}
	},
	created() {
		this.$router.push('/')
	},
	methods:{
		isloadingshow(e) {
			this.isshow = e;
		},
		appAlertShow(e,f){
			this.isShow=e;
			if(f&&f.type==1){
				this.alertImgUrl=f.url
        // this.alertImgUrl='http://qrhhl.yunyutian.cn/huanghelou1916-images/market_inform_image/96daaecf09e640f29246bf2a1c64d456.jpg'
        // this.alertImgUrl='https://pic.cwyyt.cn/upload/img/20200408/1130553055_icon.png'
			}else if(f&&f.type==2){
			}
			if(e==true){
				this.showAnimate.show_in=e;
				this.showAnimate.show_out=!e
			}else{
				this.showAnimate.show_in=!e;
				this.showAnimate.show_out=e;
			}
		},
		closeAlert(){
			this.isShowAlert=false;
		}
	}
}
</script>

<style>
	.show_in{
	    animation: go_in 1s;
	    opacity: 1;
	}
	 @keyframes go_in
	  {
	     0% {opacity: 0; transform: scale(0);}
	     100%{opacity: 1; transform: scale(1);}

	  }
	  .show_out{
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
body{
	padding: 0;
	margin: 0;
}
.img>img{
	width: 100%;
	height: 100%;
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
	z-index: 9999;
	-moz-border-radius: 20px;
	-webkit-border-radius: 20px;
	border-radius: 20px;
	filter: progid:DXImageTransform.Microsoft.Alpha(opacity=70);
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
