<template>
    <view class="template-d">
        <!-- 顶部个人信息卡片 -->

    <!-- 服务菜单列表 -->
		<view class="service-list">
			
			<view class="service-item" style="display: block; align-items: center;" >
				<view style="display: flex; justify-content: space-between;">
					<view class="left" >
						<view class="service-icon bg-orange" >
							<uni-icons type="auth" size="20" color="#fff"></uni-icons>
						</view>
						<text class="service-name">状态</text>
					</view>
					<view class="right"> 
						<uni-data-select style="min-width: 280rpx;" v-model="jobUser.workStatus" :localdata="workStatus" ></uni-data-select>
						<!-- <uni-icons :type="timeSelectType" size="14" color="#999"></uni-icons> -->
					</view>
				</view>				
			</view>
			
			<view class="service-item" v-for="(item, index) in allServices.slice(0, 2)" :key="index" @click="navigateTo(item.path)" >
			
				<view class="left">
					<view class="service-icon" :class="item.class">
						<uni-icons :type="item.icon" size="20" color="#fff"></uni-icons>
					</view>
					<text class="service-name">{{ item.name }}</text>
				</view>
				
				<view class="right">
					<text v-if="item.desc" class="desc">{{ item.desc }}</text>
					<uni-icons type="right" size="14" color="#999"></uni-icons>
				</view>
			
			</view>
			
			<!-- 手机号授权 -->
			<view class="service-item" style="display: block; padding-top: 0rpx; align-items: center;" >
				<view style="display: flex; justify-content: space-between;">
					<view class="left" >
						<view class="service-icon bg-green" >
							<uni-icons type="locked-filled" size="20" color="#fff"></uni-icons>
						</view>
						<text class="service-name">授权开放手机号</text>
					</view>
					<view class="right">
						<uniListItem :titleStyle="handleTitleStyle(18)" :border="false" :show-switch="true" 
						@switchChange="handleSwitchChange" :switchObj="jobUser" :switchChecked="isShowMobile" :title="showMobileText" />
						<!-- <uni-icons type="right" size="14" color="#999"></uni-icons> -->
						<uni-icons :type="timeSelectType" size="14" color="#999"></uni-icons>
					</view>
				</view>
				<view :style="timeSelectStyle" style="margin-left: 80rpx;">
					<view style="display: flex; justify-content: space-between; ">
						<text>开放时间区间：</text>
						<picker mode="time" :value="startTime" start="00:00" end="23:59" @change="bindTimeChange($event, 0)">
							<view class="uni-input">{{startTime}}</view>
						</picker>
						<view style="margin: 0 5rpx 0 5rpx;">至</view>
						
						<picker mode="time" :value="endTime" start="00:00" end="23:59" @change="bindTimeChange($event, 1)">
							<view class="uni-input">{{endTime}}</view>
						</picker>
					</view>
					<view style="display: flex; align-items: center; margin-top: 10rpx; ">
						<text>开放重复周期：</text>
						<view class="content">
						    <view class="picker-container" style="min-width: 280rpx; margin-left: 60rpx;">
						      <picker mode="selector" :range="firstLevelOptions" range-key="text" @change="handleFirstLevelChange">
						        <view class="picker-view">
						           {{ firstLevelText || '请选择' }}
						        </view>
						      </picker>
						      <view v-if="secondLevelOptions.length > 0">
						        <checkbox-group @change="handleSecondLevelChange">
						          <label v-for="(option, index) in secondLevelOptions" :key="index" style="display: block;">
						            <checkbox :value="option.value" :checked="secondLevelSelected.includes(option.value)" />
						            {{ option.text }}
						          </label>
						        </checkbox-group>
						      </view>
						    </view>
						  </view>
					</view>
				</view>
				
			</view>
			
			<button type="primary" @click="logout">退出登录</button>
		</view>


    </view>
</template>

<script>

    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	const SYS_ID = 2025040301;
	const JOB_TOKEN = 'JOB_TOKEN';
	const JOB_USER_FONT_SET = "jobUserMySet";

