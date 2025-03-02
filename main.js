import App from './App'

// #ifndef VUE3
import Vue from 'vue'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.$mount()
// #endif


import messages from './locale/index'
import uviewPlus, {setConfig}  from '@/uni_modules/uview-plus'

// VUE3
// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
const i18n = createI18n({
    legacy: false, //处理报错Uncaught (in promise) SyntaxError: Not available in legacy mode (at message-compiler.esm-bundler.js:54:19)
    locale: uni.getLocale(), // 获取已设置的语言, 'zh'
    globalInjection: true,
	messages
})


export function createApp() {
  const app = createSSRApp(App)
  // 调用setConfig方法，方法内部会进行对象属性深度合并，可以放心嵌套配置
  // 需要在app.use(uview-plus)之后执行
  setConfig({
  	// 修改$u.config对象的属性
  	config: {
  		// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
  		unit: 'rpx'
  	},
  	// 修改$u.props对象的属性
  	props: {
  		// 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
  		radio: {
  			size: 15
  		}
  		// 其他组件属性配置
  		// ......
  	}
  })
  app.use(i18n).use(uviewPlus)
  // app.use(i18n)
  
  return {
    app
  }
}


// #endif

