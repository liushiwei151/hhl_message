import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import chat from '@/components/chat'
import upload from '@/components/upload'
import actImg from '@/components/actImg'
import administration from '@/components/redEnvelopes/administration'

Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			name: 'home',
			component: home
		}, {
			path: '/chat',
			name: 'chat',
			component: chat
		},
		{
			path: '/upload',
			name: 'upload',
			component: upload
		},
		{
			path: '/actImg',
			name: 'actImg',
			component: actImg

		},
    {
      path:'/administration',
      name:'administration',
      component:administration
    }
	]
})
