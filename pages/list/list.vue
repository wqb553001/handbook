<template>
	<view>
		<view class="uni-form-item uni-column">
			<view class="uni-input-wrapper">
				<!-- <input class="uni-input" style="background-color: #F6FCFC;margin-right: 40rpx;" placeholder="有什么好方法？" :value="inputClearValue" @input="clearInput" /> -->
				<input class="uni-input" style="height: 60rpx;background-color: #F6FCFC;margin-right: 40rpx;" placeholder="有什么好方法？" />
				<!-- <text class="uni-icon" v-if="showClearIcon" @click="clearIcon"></text> -->
			</view>
		</view>
		<view style="margin-left:20rpx;">分类：{{content1.type}}</view>		
		<view style="margin-top: 50rpx;">
			<view>
				<h3 style="margin-bottom: 10rpx;">【{{content1.subject}}】:</h3>
				<view style="display: flex;">
					<!-- image 默认宽度 320px、高度 240px -->
					<image src="../../static/img/work-flow.png" mode="aspectFit" ></image>
					<navigator url="../desc/desc" open-type="navigate" >
						<image src="../../static/img/right-direct.png" mode="aspectFit" style="width: 120rpx;background-color: #F6FCFC;"></image>
					</navigator>
				</view>
				
			</view>
			<view class="buten" style="display: inline;display: flex;border-bottom:2px solid #e8e8e8;">
				<text style="margin-left:10rpx;">评分：80</text>
				<text style="margin-left: 50rpx;">热度：超百</text>
				<button class="bbtn used" type="primary" >使用</button>
			</view>
		</view>
 
		<view style="margin-top: 50rpx;">
			 <view>
				<h3>【{{content2.subject}}】:</h3>
				<view style="display: flex;">
					<image src="../../static/img/smart-engine.png" mode="aspectFit" ></image>
					<navigator url="../desc/desc" open-type="navigate" >
						<image src="../../static/img/right-direct.png" mode="aspectFit" style="width: 120rpx;background-color: #F6FCFC;"></image>
					</navigator>
				</view>
			 </view>
			 <view class="buten" style="display: inline;display: flex;border-bottom:2px solid #e8e8e8;">
				<text>评分：92</text>
				<text style="margin-left: 50rpx;">热度：越千</text>
				<button class="bbtn used" >使用</button>
			 </view>
		 </view>
		 <view style="margin: 50rpx 0rpx;">
			 <view>
				<h3 style="margin-bottom: 10rpx;">【做事优先级】:</h3>
				<view style="display: flex;">
					<image src="../../static/img/four-piece-do-thing.png" mode="aspectFit" ></image>
					<navigator url="../desc/desc" open-type="navigate" >
						<image src="../../static/img/right-direct.png" mode="aspectFit" style="width: 120rpx;background-color: #F6FCFC;"></image>
					</navigator>
				</view>
			</view>
			<view class="buten" style="display: inline;display: flex;border-bottom:2px solid #e8e8e8;">
				<text style="margin-left:10rpx;">评分：86</text>
				<text style="margin-left: 50rpx;">热度：上万</text>
				<button class="bbtn used" >使用</button>
			</view>
		</view>
		<view style="margin: 50rpx 0rpx;">
			 <view>
				<h3 style="margin-bottom: 10rpx;">【七招养成读书好习惯】:</h3>
				<view style="display: flex;">
					<image src="../../static/img/seven-style-have-goog-habit.png" mode="aspectFit" ></image>
					<navigator url="../desc/desc" open-type="navigate" >
						<image src="../../static/img/right-direct.png" mode="aspectFit" style="width: 120rpx;background-color: #F6FCFC;"></image>
					</navigator>
				</view>
			</view>
			<view class="buten" style="display: inline;display: flex;border-bottom:2px solid #e8e8e8;">
				<text style="margin-left:10rpx;">评分：86</text>
				<text style="margin-left: 50rpx;">热度：上万</text>
				<button class="bbtn used" bindtap="send" @click="send" type="primary" >使用</button>
			</view>
		</view>
		 
		 
	</view>
</template>


