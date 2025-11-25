<template>
    <view class="template-d">
        <!-- 顶部个人信息卡片 -->
		
        <!-- <view class="profile-card">
            <view class="profile-header"> -->
                <!-- <image class="bg-image" src="/static/logo.png" mode="aspectFill" /> -->
                <!-- <view class="profile-info">
					<view class="headLeft">
						<view class="headImg" @longpress="navigateToLogined(`/pages/job/head_img/head_img?userId=${userToken.userId}&afterUrl=/pages/job/user/user_detail?detailId=${userToken.userId}&headPath=${jobUser.headImgPath}`)">
							<image class="avatar" :src="jobUser.headImgPath" mode="aspectFill" /> -->
							<!-- <image v-show="!isLogined" class="avatar" :src="jobUser.headImgPath" mode="aspectFill" /> -->
							<!-- <uni-icons v-if="!isLogined" type="contact" class="avatar" size="14" color="#FFD700"></uni-icons> -->
						<!-- </view>
						
						<view class="info-text">
							<view style="display: flex;" :style="fontSet" >
								<text class="nickname" :style="fontSet">{{  jobUser.username  }}</text>
								<text class="mobile" :style="fontSet" style="align-items: flex-end;">{{  jobUser.mobile?.slice(-4)  }}</text>
							</view> -->
							
							<!-- <text class="signature" :style="fontSet">{{ jobUser.skillsName }}</text> -->
						<!-- </view>
					</view>
					<view class="headRight">
						<view v-if="isLogined" class="member-tag">
							<uni-icons type="star" v-for="(item, index) in jobUser.multiScore" :key="index" :size="18*fontScale" color="#FFD700"></uni-icons>
							<text :style="fontSet">{{score(jobUser.multiScore)}}</text>
						</view>
						<view v-if="isLogined" class="setting-icon">
							<uni-icons type="gear" :size="23*fontScale" color="#fff" @click="navigateToLogined('/pages/job/user/user_setting')"></uni-icons>
						</view>
							
						<view v-if="!isLogined">
							<text class="nickname" :style="fontSet" @click="navigateToGo(`/pages/job/index`)">登录/注册</text>
						</view>
						
					</view>
					
                </view>
            </view> -->
		
			<!-- <view class="slider-container" style="z-index: 9999;">
				<u-slider v-model="fontSizeScale"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9"
				 min="50" max="200" step="10" block-size="20" @changing="onFontSizeChange" show-value></u-slider> -->
				<!-- <text style="text-align: center; display: block;">字体缩放比例：{{fontSizeScale}}%</text> -->
			<!-- </view>
            <view v-if="isLogined" class="profile-stats">
                <view class="stat-item">
                    <text class="num" :style="fontSet">1280</text>
					<uni-icons type="hand-up-filled" :size="23*fontScale" color="#FFCC33" ></uni-icons>
                    <text class="label" :style="fontSet">获赞</text>
                </view>
                <view class="stat-item">
                    <text class="num" :style="fontSet">128</text>
					<uni-icons type="star-filled"  :size="23*fontScale" color="#FFCC33" ></uni-icons>
                    <text class="label" :style="fontSet">收藏</text>
                </view>
                <view class="stat-item">
                    <text class="num" :style="fontSet">59</text>
					<uni-icons type="redo-filled"  :size="23*fontScale" color="#FFCC33" ></uni-icons>
                    <text class="label" :style="fontSet">分享</text>
                </view>
            </view>
        </view> -->
		<profile-card
		      :is-logined="isLogined"
		      :job-user="jobUser"
		      :font-set="fontSet"
		      :font-scale="fontScale"
		      :font-size-scale="fontSizeScale"
		      :stats="stats"
		      :score-text="scoreText"
		      @longpress-avatar="longPressEditHeadImage"
		      @navigate-to-go="navigateToGo"
		      @navigate-to-logined="navigateToLogined"
		      @font-size-change="onFontSizeChange"
		></profile-card>
        <!-- 功能区域 -->
       <view class="feature-section">
            <view class="section-title" :style="fontSet" style="display: flex; justify-content: space-between;">
				<text style="white-space: nowrap;">我的服务</text>
				<view v-if="isLogined" @longpress="longpressCopyCode(jobUser.selfCode)" style="text-align: right;" >
					<text style="color: #FFCC33;" >我的邀请码：</text>
					<text @longpress="longpressCopyCode(jobUser.selfCode)" style="color: #ff6043;">{{jobUser.selfCode}}</text>
				</view>
			</view>
            <view class="feature-grid">
                <view class="feature-item" v-for="(item, index) in features.slice(0, 2)" :key="index" @click="handleFeature(item)"><!-- @click="isLogined?handleFeature(item):''" -->
                    <view class="feature-icon" :style="{ backgroundColor: item.bgColor }"> <uni-icons :type="item.icon"  :size="23*fontScale" :color="item.iconColor"></uni-icons> </view>
                    <text class="feature-name" :style="fontSet">{{item.name}}</text>
                </view>
            </view>
        </view>


    <!-- 快捷功能区 -->
    <view class="quick-actions">
      <view class="action-item" v-for="(item, index) in allServices.slice(0, 0)" :key="index" @click="navigateToLogined(item.path)" >
        <view class="action-icon" :style="fontSet" :class="item.class"> <uni-icons :type="item.icon"  :size="23*fontScale" color="#fff"></uni-icons> </view>
        <text class="action-name" :style="fontSet">{{ item.name }}</text>
      </view>
    </view>

    <!-- 服务菜单列表 -->
    <view class="service-list">
