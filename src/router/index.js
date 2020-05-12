import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import chat from '@/components/chat'
import upload from '@/components/upload'
import actImg from '@/components/actImg'
import administration from '@/components/redEnvelopes/administration'
import record from '@/components/redEnvelopes/record'
import redEnvelopesReceive from '@/components/redEnvelopes/redEnvelopesReceive'
import recordWeb from '@/components/redEnvelopes/recordWeb'
import redPackDetails from '@/components/redEnvelopes/redPackDetails'

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
			path: '/administration',
			name: 'administration',
			component: administration
		},
		{
			path: '/record',
			name: 'record',
			component: record
		},
		{
			path: '/redEnvelopesReceive',
			name: 'redEnvelopesReceive',
			component: redEnvelopesReceive
		},
		{
			path:'/recordWeb',
			name:'recordWeb',
			component:recordWeb
		},
		{
			path:'/redPackDetails',
			name:'redPackDetails',
			component:redPackDetails
		}
	]
})
