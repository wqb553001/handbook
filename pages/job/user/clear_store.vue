<template>
    <view class="template-d">
        <!-- 顶部个人信息卡片 -->

    <!-- 服务菜单列表 -->
		<view class="service-list">
		  <button type="primary" @click='clearStore(0, "聊天", 		"JOB_TALK"				)'>聊天缓存</button>
		  <button type="primary" @click='clearStore(0, "位置", 		"map_Picker_Position"	)'>位置缓存</button>
		  <button type="primary" @click='clearStore(0, "浏览记录", 	"JOB_OPT_HISTORY_RECORD")'>浏览记录缓存</button>
		  <button type="primary" @click='clearStore(0, "字体", 		"jobUserMySet"			)'>字体大小缓存</button>
		  <button type="primary" @click='clearStore(0, "技能", 		"jobUserSkills"			)'>技能选项缓存</button>
		  <button type="primary" @click='logout()' style="background-color: #FF4D4F;">退出登录</button>
		  <!-- <button type="primary" @click='clearAllStore()'>所有缓存</button> -->
		</view>


    </view>
</template>

<script>
	
const SYS_ID = 2025040301;
const JOB_TOKEN = 'JOB_TOKEN';
const JOB_USER_FONT_SET = "jobUserMySet";
const JOB_OPT_HISTORY_RECORD = "JOB_OPT_HISTORY_RECORD";
const JOB_USER_SKILLS = "jobUserSkills"
const MAP_PICKER_POSITION = "map_Picker_Position"

export default {
    data() {
		userToken:{}
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
		// clearAllStore(){
		// 	const obj = "所有"
		// 	const storeKey = "storeKey"
		// 	uni.showModal({
		// 		title: '提示',
		// 		content: `确定需要清除${obj}缓存？`,
		// 		confirmText: '确定',
		// 		cancelText: '退出',
		// 		success: (res) => {
		// 			if (res.confirm) {
		// 				uni.removeStorage({key:storeKey});
		// 			}
		// 		}
		// 	});
		// },
		
		logout(){
			const obj = "登录"
			const _this = this
			uni.showModal({
				title: '提示',
				content: `确定需要清除${obj}缓存？`,
				confirmText: '确定',
				cancelText: '退出',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorage({key:JOB_TOKEN});
						
						_this.userToken.userId = null
						_this.userToken.token = null
						_this.userToken.level = null
						// 清空登录信息
						uni.setStorage({
							key:JOB_TOKEN,
							data: _this.userToken
						});
						// uni.getStorage({
						// 	key: JOB_TOKEN,
						// 	success: async function(resp){
						// 		_this.userToken = resp.data
						// 		// console.log("缓存取值："+ JSON.stringify(_this.userToken))
						// 		// if(_this.userToken?.userId) {
						// 		// 	_this.userToken.userId=null;
						// 		// 	_this.userToken.token=null;
						// 		// }
								
						// 		// 清空登录信息
						// 		uni.setStorage({
						// 			key:JOB_TOKEN,
						// 			data: {}
						// 		});
						// 	},
						// 	fail:function(){
						// 	},
						// 	complete() {
						// 	}
						// });
						
						
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