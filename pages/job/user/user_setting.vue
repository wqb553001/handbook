<template>
    <view class="template-d">
        <!-- 顶部个人信息卡片 -->

    <!-- 服务菜单列表 -->
		<view class="service-list">
			
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
		  
			<button type="primary" @click="logout">退出登录</button>
		</view>


    </view>
</template>

<script>
	
const SYS_ID = 2025040301;
const JOB_TOKEN = 'JOB_TOKEN';
const JOB_USER_FONT_SET = "jobUserMySet";

export default {
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
			jobUser: {
				avatar: '/static/logo.png',
				username: '',
				phone: '15555555555'
			},
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
							// console.log("转化后："+JSON.stringify(respData))
						};
						_this.jobUser = respData;
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

</style> 