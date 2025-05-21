<template>
    <view class="template-d">
        <!-- 顶部个人信息卡片 -->

    <!-- 服务菜单列表 -->
		<view class="service-list">
		  <button type="primary" @click="clearStore(0, '聊天', 		'JOB_TALK'				)">聊天缓存</button>
		  <button type="primary" @click="clearStore(0, '浏览记录', 	'JOB_OPT_HISTORY_RECORD')">浏览记录缓存</button>
		  <button type="primary" @click="clearStore(0, '字体', 		'jobUserMySet'			)">字体大小缓存</button>
		  <button type="primary" @click="logout()">退出登录</button>
		  <button type="primary" @click="clearAllStore()">所有缓存</button>
		</view>


    </view>
</template>

<script>
	
const SYS_ID = 2025040301;
const JOB_TOKEN = 'JOB_TOKEN';
const JOB_USER_FONT_SET = "jobUserMySet";
const JOB_OPT_HISTORY_RECORD = 'JOB_OPT_HISTORY_RECORD';

export default {
    data() {
        return {
			userToken:{},
			jobUser: {
				avatar: '/static/logo.png',
				username: '',
				phone: '15555555555'
			},
			fontSizeScale: 100, // 默认100%比例
        }
    },
    methods: {
		clearStore(type, obj, storeKey){
			// uni.removeStorage({key: ''})
			uni.showModal({
				title: '提示',
				content: `确定需要清除${obj}缓存？`,
				confirmText: '确定',
				cancelText: '退出',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorage({key:storeKey});
					}
				}
			});
		},
		clearAllStore(){
			const obj = "所有"
			const storeKey = "storeKey"
			uni.showModal({
				title: '提示',
				content: `确定需要清除${obj}缓存？`,
				confirmText: '确定',
				cancelText: '退出',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorage({key:storeKey});
					}
				}
			});
		},
		clearAll(){
			
		},
		logout(){
			const obj = "登录"
			uni.showModal({
				title: '提示',
				content: `确定需要清除${obj}缓存？`,
				confirmText: '确定',
				cancelText: '退出',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorageSync(JOB_TOKEN);
						this.reload();
						// 跳转 登录页
						uni.navigateTo({ url: '/pages/job/index' });
					}
				}
			});
		},
		
    }
}
</script>

<style lang="scss">


.service-list {
  background: #fff;
  border-radius: 24rpx;
  padding: 10rpx 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
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