export default {
	components: { uniListItem },
	onLoad() {
		// 获取用户信息
		const _this = this
		uni.getStorage({
			key: JOB_TOKEN,
			success: function(resp){
				_this.userToken = resp.data
				// 加载用户信息
				_this.getJobUserByUserId();
				// console.log("缓存取值："+ JSON.stringify(_this.userToken))
			},
			fail:function(){
			}
		});
	},
    data() {
        return {
			userToken:{},
			repeatCycle: 1,
			jobUser: {
				// avatar: '/static/logo.png',
				// username: '',
				// phone: '15555555555',
				showMobile: 1,
				workStatus: 0, 
			},
			isShowMobile: false,
			showMobileText: "未授权",
            features: [
                { name: '我的收藏', icon: 'star-filled', bgColor: '#FFE8E8', iconColor: '#FF4D4F', path: '/pages/collect' },
                { name: '历史记录', icon: 'refresh', bgColor: '#E6F7FF', iconColor: '#1890FF', path: '/pages/history' },
                { name: '我的订单', icon: 'bars', bgColor: '#F6FFED', iconColor: '#52C41A', path: '/pages/order' },
                { name: '积分商城', icon: 'gift-filled', bgColor: '#FFF7E6', iconColor: '#FA8C16', path: '/pages/points' },
                { name: '客户服务', icon: 'chat-filled', bgColor: '#F9F0FF', iconColor: '#722ED1', path: '/pages/service' },
                { name: '设置', icon: 'gear-filled', bgColor: '#F0F5FF', iconColor: '#2F54EB', path: '/pages/job/user/user_add' }
            ],
            activities: [
                { title: '浏览了《产品设计》', 	time: '2分钟前', 	image: '/static/logo.png' },
                { title: '收藏了《UI设计》', 		time: '1小时前', 	image: '/static/logo.png' },
                { title: '点赞了《前端开发》', 	time: '2小时前', 	image: '/static/logo.png' }
            ],
			allServices: [
				{ name: '个人资料', icon: 'wallet-filled', path: '/pages/job/user/user_add', class: 'bg-red' },
				{ name: '清理缓存', icon: 'trash-filled', path: '/pages/job/user/clear_store', class: 'bg-blue' },
				{ name: '推送功能', icon: 'download-filled', path: '/pages/address/list', class: 'bg-green' },
				{ name: '指纹解锁', icon: 'circle-filled', path: '/pages/coupon/list', class: 'bg-purple' },
				
				{ name: '客服中心', icon: 'headphones', path: '/pages/job/online/talk_list', class: 'bg-orange', desc: '留言' },
				{ name: '帮助中心', icon: 'help', path: '/pages/help/index', class: 'bg-cyan' },
				{ name: '意见反馈', icon: 'chat', path: '/pages/job/suggest/suggest', class: 'bg-pink' },
				{ name: '设置', icon: 'gear', path: '/pages/job/user/user_add', class: 'bg-gray' }
			],
			fontSizeScale: 100, // 默认100%比例
			baseFontSize: 16,
			
			startTime: '09:00',
			endTime: '18:00',
			hideSecond: true,
			
			
			selectedFirstLevel: 0,
			firstLevelText: '每天',
			secondLevelOptions: [],
			secondLevelSelected: [],
			firstLevelOptions:[
				{
					text: "每天",
					value: 0,
				}, {
					text: "一次",
					value: 10,
				}, {
					text: "法定工作日",
					value: 20,
				}, {
					text: "法定节假日",
					value: 30,
				}, {
					text: "周一至周五",
					value: 40,
				}, {
					text: "自定义",
					value: 50,
					children: [
						{
							text: '星期一',
							value: 51
						},
						{
							text: '星期二',
							value: 52
						},
						{
							text: '星期三',
							value: 53
						},
						{
							text: '星期四',
							value: 54
						},
						{
							text: '星期五',
							value: 55
						},
						{
							text: '星期六',
							value: 56
						},
						{
							text: '星期日',
							value: 57
						}
					]
				}
			],
			timeSelectStyle: 'display: none;',
			timeSelectType: 'right',
			
			workStatus:[
				{
					text: "开放接单中",
					value: 0,
				},{
					text: "工作中",
					value: 10,
				},{
					text: "休假中",
					value: 20,
				},
			],
			
        }
    },
    methods: {
		logout(){
			uni.showModal({
				title: '提示',
				content: '确实要退出登录？',
				confirmText: '退出登录',
				cancelText: '保持登录',
				success: (res) => {
					if (res.confirm) {
						// uni.removeStorage({key:JOB_TOKEN});
						uni.removeStorageSync(JOB_TOKEN);
						uni.reLaunch({url:'/pages/job/index'});
						// 跳转 登录页
						// uni.navigateTo({ url: '/pages/job/index' });
					}
				}
			});
		},
		
		getJobUserByUserId(){
			const _this = this;
			uni.request({
				url: process.env.UNI_BASE_URL+'/api/job/getUser',  // 用户数据
				data: {sysId: SYS_ID, userId: this.userToken.userId, selfId: this.userToken.userId, token: this.userToken.token},
				method: 'POST',
				header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				success: result => {
					// console.log('userStream 返回值' + JSON.stringify(result));
					if (result.statusCode == 200 && result.data.code == 0) {
						const respData = result.data.data;
						console.log("user_setting.getUser返回值："+JSON.stringify(respData))
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
							// console.log("转化后："+JSON.stringify(respData))
						};
						_this.jobUser = respData;
						_this.handleOpen(_this.jobUser.showMobile == 0);
						_this.allServices[6].path = `/pages/job/suggest/suggest?userId=${_this.jobUser.userId}`
					}
				},
				fail: (result, code) => {
					console.log('fail' + JSON.stringify(result));
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
		
		navigateTo(path) {
		  uni.navigateTo({ url: path })
		},
        handleFeature(item) {
            uni.navigateTo({
                url: item.path
            });
        },
		
		handleSwitchChange(e){
			if(!this.userToken){
				uni.showToast({ title: '先登录，才能有效收藏！', icon: 'none' });
				return;
			}
			console.log("用户:", JSON.stringify(e.switchObj), "改变值:", e.data);
			const obj = e.switchObj ;
			const isOpen = e.data ;
			this.handleOpen(isOpen);
			if(isOpen){
				this.updateUser(0);
			}else{
				this.updateUser(1);
			}
		},
		
		handleOpen(isOpen){
			if(isOpen){
				this.isShowMobile = true
				this.showMobileText = "已授权";
				this.timeSelectStyle= "display: block;"
				this.timeSelectType	= 'down';
				return;
			}
			this.isShowMobile = false
			this.showMobileText = "未授权";
			this.timeSelectStyle= "display: none;";
			this.timeSelectType	= 'right';
			this.rebackEmpty();
		},
		
		rebackEmpty(){
			this.selectedFirstLevel	= null;
			this.firstLevelText		= '';
			this.secondLevelOptions	= [];
			this.secondLevelSelected= [];
		},
		
		updateUser(showMobile){
			let user = {}
			user.sysId	= SYS_ID
			user.token 	= this.userToken.token;
			user.selfId = this.userToken.userId;
			user.userId = this.userToken.userId;
			user.showMobile = showMobile
			uni.request({
				url: process.env.UNI_BASE_URL+ '/api/job/updateUser',
				header: { 'Content-Type': 'application/json' },
				method: 'POST',
				data: JSON.stringify(user),
				success() {
					// uni.showToast({ title: `授权已变更！` });
				},
				fail() {
					// uni.showToast({ title: '授权失败，请稍后重试！', icon: 'none' });
				}
			});
		},
		
		handleTitleStyle(baseFontSize=16) {
			var fontSize = baseFontSize * (this.fontSizeScale / 100);
			return 'color: #000000; fontSize: '+fontSize+'px; font-size: '+fontSize+'px;';
		},
		
		handleFirstLevelChange(e) {
			const selectedIndex = e.detail.value;
			this.selectedFirstLevel = this.firstLevelOptions[selectedIndex].value;
			this.firstLevelText = this.firstLevelOptions[selectedIndex].text;
			this.secondLevelOptions = this.firstLevelOptions[selectedIndex].children?this.firstLevelOptions[selectedIndex].children:[];
			this.secondLevelSelected = [];
		},
		handleSecondLevelChange(e) {
			this.secondLevelSelected = e.detail.value;
			console.log('Selected First Level:', this.selectedFirstLevel);
			console.log('Selected Second Level:', this.secondLevelSelected);
		},
		bindTimeChange(e, index) {
			if(index == 0) this.startTime 	= e.detail.value
			if(index == 1) this.endTime 	= e.detail.value
		},
		getTime(date){
			date = new Date(date)
			const hour = date.getHours()
			const minute = date.getMinutes()
			const second = date.getSeconds()
			return this.hideSecond ? `${this.addZero(hour)}:${this.addZero(minute)}` : `${this.addZero(hour)}:${this.addZero(minute)}:${this.addZero(second)}`
		},
		addZero(num) {
			if (num < 10) {
				num = `0${num}`
			}
			return num
		}
    },
	computed:{
		isShowMobile(){
			if(this.jobUser.showMobile == 0){
				this.jobUser.isShowMobile = true
				this.showMobileText = "已授权";
				return true;
			}
			this.jobUser.isShowMobile = false
			this.showMobileText = "未授权";
			return false;
		}
	},
	
	watch: {
		datetimeRange() {
			console.log('日期时间范围选:', this.datetimeRange);
		}
	}
}
</script>

<style lang="scss">

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
  
  button{
  	margin-top: 20px;
  	background-color: #52c41a;
  	color: #000000;
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


.content {
  // padding: 20px;
}

.picker-container {
  // margin-bottom: 20px;
}

.picker-view {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style> 