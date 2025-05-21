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
				<view class="uni-flex uni-column" style="-webkit-flex: 1; flex: 1; -webkit-justify-content: space-between; justify-content: space-between;">
					<view class="uni-flex" style="display: flex; height: 1.37; white-space: nowrap;">
						<view class="text" :style="fontScaleChange(1)" >{{jobUser.username}}</view>
						<view class="text" :style="fontScaleChange(0.85)" >{{jobUser.sex==0?'男':jobUser.sex==1?'女':''}}</view>
						<view class="text" :style="fontScaleChange(0.85)" style="padding: 0; " >{{calculateAge(jobUser.birth)}} 岁</view>
					</view>
					<view class="uni-flex uni-row" >
						<view class="text" :style="fontScaleChange(0.85)" style="text-align: left; -webkit-flex: 1; flex: 1; text-indent: 2em;  line-height:1.37; margin: 20px 0px 5px 5px; ">
							{{ jobUser.tools }}
						</view>
					</view>
				</view>
				<view class="text uni-flex" style="width: 200rpx; height: 200rpx; " @longpress="longPressEditHeadImage">
					<image :src="jobUser.headImgPath" style="width: 200rpx; height: 200rpx;"></image>
				</view>
			</view>
		</view>
		
		<view style="width:100%" >
			<view class="text" style="text-align: left; padding-top: 50rpx;  line-height:1.37;" :style="fontScaleChange(0.85)" >
				{{ jobUser.allSkills }} 
			</view>
			
			<view class="text" style="padding-top: 10rpx;">
				<view class="uni-row" style="padding-top: 10rpx;">
					<view class="uni-flex uni-column" style="min-height: 80rpx; line-height:1.37;" :style="fontScaleChange(0.85)" >
						{{ jobUser.introduction }}
					</view>
					
					<view class="uni-flex uni-row" style="justify-content: space-between; margin-top: 30rpx;">						
						<view class="text" style="text-align: left; color: #2E8B57; font-weight: bold;  line-height: 1.37; padding-left: 0; margin-left: -10px;" :style="fontScaleChange(1)"
						 @longpress="longPressCopyText(jobUser.address)">
							<uni-icons type="location" color="#D3D3D3" size="30" />
							{{ jobUser.address || ' ' }}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="!isMyself && jobUser.isScore" style="margin-top: 80px;padding: 15px; background-color: #fff;">
			<text style="font: inherit; color: #777;" :style="fontScaleChange(1.2)">评分:</text>
			<view class="text" style="text-align: left; -webkit-flex: 1;flex: 1; margin-top: 10px;margin-bottom: 10px;">
				<uni-rate :max="10" v-model="talk.score" />
			</view>
			<text style="font: inherit; color: #777;" :style="fontScaleChange(1.2)">评价(赞赏/建议):</text>
			<uni-easyinput style="margin-top: 10px; " type="textarea" v-model="talk.talk" placeholder="请输入评价内容"
			:placeholderStyle="fontScaleChange(1.2)" :style="fontScaleChange(1.2)" />
			
			<button type="primary" @click="submit">提交</button>
		</view>


	</view>
</template>

