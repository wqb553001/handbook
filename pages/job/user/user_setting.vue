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
						<uni-data-select style="min-width: 280rpx;" v-model="userSchedule.workStatus" :localdata="workStatus" @change="workStatusChange"></uni-data-select>
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
						@switchChange="switchAuthoChange" :switchObj="userSchedule" :switchChecked="userSchedule?.showMobile==0" :title="showMobileText" />
						<!-- <uni-icons type="right" size="14" color="#999"></uni-icons> -->
						<uni-icons :type="timeSelectType" size="14" color="#999"></uni-icons>
					</view>
				</view>
				<view :style="timeSelectStyle" style="margin-left: 20rpx;">
					<view style="display: flex; justify-content: space-between; margin-top: 30rpx;">
						<text>开放时间区间：</text>
						<picker mode="time" :value="userSchedule.startTime" start="00:00" end="23:59" @change="bindTimeChange($event, 0)">
							<view class="uni-input">{{userSchedule.startTime}}</view>
						</picker>
						<view style="margin: 0 5rpx 0 5rpx;">至</view>
						
						<picker mode="time" :value="userSchedule.endTime" start="00:00" end="23:59" @change="bindTimeChange($event, 1)">
							<view class="uni-input">{{userSchedule.endTime}}</view>
						</picker>
					</view>
					<view style="display: flex; align-items: center; margin-top: 30rpx; ">
						<text>开放重复周期：</text>
						<view class="content">
						    <view class="picker-container" style="min-width: 200rpx; margin-left: 60rpx;">
						      <picker mode="selector" :value="cycleIndex" :range="cycleOptions" range-key="text" @change="handleCycleChange">
						        <view class="picker-view">
						           {{ cycleText }}
						        </view>
						      </picker>
						      <view v-if="customizeOptions.length > 0">
						        <checkbox-group @change="handleCustomizeChange">
						          <label v-for="(option, index) in customizeOptions" :key="index" style="display: block;">
						            <checkbox :value="option.value" :checked="customizeSelecteds.includes(option.value)" />
						            {{ option.text }}
						          </label>
						        </checkbox-group>
						      </view>
						    </view>
						</view>
						<button @click="submitSchedule" style="margin-top: 0px; background-color: #52c41a;">提交</button>
					</view>
				</view>
				
			</view>
			
			<!-- 底部固定容器 -->
