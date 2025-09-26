<template>
    <view class="template-d">
        <!-- 顶部个人信息卡片 -->
<!-- 		<profile-card
		      :is-logined="isLogined"
		      :job-user="jobUser"
		      :font-set="fontSet"
		      :font-scale="fontScale"
		      :font-size-scale="fontSizeScale"
		      :stats="stats"
		      :score-text="scoreText"
		      @longpress-avatar="longPressEditHeadImage"
		      @navigate-to="navigateToLogined"
		      @font-size-change="onFontSizeChange"
		></profile-card> -->

        <!-- 最近动态 -->
        <view class="recent-section">
            <view class="section-title">最近动态</view>
            <view class="activity-list">
                <view class="activity-item" v-for="(item, index) in historyRecord" :key="index" >
                    <image class="activity-image" :src="item.image" mode="aspectFill" />
                    <view class="activity-content">
                        <text class="activity-title" @click="item.url?navigateTo(item.url):''">{{item.title}}</text>
                        <text class="activity-time">{{item.time}}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
	
import ProfileCard from '@/components/ProfileCard/ProfileCard.vue';

const SYS_ID = 2025040301;
const JOB_TOKEN = 'JOB_TOKEN';
const JOB_USER_FONT_SET = "jobUserMySet";
const JOB_OPT_HISTORY_RECORD = "JOB_OPT_HISTORY_RECORD";

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
	onShow() {
		// this.getToken();
		this.initGetFontSize(); // 页面重新加载-恢复
	},
	onLoad() {

	},
	mounted() {
		// 获取用户信息
		const _this = this
		uni.getStorage({
			key: JOB_TOKEN,
			success: function(resp){
				_this.userToken = resp.data
				_this.isLogined = false
				// 加载用户信息
				_this.getJobUserByUserId();
				if(_this.userToken?.token) _this.isLogined = true
				// console.log("缓存取值："+ JSON.stringify(_this.userToken))
				_this.readHistoryRecord();
			},
			fail:function(){
				 _this.isLogined = false
			}
		});
		
	},
    data() {
        return {
			isLogined: true,
			userToken:{},
			jobUser: {
				avatar: '/static/logo.png',
				username: '',
				phone: '15555555555'
			},
            activities: [
                { title: '浏览了《产品设计》', 	time: '2分钟前', 	image: '/static/logo.png' },
                { title: '收藏了《UI设计》', 		time: '1小时前', 	image: '/static/logo.png' },
                { title: '点赞了《前端开发》', 	time: '2小时前', 	image: '/static/logo.png' }
            ],
			fontSizeScale: 100, // 默认100%比例
			historyRecord: [],
			stats: {
				likes: 1280,
				favorites: 128,
				shares: 59
			  },
        }
    },
    methods: {
		
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
		readHistoryRecord() {
			this.historyRecord = [];
			// 获取用户信息
			const _this = this
			uni.getStorage({
				key: JOB_OPT_HISTORY_RECORD,
				success: function(resp){
					_this.historyRecord = resp.data
					// console.log("缓存取值："+ JSON.stringify(_this.historyRecord));
				},
				fail:function(){
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

</style> 