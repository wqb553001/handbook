<template>
	<view >
		<!-- <uni-card :is-shadow="false" is-full>
			<text class="uni-h6">uni-forms 组件一般由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。</text>
		</uni-card> -->
		
		<uni-card :is-shadow="false" is-full style="text-align: center; display: block; ">
			<text class="uni-h6" >无所事事，难获持久尊重；劳逸结合，过好健康人生</text>
		</uni-card>
		<view class="uni-padding-wrap uni-common-mt">
		
			<view class="slider-container">
				<u-slider v-model="fontSizeScale"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9"
				 min="50" max="200" step="10" block-size="20" @changing="onFontSizeChange" show-value> </u-slider>
			</view>
			
			<view class="uni-flex uni-row" style="display: flex;">
				<view class="uni-flex uni-column" style="-webkit-flex: 1;flex: 1;-webkit-justify-content: space-between;justify-content: space-between;">
					<view class="uni-flex uni-row" style="display: flex;height: 60rpx;">
						<view class="text" :style="fontScaleChange(1)" >{{jobUser.username}}</view>
						<view class="text" :style="fontScaleChange(0.85)" >{{jobUser.sex==0?'男':jobUser.sex==1?'女':''}}</view>
						<view class="text" :style="fontScaleChange(0.85)" >{{calculateAge(jobUser.birth)}} 岁</view>
					</view>
					<view class="uni-flex uni-row" >
						<view class="text" :style="fontScaleChange(0.85)" style="text-align: left; -webkit-flex: 1;flex: 1;text-indent: 2em;margin: 20px 0px 5px 5px; ">
							{{ jobUser.tools }}
						</view>
					</view>
				</view>
				<view class="text uni-flex" style="width: 200rpx; height: 220rpx; ">
					<image :src="jobUser.headImgPath" style="width: 200rpx;height: 200rpx;"></image>
				</view>
			</view>
			
		</view>
		
		<view class="uni-row" >
			<view class="uni-row" style="width:100%" >
				<view class="text" style="text-align: left; padding-top: 10rpx;  line-height:10rpx;" :style="fontScaleChange(0.85)" >
					{{ jobUser.allSkills }} 
				</view>
				
				<view class="text" style="padding-top: 10rpx;">
					<view class="uni-row" style="padding-top: 10rpx; padding-left: 10rpx; ">
						<view class="uni-flex uni-column" style="min-height: 80rpx;  line-height:70rpx;" :style="fontScaleChange(0.85)" >
							{{ jobUser.introduction }}
						</view>
						
						<view class="uni-flex uni-row" style="justify-content: space-between; padding-top: 10rpx;">
							<!-- <view class="text" style="min-width: 160rpx;  line-height:70rpx;" :style="fontSet">
								{{ jobUser.tools || ' ' }}
							</view> -->
							
							<view class="text" style="text-align: left; color: #2E8B57; font-weight: bold;  line-height:70rpx;" :style="fontScaleChange(1)"
							 @longpress="longPressCopyText(jobUser.address)">
								<uni-icons type="location" color="#D3D3D3" size="30" />
								{{ jobUser.address || ' ' }}
							</view>
						</view>
					</view>
				</view>
				
			</view>
		</view>
		
		<view class="example" style="margin-top: 120px;">
			<!-- 基础用法，不包含校验规则 -->
			<uni-forms ref="baseForm" :model="jobUser" labelWidth="80px">
				<view style="display: flex;">
					
				</view>
				<text style="font: inherit; color: #777;" :style="fontScaleChange(1.2)">评分:</text>
				<view class="text" style="text-align: left; -webkit-flex: 1;flex: 1; margin-top: 10px;margin-bottom: 10px;">
					<uni-rate :max="10" :value="jobUser.multiScore" />
				</view>
				<text style="font: inherit; color: #777;" :style="fontScaleChange(1.2)">评价(赞赏/建议):</text>
				<uni-easyinput :style="fontScaleChange(1)" style="margin-top: 10px;" type="textarea" v-model="jobUser.introduction" placeholder="请输入自我介绍" />
				
			</uni-forms>
			<button type="primary" @click="submit('example')">提交</button>
		</view>


	</view>
</template>