<!-- 			<view class="fixed-bottom">
				<button type="warn" @click="logout" style="margin: 40rpx 10rpx 0; ">退出登录</button>
			</view> -->
			
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
				// 加载用户日程信息
				_this.getUserScheduleByUserId();
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
			userSchedule: {
				userId: 0,
				showMobile: 1,
				workStatus: 0,
				startTime: '09:00',
				endTime: '18:00',
				cycle: 0,
				customize:[]
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
			
			hideSecond: true,
			
			
			cycleSelectedIndex: 0,
			// cycleText: '每天',
			customizeOptions: [],
			customizeSelecteds: [],
			cycleOptions:[
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
			
			workStatus: [
				{
					text: "开放接单中",
					value: 0,
				},{
					text: "工作繁忙中",
					value: 10,
				},{
					text: "闭关休假中",
					value: 20,
				},
			],
			
        }
    },
    methods: {
		workStatusChange(e) {
			// console.log('Selected value changed:', e);
			// console.log('Selected value changed:', e.detail.value);
			this.updateUserSchedule({workStatus: e});
		},
		
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
		
		getUserScheduleByUserId(){
			const _this = this;
			uni.request({
				url: process.env.UNI_BASE_URL + '/api/job/getUserSchedule',  // 用户数据
				data: {sysId: SYS_ID, userId: this.userToken.userId, selfId: this.userToken.userId, token: this.userToken.token},
				method: 'POST',
				header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				success: result => {
					// console.log('userStream 返回值' + JSON.stringify(result));
					if (result.statusCode == 200 && result.data.code == 0) {
						const respData = result.data.data;
						// console.log("user_setting.getUserSchedule返回值："+JSON.stringify(respData))
						if(respData) {
							_this.userSchedule = respData;
							
							// _this.userSchedule = respData;
							// console.log("转化前："+respData.skills)
							// console.log("转化后 _this.userSchedule?.customize ：" + JSON.stringify(_this.userSchedule?.customize))
							// const cusArrStr = _this.userSchedule?.customize?.replace(/^"|"$/g, '');
							// _this.customizeSelecteds = cusArrStr?JSON.parse(cusArrStr):[],
							_this.dataHandle();
							// console.log("转化后 _this.customizeSelecteds ：" + JSON.stringify(_this.customizeSelecteds))
							_this.handleOpen(_this.userSchedule.showMobile == 0);
							_this.allServices[6].path = `/pages/job/suggest/suggest?userId=${_this.userToken.userId}`
						};
						
					}
				},
				fail: (result, code) => {
					console.log('fail' + JSON.stringify(result));
				}
			});
		},
		
		dataHandle(){
			try {
			  const customData = this.userSchedule.customize?.replace(/^"|"$/g, '') || '[]';
			  // 字符串转数值数组
			  this.customizeSelecteds = JSON.parse(customData).map(Number);
			} catch (e) {
			  // console.error("解析 customize 失败", e);
			  this.customizeSelecteds = [];
			}
			// 修复2: 当 cycle=50 时初始化 customizeOptions
			if (this.userSchedule.cycle === 50) {
			  const customOption = this.cycleOptions.find(
			    opt => opt.value === 50
			  );
			  if (customOption && customOption.children) {
			    this.customizeOptions = customOption.children;
			  }
			}
		},
		
		navigateTo(path) {
		  uni.navigateTo({ url: path })
		},
		
        handleFeature(item) {
            uni.navigateTo({
                url: item.path
            });
        },
		
		switchAuthoChange(e){
			if(!this.userToken){
				uni.showToast({ title: '登录后请下拉刷新！', icon: 'none' });
				return;
			}
			// console.log("用户:", JSON.stringify(e.switchObj), "改变值:", e.data);
			const obj = e.switchObj ;
			const isOpen = e.data ;
			this.handleOpen(isOpen);
			let showMobile = 1
			if(isOpen){
				showMobile = 0
			}
			this.updateUserSchedule({showMobile: showMobile});
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
			this.cycleSelectedIndex	= 0;
			// this.cycleText		= '每天';
			this.customizeOptions	= [];
			this.customizeSelecteds	= [];
		},
		submitSchedule(){
			delete this.userSchedule.enabled;
			delete this.userSchedule.createTime;
			delete this.userSchedule.updateTime;
			this.updateUserSchedule(this.userSchedule)
		},
		updateUserSchedule(form){
			form.id 		= this.userSchedule?.id;
			form.sysId		= SYS_ID;
			form.token 		= this.userToken.token;
			form.selfId 	= this.userToken.userId;
			form.userId 	= this.userToken.userId;
			// console.log("提交前参数：", JSON.stringify(form))
			uni.request({
				url: process.env.UNI_BASE_URL + '/api/job/updateUserSchedule',
				header: { 'Content-Type': 'application/json' },
				method: 'POST',
				data: JSON.stringify(form),
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
		// 循环规则
		handleCycleChange(e) {
		  const selectedIndex = e.detail.value;
		  const selectedOption = this.cycleOptions[selectedIndex];
		  
		  // 直接更新 userSchedule
		  this.userSchedule.cycle = selectedOption.value;
		  
		  // 如果是自定义选项，初始化选择
		  this.customizeOptions = selectedOption.children || [];
		  if (selectedOption.value !== 50) {
		    this.userSchedule.customize = '[]'; // 清空自定义选项
		    this.customizeSelecteds = [];
			// console.log('handleCycleChange.Selected First Level:', this.cycleSelectedIndex);
			// console.log('handleCycleChange.Selected Second Level:', this.customizeSelecteds);
		  }
		},
		// 自定义 循环规则
		handleCustomizeChange(e) {
			this.customizeSelecteds = e.detail.value.map(Number);
			this.userSchedule.customize = JSON.stringify(this.customizeSelecteds);
			// console.log('handleCustomizeChange.Selected First Level:', this.cycleSelectedIndex);
			// console.log('handleCustomizeChange.Selected Second Level:', this.customizeSelecteds);
		},
		bindTimeChange(e, index) {
			if(index == 0) this.userSchedule.startTime 	= e.detail.value
			if(index == 1) this.userSchedule.endTime 	= e.detail.value
			// console.log('startTime:', this.userSchedule.startTime);
			// console.log('endTime:', this.userSchedule.endTime);
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
		cycleText() {
		 // 如果userSchedule.cycle有值，则从cycleOptions中寻找匹配项
		 if (this.userSchedule.cycle !== undefined && this.userSchedule.cycle !== null) {
			const option = this.cycleOptions.find(item => item.value === this.userSchedule.cycle);
			return option ? option.text : '请选择';
		 }
		 return '请选择';
		},
		 cycleIndex() {
		   // 在cycleOptions中查找与当前userSchedule.cycle相等的value对应的索引
		   const index = this.cycleOptions.findIndex(item => item.value === this.userSchedule.cycle);
		   // 如果没找到，默认返回0（即第一个选项）
		   return index === -1 ? 0 : index;
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
  	// background-color: #52c41a;
  	color: #000000;
  }
}

/* 新增底部固定容器样式 */
.fixed-bottom {
  position: fixed;
  bottom: 180rpx;
  left: 30rpx;
  right: 30rpx;
  z-index: 100;
}

.logout-btn {
  width: 100%;
  background-color: #ff4d4f !important;
  color: #fff !important;
  border-radius: 50rpx;
  font-size: 32rpx;
  height: 80rpx;
  line-height: 80rpx;
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