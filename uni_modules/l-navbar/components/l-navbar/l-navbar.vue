<template>
	<view class="l_navbar">
		<view v-if="fixed&&placeholder">
			<view :style="{height:navbarHeight}"></view>
		</view>
		<view class="l_navbar_content"
			:style="{height:navbarHeight, background:background, paddingTop: statusBarHeigh+'px', fontSize: '24px' }"
			:class="[fixed && 'l_navbar_fixed']">
			<view class="l_navbar_content_left" :style="{width: leftWidth}">
				<slot name="left">
					
					<!-- <view class="flex">
						<span class="L_icon" :style="{color:iconColor}">&#xe6ba;</span>
						<span class="L_icon text" :style="{color:leftColor}">{{leftText}}</span>
					</view>
					<view class="l_navbar_content_right_flex">
						<span class="L_icon text">&#xe624;</span>
						<span class="L_icon text" :style="{color:rightColor}">{{rightText}}</span>
					</view> -->
					<view class="l_navbar_content_right_flex" style="display: flex;">
						<view @tap="leftClick" v-if="$slots.left||showLeft">
							<span class="L_icon" :style="{color:iconColor}">&#xe6ba;</span>
						</view>
						
						<view @tap="midClick" v-if="$slots.mid||showMid">
							<span class="L_icon" :style="{color:iconColor, fontSize: fontSize+'px'}">&#xe624;</span>
							<span class="L_icon text" @longpress="longPressCopyText(leftTextFull)" :style="{color:leftColor, fontSize: fontSize+'px'}">{{leftText}}</span>
						</view>
					</view>
				</slot>
			</view>
			<view class="l_navbar_content_center">
				<!-- 自定义搜索框 -->
				<view class="l_navbar_content_search" v-if="search"
					:style="{backgroundColor:searchBgColor, borderRadius:utilsCheck(radius), height:utilsCheck(searchHeight), width:utilsCheck(searchWidth), border:border?borderStyle:null, marginLeft:centerMargin}">
					<slot name="searchLeft">
						<span class="L_icon search_left_icon" :style="{color:searchLeftColor}">&#xe6bb;</span>
					</slot>
					<input type="text" class="l_navbar_content_search_input" :placeholder-style="placeholderStyle"
						:style="searchStyle" confirm-type="search" :value="searchValue" :placeholder="placeholderText"
						:disabled="disabled" @input="onInput" @blur="onBlur" @focus="onFocus" @confirm="onConfirm" />
				</view>
				<!-- 自定义内容 -->
				<slot name="center" v-else>
					<span class="L_icon text" :style="{color:titleColor}">{{title}}</span>
				</slot>
			</view>
			<!-- <view class="l_navbar_content_right" v-if="$slots.right||showRight" @click="rightClick">
				<slot name="right">
					<view class="l_navbar_content_right_flex">
						<span class="L_icon text">&#xe624;</span>
						<span class="L_icon text" :style="{color:rightColor}">{{rightText}}</span>
					</view>
				</slot>
			</view> -->
		</view>
	</view>
</template>

