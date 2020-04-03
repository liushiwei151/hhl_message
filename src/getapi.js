import axios from 'axios'
import qs from 'qs'
// axios.defaults.timeout = 3000; //响应时间
 axios.defaults.baseURL = 'http://qrhhl.yunyutian.cn/huanghelou1916-market/market';   //配置接口地址
axios.defaults.withCredentials = true;

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if(config.method  === 'post'){
        // config.data = qs.stringify(config.data);
    }
    return config;
},(error) =>{
    alert('错误的传参')
    return Promise.reject(error);
});

/*const jsSign =(url)=>{
	return axios.get('/yq/jsSign',{
		params:url
	})
}
const start =(data)=>{
	return axios.post('/yq/shout/start',data)
}*/
//进入页面获取
const openHome=()=>{
	return axios.get('/index/info/oXslc08kYzfJOxRnOpnCQR4EYULU/0/0')
}
const market=(data)=>{
	return axios.get('/index/info/'+data.openid+'/'+data.latitude+'/'+data.longitude)
}
//获取wxsjdk权限
const getJsSign=(data)=>{
	return axios.get('/index/getJsSign',{
		params:{
			url:data
		}
	})
}
//获取客户留言
const getChat=(data)=>{
	return axios.get('/message/getMessage/'+data)
}
//测试发送消息
const send=(data)=>{
	return axios.post('/message/send',data,{
		headers: {
		      'Content-Type': 'application/json',
		    }
	})
}
export default {
	openHome,
	market,
	getJsSign,
	getChat,
	send
}
