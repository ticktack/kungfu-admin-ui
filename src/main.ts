import { createApp } from 'vue'
import App from './App.vue'

import '@/styles/reset.scss'
import '@/styles/common.scss'

import '@/assets/iconfont/iconfont.scss'
import '@/assets/fonts/font.scss'

import ElementPlus from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

// element dark(内置暗黑模式)
import 'element-plus/theme-chalk/dark/css-vars.css'
// custom element dark(自定义暗黑模式)
import '@/styles/theme/element-dark.scss'
// custom element css
import '@/styles/element.scss'
// custom directives
import directives from '@/directives/index'
// vue Router
import router from '@/routers/index'
// vue i18n
import I18n from '@/languages/index'
// pinia store
import pinia from '@/stores/index'
// svg icons
import 'virtual:svg-icons-register'
// errorHandler
import errorHandler from '@/utils/errorHandler'

import MainBox from '@/components/MainBox/index.vue'

const app = createApp(App)

app.config.errorHandler = errorHandler

// 注册element Icons组件
Object.keys(Icons).forEach(key => {
	app.component(key, Icons[key as keyof typeof Icons])
})

app.use(router).use(I18n).use(pinia).use(directives).use(ElementPlus).component('MainBox', MainBox).mount('#app')