<script>
	const JOB_USER_FONT_SET = "jobUserDetailFontSet"
	export default {
		data() {
			return {
				fontScale: 1.0,
				fontSizeScale: 100,
				// 基础表单数据
				jobUser: {
				},
				
			}
		},
		computed: {
		},
		onLoad(e) {
			console.log("参数："+ e.detailId)
			this.getJobUserByUserId(e.detailId);
			this.getTools();
		},
		onReady() {
			// 设置自定义表单校验规则，必须在节点渲染完毕后执行
		},
		mounted(){
			
		},
		methods: {
			getJobUserByUserId(detailId){
				const _this = this;
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/getUser',  // 用户数据
					data: {userId: detailId},
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						console.log('userStream 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							const respData = result.data.data;
							console.log("getUser返回值："+JSON.stringify(respData))
							if(respData) {
								console.log("转化前："+respData.skills)
								respData.allSkills = JSON.parse(respData.skills)
								  .filter(item => Object.keys(item) != -1)
								  .map(item => Object.values(item))
								  .join(',');
								if(respData.otherSkills){
									respData.allSkills = respData.allSkills==''?respData.otherSkills:respData.allSkills +","+ respData.otherSkills
								}
								console.log("转化后："+respData.allSkills)
							};
							_this.jobUser = respData;
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
			},
			getTools(){
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/getToolSource', // 获取技能选项
					data: {sysId: 2025040301},
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						// console.log('userStream 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							const respData = result.data.data;
							// console.log("getToolSource返回值："+JSON.stringify(respData))
							// if(respData) {
							// 	this.reload = false;
							// 	this.status = 'nomore';	// 没有更多
							// 	return;
							// };
							this.toolsHandle(respData);
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
			},
			onClickItem(e) {
				console.log(e);
				this.current = e.currentIndex
			},
			add() {
				
				
			},
			onFontSizeChange(scale) {
				// this.fontSizeScale = e.detail.value;
				this.fontSizeScale = scale;
				const scaleValue = this.fontSizeScale / 100;
				this.fontScale = scaleValue
				
				var _this = this
				// 字体大小存入缓存记忆
				uni.setStorage({key:JOB_USER_FONT_SET, data: _this.fontSizeScale});
			},
			fontScaleChange(baseFontSize=1){
				var fontSize = baseFontSize * (this.fontSizeScale / 100);
				/* #ifdef MP-WEIXIN */
				return 'font-size :' + 37.5*fontSize + 'rpx;'
				// console.log("WEIXIN 实时计算样式："+ this.fontSet)
				/* #endif */
				
				/* #ifndef MP-WEIXIN */
				return 'font-size :' + 1*fontSize + 'rem;'
				// console.log("APP/H5 实时计算样式："+ this.fontSet)
				/* #endif */
			},
			toolsHandle(tools){
				var toolsObj = JSON.parse(tools);
				// 转换为适合组件的数据格式
				this.toolsOptions = toolsObj.map(item => ({
				  value: item[0],
				  text: item[1],
				  dataContent: item[2] // 转义双引号 JSON.stringify(item[2]).replace(/"/g, '\\"')
				}));
				console.log("选项："+JSON.stringify(this.toolsOptions))
			},
			calculateAge(birth) {
				console.log("出生年月：" + birth)
				if(!birth) return;
				const bIndex = birth.indexOf(' 00:00:00');
				if(bIndex>0){birth = birth.substring(0, bIndex)}
				const birthday = new Date(birth);
			    const today = new Date();
			    let age = today.getFullYear() - birthday.getFullYear();
			    const m = today.getMonth() - birthday.getMonth();
			    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
			        age--;
			    }
				console.log("计算年龄："+age)
			    return age;
			},
			submit(ref) {
				console.log(JSON.stringify(this.jobUser));
			},
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

<style lang="scss">
	.example {
		padding: 15px;
		background-color: #fff;
	}

	.segmented-control {
		margin-bottom: 15px;
	}

	.button-group {
		margin-top: 15px;
		display: flex;
		justify-content: space-around;
	}

	.form-item {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.button {
		display: flex;
		align-items: center;
		height: 35px;
		line-height: 35px;
		margin-left: 10px;
	}
	
	
	
	.flex-item {
		width: 33.3%;
		height: 200rpx;
		text-align: center;
		line-height: 200rpx;
	}

	.flex-item-V {
		width: 100%;
		height: 150rpx;
		text-align: center;
		line-height: 150rpx;
	}

	.text {
		margin: 15rpx 10rpx;
		padding: 0 20rpx;
		// background-color: #ebebeb;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #777;
		font-size: 26rpx;
	}

	.desc {
		/* text-indent: 40rpx; */
	}
	.flex-pc {
		display: flex;
		justify-content: center;
	}
</style>