<script>
	import props from "./props.js"
	import utils from "./utils.js"
	/**
	 * @property {Boolean}			autoBack			是否自动返回 （默认 true ）
	 * @property {Boolean}			placeholder			固定在顶部时，是否生成一个等高元素，以防止塌陷 （默认 true ）
	 * @property {Boolean}			fixed				是否固定在顶部 （默认 true ）
	 * @property {Number|String}	height				导航栏高度 （默认 44 ）
	 * @property {String}			background			背景色 （默认 #ffffff ）
	 * @property {String}			leftText			左侧文字 （根据缩放比例，省略）
	 * @property {String}			leftTextFull		左侧文字 （全称）
	 * @property {String}			leftColor			左侧文字颜色 （默认 #000000 ）
	 * @property {String}			rightColor			右侧文字颜色 （默认 #9d9d9d ）
	 * @property {String}			title				导航栏标题 （默认 首页 ）
	 * @property {String}			titleColor			title文字颜色 （默认 #000000 ）
	 * @property {Number|String}	fontSize			字体大小 （默认 24 ）
	 * @property {String}			iconColor			icon颜色 （默认 #000000 ）
	 * @property {Boolean}			showLeft			是否展示左侧区域 （默认 true ）
	 * @property {Boolean}			showMid				是否展示中间区域 （默认 true ）
	 * @property {Boolean}			showRight			是否展示右侧区域 （默认 false ）
	 * @property {Boolean}			search				是否展示自定义搜索 （默认 false）
	 * @property {Boolean}			disabled			搜索框是否禁用 （默认 false）
	 * @property {String}			searchStyle			搜索框样式 （默认 color: #00000）
	 * @property {String}			placeholderText		搜索框placeholder内容 （默认 请输入）
	 * @property {String}			placeholderStyle	搜索框placeholder样式 （默认 color: #757575）
	 * @property {String}			searchBgColor		搜索框背景色 （默认 #ffffff）
	 * @property {Number|String}	searchHeight		搜索框高度 px （默认 28）
	 * @property {Number|String}	searchWidth			搜索框高度 px （默认 180px）
	 * @property {Number|String}	radius				搜索框圆角 px （默认 30）
	 * @property {String}			searchLeftColor		搜索框左侧图标颜色 （默认 #757575）
	 * @property {Boolean}			border				是否展示搜索框边框 （默认 true）
	 * @property {String}			borderStyle			边框样式 仅支持 border属性 （默认 1px solid #797979）
	 *
	 * @event {Function} leftClick 		点击返回
	 * @event {Function} midClick 		点击中间
	 * @event {Function} change 		当键盘输入时，触发input事件
	 * @event {Function} blur 			输入框失去焦点时触发
	 * @event {Function} focus 			输入框聚焦时触发
	 * @event {Function} confirm 		点击完成按钮时触发
	 * @event {Function} rightClick 	点击右侧区域
	 * @example <l-navbar title="首页"></l-navbar>
	 */
	export default {
		mixins: [props],
		//#ifdef MP-WEIXIN
		options: {
			styleIsolation: 'shared' //微信小程序解除样式隔离
		},
		// #endif
		data() {
			return {
				searchValue: null, //搜索框 
				debounceTimer: null, // 定时器引用
			}
		},
		computed: {
			// 获取系统状态栏高度
			statusBarHeigh() {
				return uni.getSystemInfoSync().statusBarHeight
			},
			navbarHeight() {
				let that = this;
				return uni.getSystemInfoSync().statusBarHeight + that.height + 'px'
			},
		},
		methods: {
			// 单位验证
			utilsCheck(value) {
				if (utils) return utils.checkPxNum(value)
				return null
			},
			// 点击左侧
			midClick() {
				console.log("点击中间")
				// 如果配置了autoBack，自动返回上一页
				this.$emit('midClick')
			},
			leftClick(){
				if (this.autoBack) {
					uni.navigateBack()
				}
				// uni.navigateBack()
			},
			// 当键盘输入时，触发input事件
			onInput(e) {
				let {
					value = ""
				} = e.detail || {};
				this.searchValue = value
				
				// 清除之前的定时器（关键步骤）
				if (this.debounceTimer) {
					clearTimeout(this.debounceTimer);
				}
				this.$nextTick(() => {
					this.debounceTimer = setTimeout(()=> {
						this.$emit("change", value);
					}, this.debounceDelay);
				});
			},
			// 组件销毁时清理定时器
			beforeDestroy(){
			  if (this.debounceTimer) {
				clearTimeout(this.debounceTimer);
			  }
			},
			// 输入框失去焦点时触发
			onBlur(event) {
				this.$emit("blur", event.detail.value);
			},
			// 输入框聚焦时触发
			onFocus(event) {
				this.$emit("focus");
			},
			// 点击完成按钮时触发
			onConfirm(event) {
				this.$emit("confirm", this.searchValue);
			},
			// 点击右侧区域
			rightClick() {
				this.$emit('rightClick')
			},
			// 长按复制
			longPressCopyText(val){
				uni.setClipboardData({
					data: val,
					success() {
						uni.showToast({
							title:'已复制到剪贴板',
							icon:'none',
							position:'top'
						});
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import url(../static/index.css);

	.l_navbar {
		position: relative;
		// overflow: hidden;
		width: 100%;



		&_content {
			box-sizing: border-box;
			position: absolute;
			top: 0;
			width: 100%;
			display: flex;
			align-items: center;
			padding: 0 12px;

			.text {
				font-size: 16px;
				font-weight: 500;
				color: #000000;
				margin-left: 4px;
			}

			.flex {
				display: flex;
				align-items: center;
			}

			&_left {
				position: absolute;
				left: 12px;
			}

			&_center {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			&_search {
				display: flex;
				align-items: center;

				.search_left_icon {
					margin: 0 6px;
				}

				&_input {
					flex: 1;
					height: 100%;
					font-size: 14px;
				}
			}

			&_right {
				position: absolute;
				right: 12px;
			}
		}

		.l_navbar_fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9999; /* 提升层级，避免被其他元素覆盖 */
			width: 100%; /* 确保宽度铺满 */
		}
	}
</style>