<!--      <view class="service-item" v-for="(item, index) in allServices.slice(4)" :key="index" @click="isLogined?navigateTo(item.path):''" >
        <view class="left">
          <view class="service-icon" :class="item.class"> <uni-icons :type="item.icon" size="20" color="#fff"></uni-icons> </view>
          <text class="service-name">{{ item.name }}</text>
        </view>
        <view class="right">
          <text v-if="item.desc" class="desc">{{ item.desc }}</text>
          <uni-icons type="right" size="14" color="#999"></uni-icons>
        </view>
      </view> -->
	  
	  
	  
	    <view v-if="jobUser.hasRelation" class="service-item" @click="navigateToGo('/pages/job/online/talk_list')" >
			<view class="left">
				<view class="service-icon bg-orange" > <uni-icons type="headphones" size="20" color="#fff"></uni-icons> </view>
				<text class="service-name" :style="fontSet">留言回复</text>
			</view>
			<view class="right">
				<uni-badge v-if="jobUser.sumRead" :text="jobUser.sumRead" class="desc uni-badge-left-margin" absolute="rightTop" :offset="[5, 5]" size="small">
					<view class="desc"><text class="desc" :style="fontSet" >未读</text></view>
				</uni-badge>
				<text v-else class="desc" :style="fontSet" >留言</text>
				<uni-icons type="right" size="14" color="#999"></uni-icons>
			</view>
	    </view>
	  
	    <view class="service-item" @click="navigateToGo(`/pages/job/user/user_help`)" >
			<view class="left">
				<view class="service-icon bg-cyan" > <uni-icons type="help" size="20" color="#fff"></uni-icons> </view>
				<text class="service-name" :style="fontSet" >帮助中心</text>
			</view>
			<view class="right">
				<uni-icons type="right" :style="fontSet" size="14" color="#999"></uni-icons>
			</view>
	    </view>
	  
	  	  
		<view class="service-item" @click="navigateToGo('/pages/job/suggest/suggest?userId='+userToken.userId)" >
			<view class="left">
				<view class="service-icon bg-pink" > <uni-icons type="email" size="20" color="#fff"></uni-icons> </view>
				<text class="service-name" :style="fontSet" >意见反馈</text>
			</view>
			<view class="right">
				<uni-icons type="right" :style="fontSet" size="14" color="#999"></uni-icons>
			</view>
		</view>
	  
	  	  
