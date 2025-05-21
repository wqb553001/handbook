<template>
    <view class="template-d">
        <!-- 顶部个人信息卡片 -->
        <view class="profile-card">
            <view class="profile-header">
                <!-- <image class="bg-image" src="/static/logo.png" mode="aspectFill" /> -->
                <view class="profile-info">
					<view class="headLeft">
						<view class="headImg">
							<image class="avatar" :src="jobUser.headImgPath" mode="aspectFill" />
							<!-- <image v-show="!isLogined" class="avatar" :src="jobUser.headImgPath" mode="aspectFill" /> -->
							<!-- <uni-icons v-if="!isLogined" type="contact" class="avatar" size="14" color="#FFD700"></uni-icons> -->
						</view>
						
						<view class="info-text">
							<view style="display: flex;">
								<text v-if="isLogined" class="nickname">{{  jobUser.username  }}</text>
								<text v-else class="nickname" @click="navigateTo(`/pages/job/index`)">登录</text>
								<text v-if="isLogined" class="mobile" style="align-items: flex-end;">{{  jobUser.mobile?.slice(-4)  }}</text>
							</view>
							
							<text class="signature">{{ jobUser.skillsName }}</text>
						</view>
					</view>
					<view class="headRight">
						<view class="member-tag">
							<uni-icons type="star" v-for="(item, index) in jobUser.multiScore" :key="index" size="14" color="#FFD700"></uni-icons>
							<text>劳模</text>
						</view>
						<view class="setting-icon">
							<uni-icons type="gear" size="28" color="#fff" @click="navigateTo('/pages/job/user/user_setting')"></uni-icons>
						</view>
					</view>
					
                </view>
            </view>
		
			<view class="slider-container" style="z-index: 9999;">
				<u-slider v-model="fontSizeScale"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9"
				 min="50" max="200" step="10" block-size="20" @changing="onFontSizeChange" show-value></u-slider>
				<!-- <text style="text-align: center; display: block;">字体缩放比例：{{fontSizeScale}}%</text> -->
			</view>
            <view class="profile-stats">
                <view class="stat-item">
                    <text class="num">1280</text>
            		<uni-icons type="hand-up-filled" size="28" color="#FFCC33" ></uni-icons>
                    <text class="label">获赞</text>
                </view>
                <view class="stat-item">
                    <text class="num">328</text>
            		<uni-icons type="star-filled" size="28" color="#FFCC33" ></uni-icons>
                    <text class="label">收藏</text>
                </view>
                <view class="stat-item">
                    <text class="num">999</text>
            		<uni-icons type="redo-filled" size="28" color="#FFCC33" ></uni-icons>
                    <text class="label">分享</text>
                </view>
            </view>
        </view>


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
	
const SYS_ID = 2025040301;
const JOB_TOKEN = 'JOB_TOKEN';
const JOB_USER_FONT_SET = "jobUserMySet";
const JOB_OPT_HISTORY_RECORD = 'JOB_OPT_HISTORY_RECORD';

export default {
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
				if(_this.userToken?.userId>0) _this.isLogined = true
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
			historyRecord: []
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
					console.log("缓存取值："+ JSON.stringify(_this.historyRecord));
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