<script>
import axios from 'axios';
    export default {
        data() {
            return {
                title: 'input',
                focus: false,
                inputValue: '',
                showClearIcon: false,
                inputClearValue: '',
                changeValue: '',
                showPassword: true,
                src: '../../../static/eye-1.png',
                platform: '',
                isNvue: false,
				contentTypeMain:['学习','工作','生活'],
				contentTypeTree1:['语文','数学','英语','物理','化学','体育','美术','政治','地理','历史'],
				contentTypeTree2:['作文','识字','拼音','文言文','诗词鉴赏','阅读理解'],
				contentType:{feild1:'feild1',feild2:'feild2',feild3:'feild3'},
				content1:{
					type:"工作",
					subject:"工作流程",
					content:['汇报工作说结果',
						'请示工作说方案',
						'总结工作说流程',
						'布置工作说标准',
						'关心下属问过程',
						'交接工作说道德',
						'回忆工作讲感觉'
					]
				},
				content2:{
					type:"工作",
					subject:"大佬能力",
					content:{
						'前台能力':{
							'结果可视化能力':{
								'不重要':['做了什么？','怎么做的？','做得如何？'],
								'重要':['领导需要的','领导看到的','领导认可的'],
								'熟练掌握':['Excel','World','PPT']
							},
							'可视化成果':'汇报邀功能力'
						},
						'中台能力':{
							'基本能力':'做事运用方法论能力',
							'高手的特点':['做事有定法（相适应的指导方法）','过程有套路（严格执行规范有效的流程）','结果有方法'],
							'储备方法论':['5W2H','Star模型','价值链'],
							'方法论的目标':'标准化工作手段（做事过程的可复用能力）'
						},
						'后台能力':{
							'基本能力':'中控核心领导力',
							'能力':['学习力','决策力','组织力','教导力','执行力','感召力']
						}
					}
					
				},
				
            }
        },
        methods: {
            onKeyInput: function(event) {
                this.inputValue = event.detail.value
            },
            replaceInput: function(event) {
                var value = event.detail.value;
                if (value === '11') {
                    this.changeValue = '2';
                }
            },
            hideKeyboard: function(event) {
                if (event.detail.value === '123') {
                    uni.hideKeyboard();
                }
            },
            clearInput: function(event) {
                this.inputClearValue = event.detail.value;
                if (event.detail.value.length > 0) {
                    this.showClearIcon = true;
                } else {
                    this.showClearIcon = false;
                }
            },
            clearIcon: function() {
                this.inputClearValue = '';
                this.showClearIcon = false;
            },
            changePassword: function() {
                this.showPassword = !this.showPassword;
            },
            onFocus() {
                this.$mp.page.$getAppWebview().setStyle({
                    softinputNavBar: 'none'
                })
            },
            onBlur() {
                this.$mp.page.$getAppWebview().setStyle({
                    softinputNavBar: 'auto'
                })
            },
			send(){
				console.log("before request");
				// axios({
				// 	method:'get',
				// 	url:'https://www.baidu.com?name=tom&age=23',
				// 	headers:{'Access-Control-Allow-Origin':'https://www.baidu.com' }
				// }).then(function(resp){
				// 	console.log("请求返回")
				// 	console.log(resp.data);
				// }).catch(resp=>{
				// 	console.log('请求失败：'+resp.status+','+resp.statusText);
				// });
				
				// let res = await uni.request({
				// 	url:'https://www.baidu.com?name=tom&age=23',
				// 	header:{},
				// 	method:'GET',
				// 	success:function(resp){
						
				// 			console.log("请求返回")
				// 			console.log(resp.data);
				// 	}
				// });
			}
        },
        onLoad() {
            this.platform = uni.getSystemInfoSync().platform
            // #ifdef APP-PLUS-NVUE
            this.isNvue = true
            // #endif
        }
    }
</script>

<style lang="scss" scoped>
    .nvue-page-root {
        background-color: #F8F8F8;
        padding-bottom: 20px;
    }
    .page-title {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 35rpx;
    }
    .page-title__wrapper {
        padding: 0px 20px;
        border-bottom-color: #D8D8D8;
        border-bottom-width: 1px;
    }
    .page-title__text {
        font-size: 16px;
        height: 48px;
        line-height: 48px;
        color: #BEBEBE;
    }
    .title {
        padding: 5px 13px;
    }
    .uni-form-item__title {
        font-size: 16px;
        line-height: 24px;
    }
    .uni-input-wrapper {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        padding: 8px 13px;
        flex-direction: row;
        flex-wrap: nowrap;
        background-color: #FFFFFF;
    }
    .uni-input {
        height: 28px;
        line-height: 28px;
        font-size: 15px;
        padding: 0px;
        flex: 1;
        background-color: #FFFFFF;
    }
    .uni-icon {
        font-family: uniicons;
        font-size: 24px;
        font-weight: normal;
        font-style: normal;
        width: 24px;
        height: 24px;
        line-height: 24px;
        color: #999999;
    }
    .uni-eye-active {
        color: #007AFF;
    }
	.buten{
		display: flex;// 弹性盒
	}
	.used{
		background-color: #999999; width: 180rpx;height: 50rpx;line-height: 50rpx;text-align: center;margin-bottom: 10rpx;margin-right: 50rpx;
	}
</style>
