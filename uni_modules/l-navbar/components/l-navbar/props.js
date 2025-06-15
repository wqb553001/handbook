export default {
	props: {
		// 是否自动返回
		autoBack: {
			type: Boolean,
			default: true
		},
		// 固定在顶部时，是否生成一个等高元素，以防止塌陷
		placeholder: {
			type: Boolean,
			default: true
		},
		// 是否固定在顶部
		fixed: {
			type: Boolean,
			default: true
		},
		// 导航栏高度
		height: {
			type: [String, Number],
			default: 44
		},
		// 背景色
		background: {
			type: String,
			default: "#ffffff"
		},
		// 左侧文字 （缩写）
		leftText: {
			type: String,
			default: '返回'
		},
		// 左侧文字 （全部）
		leftTextFull: {
			type: String,
			default: ''
		},
		// 左侧文字颜色
		leftColor: {
			type: String,
			default: '#000000'
		},
		// 右侧文字内容
		rightText: {
			type: String,
			default: '北京'
		},
		// 右侧文字颜色
		rightColor: {
			type: String,
			default: '#9d9d9d'
		},
		// 导航栏标题
		title: {
			type: String,
			default: '首页'
		},
		// title文字颜色
		titleColor: {
			type: String,
			default: '#000000'
		},
		// icon颜色
		iconColor: {
			type: String,
			default: '#000000'
		},
		// icon颜色
		fontSize: {
			type: [String, Number],
			default: 24
		},
		// 是否展示左侧区域
		showLeft: {
			type: Boolean,
			default: true
		},
		// 是否展示中间区域
		showMid: {
			type: Boolean,
			default: true
		},
		// 是否展示右侧区域
		showRight: {
			type: Boolean,
			default: false
		},
		// 是否展示自定义搜索
		search: {
			type: Boolean,
			default: false
		},
		// 搜索框是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		// 搜索框样式
		searchStyle: {
			type: String,
			default: 'color: #000000'
		},
		// 搜索框placeholder内容
		placeholderText: {
			type: String,
			default: '请输入'
		},
		// placeholder 样式 
		placeholderStyle: {
			type: String,
			default: 'color: #757575'
		},
		// 搜索框背景色
		searchBgColor: {
			type: String,
			default: '#ffffff'
		},
		// 搜索框高度 px
		searchHeight: {
			type: [String, Number],
			default: 28
		},
		// 搜索框宽度 px
		searchWidth: {
			type: [String, Number],
			default: '180px'
		},
		// 搜索框圆角 （px）
		radius: {
			type: [String, Number],
			default: 30
		},
		// 搜索框左侧图标颜色
		searchLeftColor: {
			type: String,
			default: '#757575'
		},
		// 是否展示搜索框边框
		border: {
			type: Boolean,
			default: true
		},
		// 边框样式 仅支持 border属性
		borderStyle: {
			type: String,
			default: '1px solid #797979'
		},
		// 控制左侧宽度
		leftWidth: {
			type: String,
			default: '200px' // 默认宽度（根据原右侧宽度调整）
		},
		// 控制中间区域平移量
		centerMargin: {
			type: String,
			default: '80px' // 默认平移距离（根据需求调整）
		},
		// 输入延迟change
		debounceDelay: {
			type: Number,
			default: 2000 // 默认 2000ms
		}

	}
}