<script>
	import { JobStoreManager } from '../../../common/js/util/jobStoreManager.js'
	
	const SYS_ID = 2025040301
	const JOB_TOKEN = 'JOB_TOKEN'
	const JOB_USER_FONT_SET = "jobUserDetailFontSet"
	const JOB_OPT_HISTORY_RECORD = 'JOB_OPT_HISTORY_RECORD';
	const JOB_OPT_HISTORY_RECORD_LEN = 20;
	
	export default {
		data() {
			return {
				detailId: 0,
				userToken: {},
				fontScale: 1.0,
				fontSizeScale: 100,
				jobUser: {
					userId:0,
					username:"",
					sex:0,
					tools:'',
					headImgPath:'',
					introduction:'',
					allSkills:'',
					address:''
				},
				// 基础表单数据
				talk: {
					userId: 0,
					score: 8,
					talk: ''
				},
				isMyself: false,
				
				// 长按 收藏/取消收藏
				jobManager: null,
				isStore: true,
				readHistoryRecord: true,
				historyRecord: [],
			}
		},
		computed: {
		},
		onLoad(e) {
			const _this = this
			uni.getStorage({
				key: JOB_TOKEN,
				success: function(resp){
					_this.userToken = resp.data
					if(_this.userToken.userId == e.detailId){
						_this.isMyself = true
					}
					// 加载用户信息
					_this.getJobUserByUserId(e.detailId);
					
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
				},
				fail:function(){
				}
			});
			// console.log("参数："+ e.detailId)
			this.detailId = e.detailId
			
			// 监听全局事件（获取选择的地址）
			uni.$on('acceptAddress', (data) => {
			    // console.log("接收地址：" + JSON.stringify(data))
				// this.baseFormData.address = data.title;
				const form = {
					latitude 	: data.location.lat,	// 纬度
					longitude 	: data.location.lng,	// 经度
					province 	: data.province,
					city 		: data.city,
					district 	: data.district,
					address : (data.title && data.title.includes(data.district))? data.title : data.district+data.title
				}
				this.jobUser.address = form.address
				this.updateUser(form)
			});
		},
		onReady() {
			// 设置自定义表单校验规则，必须在节点渲染完毕后执行
		},
		mounted(){
			this.initGetFontSize(); // 页面重新加载-恢复
		},
		methods: {
			getJobUserByUserId(detailId){
				const _this = this;
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/getUser',  // 用户数据
					data: {sysId: SYS_ID, userId: detailId, selfId: this.userToken.userId, token: this.userToken.token},
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						// console.log('userStream 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							const respData = result.data.data;
							// console.log("getUser返回值："+JSON.stringify(respData))
							if(respData) {
								// console.log("转化前："+respData.skills)
								respData.allSkills = respData.skillsName
								// respData.allSkills = JSON.parse(respData.skills)
								//   .filter(item => Object.keys(item) != -1)
								//   .map(item => Object.values(item))
								//   .join(',');
								
								if(respData.otherSkills){
									respData.allSkills = respData.allSkills==''||!respData.allSkills?respData.otherSkills:respData.allSkills +","+ respData.otherSkills
								}
								// console.log("转化后："+respData.allSkills)
							};
							_this.jobUser = respData;
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
				return 'font-size :' + 37.5*fontSize + 'rpx !important; fontSize :'+ 37.5*fontSize+ 'rpx !important;'
				// console.log("WEIXIN 实时计算样式："+ this.fontSet)
				/* #endif */
				
				/* #ifndef MP-WEIXIN */
				return 'font-size :' + 1*fontSize + 'rem !important;fontSize :'+ 1*fontSize+ 'rem !important;'
				// console.log("APP/H5 实时计算样式："+ this.fontSet)
				/* #endif */
			},
			calculateAge(birth) {
				// console.log("出生年月：" + birth)
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
				// console.log("计算年龄："+age)
			    return age;
			},
			submit() {
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/saveScore',  // 数据源的数据是 有序的
					data: {sysId: SYS_ID, selfId: 19, userId: this.jobUser.userId, score: this.talk.score, talk: this.talk.talk, orderId: 0},
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						// console.log('job/saveScore 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							uni.showToast({title:'感谢评价！'});
							setTimeout(() => {
							  uni.navigateBack(); // 1.5秒后，返回上一页
							}, 1000); // 3000毫秒等于3秒
							
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
			},
			updateUser(form){
				form.sysId 	= SYS_ID;
				form.token 	= this.userToken.token;
				form.selfId = this.userToken.userId;
				form.userId = this.userToken.userId;
				// console.log("提交表单内容："+JSON.stringify(form))
				
				uni.request({
					url: process.env.UNI_BASE_URL+ '/api/job/updateUser',
					header: { 'Content-Type': 'application/json' },
					method: 'POST',
					data: JSON.stringify(form),
					success: result => {
						// console.log('userStream 返回值' + JSON.stringify(result));
						const respData = result.data;
						if (result.statusCode == 200) {
							if(respData.code == 0){
								uni.showToast({ title: '地址更新成功！' });
								return;
							}
							
						}
						uni.showToast({ title: '地址更新失败！请稍后重试！' , icon: 'error' });
						// console.log("更新地址异常："+ respData.message)
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
				
			},
			longPressCopyText(val){
				if(this.isMyself){
					uni.navigateTo({
					  url: "/pages/job/map/map"
					});
					return;
				}
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
			async longPressEditHeadImage(){
				// console.log("selfId:"+this.userToken.userId+"；userId:"+this.detailId)
				if(this.isMyself){
					const url = `/pages/job/head_img/head_img?userId=${this.userToken.userId}&afterUrl=/pages/job/user/user_detail?detailId=${this.detailId}&headPath=${this.jobUser.headImgPath}`;
					uni.navigateTo({ url });
				}else{
					if(this.readHistoryRecord){
						const _this = this;
						await uni.getStorage({
							key: JOB_OPT_HISTORY_RECORD,
							success: function(resp){
								_this.historyRecord = resp.data
								// console.log("user_detail 缓存取值："+ JSON.stringify(resp.data));
								// console.log("user_detail 赋值后："+ JSON.stringify(_this.historyRecord));
								if(!_this.jobManager) _this.jobManager = new JobStoreManager({sysId: SYS_ID, uni: uni, historyRecordKey: JOB_OPT_HISTORY_RECORD, maxHistoryLength: JOB_OPT_HISTORY_RECORD_LEN})
								_this.jobManager.storeOpt(_this.jobUser, '收藏', _this.isStore, _this.userToken, [..._this.historyRecord])
							},
							fail:function(){
							}
						});
					}else{
						if(!this.jobManager) this.jobManager = new JobStoreManager({sysId: SYS_ID, uni: uni, historyRecordKey: JOB_OPT_HISTORY_RECORD, maxHistoryLength: JOB_OPT_HISTORY_RECORD_LEN})
						this.jobManager.storeOpt(this.jobUser, '收藏', this.isStore, this.userToken, [...this.historyRecord])
					}
					
					// 已经读取过
					this.readHistoryRecord = false
					// 变更 收藏/取消收藏 标识
					this.isStore?this.isStore=false:this.isStore=true;
				}
			},
			initGetFontSize(){
				// console.log("从内存读取，字体设置数据："+ JOB_USER_FONT_SET)
				var _this = this
				uni.getStorage({
					key: JOB_USER_FONT_SET,
					success: function(resp){
						// console.log("key:", JOB_USER_FONT_SET, "返回内存原值：", JSON.stringify(resp))
						_this.fontSizeScale = resp.data
						_this.onFontSizeChange(_this.fontSizeScale); // 初始化设置一次
						// console.log("初始从缓存中取值，设置字体比例：" + _this.fontSizeScale)
					},
					fail:function(){
						// console.log("首次存储，未取得 key:"+JOB_USER_FONT_SET);
					}
				});
			},
			
			
		}
	}
</script>

<style lang="scss">
	.example {
		
	}
	
	::v-deep .uni-easyinput__content-textarea  {
		/* #ifndef MP-WEIXIN */
	    font-size: v-bind('fontScale') rem !important ; /* 使用 v-bind 动态绑定字体大小 */
		/* #endif */
		
		/* #ifdef MP-WEIXIN */
		font-size: calc(v-bind('fontScale') * 37.5 ) px !important ;
		// font-size: 28 px !important ; /* 使用 v-bind 动态绑定字体大小 */
		/* #endif */
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
		// height: 70rpx;
		min-height: 70rpx; // 改为最小高度
		line-height: 1.6;  // 使用无单位值，随字体缩放
		// line-height: 70rpx;
		text-align: center;
		white-space: pre-wrap; // 允许换行
		word-break: break-all; // 防止溢出
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