<!-- 		<view class="service-item" @click="navigateToLogined('/pages/job/suggest/suggest?userId='+userToken.userId)" >
			<view class="left">
				<view class="service-icon bg-green" > <uni-icons type="chat" size="20" color="#fff"></uni-icons> </view>
				<text class="service-name" :style="fontSet" >在线咨询</text>
			</view>
			<view class="right">
				<uni-icons type="right" :style="fontSet" size="14" color="#999"></uni-icons>
			</view>
		</view> -->
		
	  	<view class="service-item" @click="navigateToLogined('/pages/job/user/user_setting')" >
	  	  	<view class="left">
	  	  		<view class="service-icon bg-gray" > <uni-icons type="gear" size="20" color="#fff"></uni-icons> </view>
	  	  		<text class="service-name" :style="fontSet" >设置</text>
	  	  	</view>
	  	  	<view class="right">
	  	  		<uni-icons type="right" size="14" color="#999"></uni-icons>
	  	  	</view>
	  	</view>
		
	  	<view v-if="jobUser.level == 1" class="service-item" @click="navigateToLogined('/pages/job/manage/manage_list')" >
	  	  	<view class="left">
	  	  		<view class="service-icon bg-manager" > <uni-icons type="auth" size="20" color="#fff"></uni-icons> </view>
	  	  		<text class="service-name" :style="fontSet" >管理</text>
	  	  	</view>
	  	  	<view class="right">
	  	  		<uni-icons type="right" size="14" color="#999"></uni-icons>
	  	  	</view>
	  	</view>
		
		
	  
    </view>


        <!-- 最近动态 -->
        <!-- <view class="recent-section">
            <view class="section-title">最近动态</view>
            <view class="activity-list">
                <view class="activity-item" v-for="(item, index) in activities" :key="index">
                    <image class="activity-image" :src="item.image" mode="aspectFill" />
                    <view class="activity-content">
                        <text class="activity-title">{{item.title}}</text>
                        <text class="activity-time">{{item.time}}</text>
                    </view>
                </view>
            </view>
        </view> -->
    </view>
</template>

<script>
import ProfileCard from '@/components/ProfileCard/ProfileCard.vue';
const SYS_ID = 2025040301;
const JOB_TOKEN = 'JOB_TOKEN';
const JOB_USER_FONT_SET = "jobUserMySet";
const workerScoreMap = 
	{
		"-5":"",	"-4":"",	"-3":"",		"-2":"",		"-1":"",
		"0":"",		"1":"",		"2":"",			"3":"",			"4":"",			"5":"",
		"6":"",		"7":"",		"8":"劳模",		"9":"工匠",		"10":"",
		"11":"",	"12":"",	"13":"",		"13":"",
	}

