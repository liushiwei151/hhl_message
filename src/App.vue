<template>
  <div id="app">
    <router-view/>
	<elastic v-show='isShow' :class='showAnimate'></elastic>
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
			isAlertShow:this.appAlertShow
		}
	},
	data(){
		return{
			isShow:false,
			showAnimate:{
				show_in:false,
				 show_out:false
			}
		}
	},
	methods:{
		appAlertShow(e){
			this.isShow=e;
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
</style>