export default {
	components:{
		ProfileCard
	},
	onLoad() {
		this.getToken();
	},
	onShow() {
		// this.getToken();
		this.initGetFontSize(); // 页面重新加载-恢复
	},
	mounted() {
		this.getToken();
	},
	onPullDownRefresh() {
		this.getToken();
		uni.stopPullDownRefresh();
	},
    data() {
        return {
			isLogined: false,
			talkPath: '/pages/job/online/talk_list',
			
			userToken:{},
			jobUser: {
				avatar: '/static/logo.png',
				username: '',
				mobile: ''
			},
            features: [
                { name: '我的收藏', 		icon: 'star-filled', 	bgColor: '#FFE8E8', 	iconColor: '#FF4D4F', 	path: '/pages/job/user/user_favorite' 	},
                { name: '历史记录', 		icon: 'eye-filled',  	bgColor: '#E6F7FF', 	iconColor: '#1890FF', 	path: '/pages/job/user/user_history' 	},
                { name: '我的找用工',	icon: 'bars', 		 	bgColor: '#F6FFED', 	iconColor: '#52C41A', 	path: '/pages/order' 					},
                { name: '积分商城', 		icon: 'gift-filled', 	bgColor: '#FFF7E6', 	iconColor: '#FA8C16', 	path: '/pages/points' 					},
                { name: '客户服务', 		icon: 'chat-filled', 	bgColor: '#F9F0FF', 	iconColor: '#722ED1', 	path: '/pages/service' 					},
                { name: '设置', 			icon: 'gear-filled', 	bgColor: '#F0F5FF', 	iconColor: '#2F54EB', 	path: '/pages/job/user/user_add' 		}
            ],
            activities: [
                { title: '浏览了《产品设计》', 	time: '2分钟前', 	image: '/static/logo.png' },
                { title: '收藏了《UI设计》', 		time: '1小时前', 	image: '/static/logo.png' },
                { title: '点赞了《前端开发》', 	time: '2小时前', 	image: '/static/logo.png' }
            ],
			allServices: [
				{ name: '收藏夹', 	icon: 'star', 		path: '/pages/job/user/user_favorite', 	class: 'bg-red' 	},
				{ name: '浏览记录', 	icon: 'eye', 		path: '/pages/job/user/user_history', 	class: 'bg-blue' 	},
				{ name: '收货地址', 	icon: 'location', 	path: '/pages/address/list', 			class: 'bg-green' 	},
				{ name: '优惠券', 	icon: 'gift', 		path: '/pages/coupon/list', 			class: 'bg-purple' 	},
				
				{ name: '客服中心', 	icon: 'headphones', path: '/pages/job/online/talk_list', 	class: 'bg-orange', desc: '留言' },
				{ name: '帮助中心', 	icon: 'help', 		path: '/pages/help/index', 				class: 'bg-cyan' },
				{ name: '意见反馈', 	icon: 'chat', 		path: '/pages/job/suggest/suggest', 	class: 'bg-pink' },
				{ name: '设置', 		icon: 'gear', 		path: '/pages/job/user/user_setting', 	class: 'bg-gray' }
			],
			
			// 字体缩放
			fontSet: 'font-size:37.5rpx;',
			fontScale: 1.0,
			fontSizeScale: 100, // 默认100%比例
			baseFontSize: 16,   // 基础字体大小（根据设计稿调整）
			stats: {
				likes: 1280,
				favorites: 128,
				shares: 59
			  },
        }
    },
    methods: {
		navigateToLogined(path){
			if(!this.isLogined) return uni.showToast({ title: '需要先登录！', icon: 'none' });
			uni.navigateTo({url: path});
		},
		
		navigateToGo(path) {
		  uni.navigateTo({ url: path })
		},
		
		getToken(){
			// 获取用户信息
			const _this = this
			uni.getStorage({
				key: JOB_TOKEN,
				success: async function(resp){
					_this.userToken = resp.data
					if(!_this.userToken) uni.removeStorage({key: JOB_TOKEN})
					// _this.isLogined = false
					if(_this.userToken?.token) _this.isLogined = true
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
					// if(_this.userToken?.userId) await _this.writeTempUserId();
					// console.log("设置临时userId后："+ JSON.stringify(_this.userToken))
				},
				fail:function(){
					 _this.isLogined = false
					 _this.writeTempUserId()
				},
				complete: () => {
					// 加载用户信息
					_this.getJobUserByUserId();
				}
			});
		},
		getJobUserByUserId(){
			const _this = this;
			var param = {sysId: SYS_ID}
			if(this.userToken?.userId) param.userId = this.userToken.userId
			if(this.userToken?.userId) param.selfId = this.userToken.userId
			if(this.userToken?.token) param.token = this.userToken.token
			uni.request({
				url: process.env.UNI_BASE_URL+'/api/job/userMy',  // 用户数据
				// data: {sysId: SYS_ID, userId: this.userToken.userId, selfId: this.userToken.userId, token: this.userToken.token},
				data: param,
				method: 'POST',
				header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				success: result => {
					// console.log('userStream 返回值' + JSON.stringify(result));
					if (result.statusCode == 200 && result.data.code == 0) {
						const respData = result.data.data;
						// console.log("getUser返回值："+JSON.stringify(respData))
						if(respData) {
							// console.log("转化前："+respData.skills)
							respData.allSkills = respData.skillsName
							if(respData.otherSkills){
								respData.allSkills = respData.allSkills==''||!respData.allSkills?respData.otherSkills:respData.allSkills +","+ respData.otherSkills
							}
							respData.allSkills 		= _this.truncateString(respData.allSkills, 11);
							respData.age 			= _this.calculateAge(respData.birth);
							respData.tools 			= _this.truncateString(respData.tools, 20);
							respData.introduction 	= _this.truncateString(respData.introduction, 45);
							if(respData.level != 1){
								_this.talkPath = `/pages/job/online/message?senderId=${this.userToken.userId}`
							}
							// console.log("转化后："+JSON.stringify(respData))
							_this.jobUser = respData;
						};
					}
				},
				fail: (result, code) => {
					console.log('fail' + JSON.stringify(result));
				}
			});
		},
		
		// 生成并记录临时用户ID
		async writeTempUserId(){
			const _this = this
			const res = await uni.getSystemInfo();
			const deviceId = res.deviceId;
			// const res = uni.getSystemInfoSync();
			uni.request({
				url: process.env.UNI_BASE_URL+ '/api/job/checkTempUserIsExist',
				header: { 'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				method: 'POST',
				data: {sysId: SYS_ID, deviceId: deviceId},
				success: result => {
					// console.log('saveUserTemp 返回值' + JSON.stringify(result));
					if (result.statusCode == 200) {
						const respData = result.data;
						console.log("index.saveUserTemp 返回值："+JSON.stringify(respData))
						if(respData.code == 0) {
							_this.userToken.userId = null
							_this.userToken.deviceId = deviceId;
							// _this.userToken.token = deviceId
							_this.userToken.userId = respData.data
							uni.setStorage({ key:JOB_TOKEN, data: _this.userToken });
							return;
						}
					}else{
						
						uni.showToast({ title: '需要先登录！', icon: 'none', duration:3000 });
						setTimeout(() => {
							// 延迟跳转
						  uni.navigateTo({ url: `/pages/job/index` });
						}, 3000); // 1000毫秒等于1秒
						
						// const url = '/pages/job/index';
						// uni.navigateTo({ url });
					}
				},
				fail: (result, code) => {
					console.log('fail' + JSON.stringify(result));
					const url = '/pages/job/index';
					uni.navigateTo({ url });
				}
			});
		},
		
		truncateString(str, len = 45, defaultValue = ' ') {
			if (!str || str.length == 0) {
				return defaultValue;
			}
			
			str = String(str).trim();
			if (str.length > len) {
				return str.slice(0, len) + '…';
			}
			return str;
		  
		},
		
		calculateAge(birth){
		  if(!birth) return;
		  const bIndex = birth.indexOf(' 00:00:00');
		  if(bIndex>0){birth = birth.substring(0, bIndex)}
		  // 将出生日期字符串转换为Date对象
		  const birthDateObj = new Date(birth);			  
		  // 获取当前日期
		  const today = new Date();			  
		  // 计算年龄
		  let age = today.getFullYear() - birthDateObj.getFullYear();			  
		  // 判断是否已过当年生日
		  const monthDiff = today.getMonth() - birthDateObj.getMonth();
		  const dayDiff = today.getDate() - birthDateObj.getDate();
		  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		    age--;
		  }			  
		  return age;
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
		
		onFontSizeChange(scale) {
			// this.fontSizeScale = e.detail.value;
			this.fontSizeScale = scale;
			const scaleValue = this.fontSizeScale / 100;
			this.fontScale = scaleValue
			// console.log("字体大小设置为：" + this.fontSizeScale)
			
			// console.log("实时计算比例："+ this.fontScale)
			
			/* #ifdef MP-WEIXIN */
			this.fontSet = 'font-size :' + 37.5*scaleValue + 'rpx;'
			// console.log("WEIXIN 实时计算样式："+ this.fontSet)
			/* #endif */
			
			/* #ifndef MP-WEIXIN */
			this.fontSet = 'font-size :' + 1*scaleValue + 'rem;'
			// console.log("APP/H5 实时计算样式："+ this.fontSet)
			/* #endif */
			var _this = this
			// 字体大小存入缓存记忆
			uni.setStorage({key:JOB_USER_FONT_SET, data: _this.fontSizeScale});
		},
		
		longPressEditHeadImage(){
			if(!this.userToken?.token) {
				uni.showToast({ title: '需要先登录！', icon: 'none', duration:3000 });
				return ;
			}
			const url = `/pages/job/head_img/head_img?userId=${this.userToken.userId}&afterUrl=/pages/job/user/user_detail?detailId=${this.userToken.userId}&headPath=${this.jobUser.headImgPath}`;
			uni.navigateTo({ url });
			return ;
		},
        handleFeature(item) {
            uni.navigateTo({
                url: item.path
            });
        },
		
		score(score){
			return workerScoreMap[score]
		},
		longpressCopyCode(val){
			// console.log("复制内容：", val)
			if(!val || val==""){
				return;
			}
			// console.log("开始复制……")
			uni.setClipboardData({
				data: String(val),
				success() {
					uni.showToast({
						title:'已复制到剪贴板',
						icon:'none',
						position:'top'
					});
					console.log("复制完成")
				},
			    fail: (err) => {
				  console.log("复制失败", err)  // 输出错误信息
			    },
			    complete: () => {
				  // console.log("复制操作完成")   // 无论成功与否都会触发
			    }
			});
			// console.log("异步复制……")
		},
    },
	computed: {
		scoreText() {
		  // 计算分数文本的逻辑
		  const workerScoreMap = {
			"-5":"", "-4":"", "-3":"", "-2":"", "-1":"",
			"0":"", "1":"", "2":"", "3":"", "4":"", "5":"",
			"6":"", "7":"", "8":"劳模", "9":"工匠", "10":"",
			"11":"", "12":"", "13":"", "13":"",
		  };
		  return workerScoreMap[this.jobUser.multiScore] || '';
		}
	},
}
</script>

<style lang="scss">
.template-d {
    min-height: 100vh;
    background-color: #F6F6F6;
    padding-bottom: 40rpx;
}

.profile-card {
    background: #FFFFFF;
    border-radius: 0 0 30rpx 30rpx;
    overflow: hidden;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.profile-header {
    position: relative;
    // height: 300rpx;
}

.bg-image {
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(2px);
    opacity: 0.8;
}

.profile-info {
	background: linear-gradient(180deg, #ff6043 51%, rgba(255, 96, 67, 0) 99%);
    position: relative;
    // padding: 40rpx;
    padding: 40rpx 10rpx 40rpx 40rpx;
    display: flex;
    align-items: center;
    z-index: 1;
	width: 100%;
	box-sizing: border-box;
	align-items: flex-start; /* 修改为顶部对齐 */
	
	.headLeft{
		flex: 0 0 50%;
		display: flex;
		max-width: 50%;
		.avatar {
		    width: 120rpx;
		    height: 120rpx;
		    border-radius: 60rpx;
		    border: 6rpx solid #FFFFFF;
		}
	
		.info-text {
			padding-top: 20rpx;
			margin-left: 20rpx;
		}
	}
	
	.headRight{
		flex: 0 0 50%;
		display: flex;
		position: relative; /* 关键修改：添加定位上下文 */
		flex-direction: row; /* 改为纵向布局 */
		align-items: center; /* 右侧对齐 */
		padding-left: 20rpx; /* 添加间距 */
		box-sizing: border-box;
		margin-top: 16rpx; /* 添加顶部间距 */
		// justify-content: center; align-items: center;
		// justify-content: space-evenly;
		// justify-content: flex-end; 
		.member-tag {
		  display: flex;
		  flex-wrap: wrap;
		  max-width: 80%;
		  align-items: center;
		  background: rgba(255,255,255,0.2);
		  padding: 4rpx 16rpx;
		  border-radius: 24rpx;
		  // width: fit-content;
		  margin-right: auto; /* 新增：自动占据左侧空间 */
		  gap: 4rpx; /* 图标间距 */
		  text {
		    font-size: 24rpx;
		    margin-left: 8rpx;
		  }
		}
		
		.setting-icon{
			// position: absolute;
			left: 50%; /* 关键修改：定位到父容器水平中心 */
			// transform: translateX(-50%); /* 修正居中偏移 */
			// margin-left: auto;
			// right: 30px;
			// min-width: 55px;
			// justify-content: center;
			// align-items: center;
		}
		
	}
	
}

.nickname {
    font-size: 36rpx;
    /* color: #FFFFFF; */
    color: #000000;
    font-weight: bold;
    display: block;
    text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
}

.mobile{
	font-size: 18rpx;
}

.signature {
    font-size: 24rpx;
    // color: rgba(255,255,255,0.9);
    color: rgba(12,12,80,0.9);
    margin-top: 10rpx;
    display: block;
}

.profile-stats {
    display: flex;
    padding: 30rpx 0;
    background: #FFFFFF;
}

.stat-item {
    flex: 1;
    text-align: center;
    border-right: 1rpx solid #EEEEEE;
}

.stat-item:last-child {
    border-right: none;
}

.num {
    font-size: 36rpx;
    color: #333333;
    font-weight: bold;
    display: block;
}

.label {
    font-size: 24rpx;
    color: #999999;
    margin-top: 6rpx;
    display: block;
}

.feature-section, .recent-section {
    background: #FFFFFF;
    border-radius: 20rpx;
    margin: 30rpx 20rpx;
    padding: 30rpx;
}

.section-title {
    font-size: 32rpx;
    color: #333333;
    font-weight: bold;
    margin-bottom: 30rpx;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30rpx;
}

.feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.feature-icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
}

.feature-name {
    font-size: 26rpx;
    color: #666666;
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.activity-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background: #F8F8F8;
    border-radius: 16rpx;
}

.activity-image {
    width: 80rpx;
    height: 80rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
}

.activity-content {
    flex: 1;
}

.activity-title {
    font-size: 28rpx;
    color: #333333;
    display: block;
}

.activity-time {
    font-size: 24rpx;
    color: #999999;
    margin-top: 6rpx;
    display: block;
}



.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30rpx;
  margin-bottom: 30rpx;

  .action-item {
    background: #fff;
    border-radius: 24rpx;
    padding: 30rpx 20rpx;
    text-align: center;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);

    .action-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 40rpx;
      margin: 0 auto 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-name {
      font-size: 26rpx;
      color: #666;
    }
  }
}

.service-list {
  background: #fff;
  border-radius: 24rpx;
  padding: 10rpx 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);

  .service-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 0;
    border-bottom: 2rpx solid #f5f6fa;

    &:last-child {
      border-bottom: none;
    }

    .left {
      display: flex;
      align-items: center;

      .service-icon {
        width: 64rpx;
        height: 64rpx;
        border-radius: 32rpx;
        margin-right: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .service-name {
        font-size: 28rpx;
        color: #333;
      }
    }

    .right {
      display: flex;
      align-items: center;

      .desc {
        font-size: 24rpx;
        color: #999;
        margin-right: 16rpx;
      }
    }
  }
}

/* 背景色 */
.bg-red { background: #ff4d4f; }
.bg-blue { background: #1890ff; }
.bg-green { background: #52c41a; }
.bg-purple { background: #722ed1; }
.bg-orange { background: #fa8c16; }
.bg-cyan { background: #13c2c2; }
.bg-pink { background: #eb2f96; }
.bg-gray { background: #666666; }
.bg-manager{background: #5caafe;}
</style> 