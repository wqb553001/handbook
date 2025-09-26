<!-- ProfileCard.vue -->
<template>
  <view class="profile-card">
    <!-- 顶部个人信息卡片 -->
    <view class="profile-header">
      <view class="profile-info">
        <view class="headLeft">
          <view class="headImg" @longpress="$emit('longpress-avatar')">
            <image class="avatar" :src="jobUser.headImgPath" mode="aspectFill" />
          </view>
          
          <view class="info-text">
            <view style="display: flex;" :style="fontSet">
              <text class="nickname" :style="fontSet">{{ jobUser.username }}</text>
              <text class="mobile" :style="fontSet" style="align-items: flex-end;">{{ jobUser.mobile?.slice(-4) }}</text>
            </view>
          </view>
        </view>
        
        <view class="headRight">
          <view v-if="isLogined" class="member-tag">
            <uni-icons 
              type="star" 
              v-for="(item, index) in jobUser.multiScore" 
              :key="index" 
              :size="18*fontScale" 
              color="#FFD700"
            ></uni-icons>
            <text :style="fontSet">{{ scoreText }}</text>
          </view>
          <view v-if="isLogined" class="setting-icon">
            <uni-icons 
              type="gear" 
              :size="23*fontScale" 
              color="#fff" 
              @click="$emit('navigate-to-logined', '/pages/job/user/user_setting')"
            ></uni-icons>
          </view>
          
          <view v-if="!isLogined">
            <text 
              class="nickname" 
              :style="fontSet" 
              @click="$emit('navigate-to-go', '/pages/job/index')"
            >登录/注册</text>
          </view>
        </view>
      </view>
    </view>
  
    <view class="slider-container" style="z-index: 9999;">
      <u-slider 
        v-model="internalFontSizeScale"  
        activeColor="#FFCC33" 
        backgroundColor="#000000" 
        block-color="#8A6DE9"
        min="50" 
        max="200" 
        step="10" 
        block-size="20" 
        @changing="onFontSizeChange" 
        show-value
      ></u-slider>
    </view>
    
    <view v-if="isLogined" class="profile-stats">
      <view class="stat-item">
        <text class="num" :style="fontSet">{{ stats.likes || 1280 }}</text>
        <uni-icons type="hand-up-filled" :size="23*fontScale" color="#FFCC33"></uni-icons>
        <text class="label" :style="fontSet">获赞</text>
      </view>
      <view class="stat-item">
        <text class="num" :style="fontSet">{{ stats.favorites || 128 }}</text>
        <uni-icons type="star-filled" :size="23*fontScale" color="#FFCC33"></uni-icons>
        <text class="label" :style="fontSet">收藏</text>
      </view>
      <view class="stat-item">
        <text class="num" :style="fontSet">{{ stats.shares || 59 }}</text>
        <uni-icons type="redo-filled" :size="23*fontScale" color="#FFCC33"></uni-icons>
        <text class="label" :style="fontSet">分享</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProfileCard',
  props: {
    isLogined: {
      type: Boolean,
      default: false
    },
    jobUser: {
      type: Object,
      default: () => ({
        headImgPath: '',
        username: '',
        mobile: '',
        multiScore: 0
      })
    },
    fontSet: {
      type: String,
      default: ''
    },
    fontScale: {
      type: Number,
      default: 1.0
    },
    fontSizeScale: {
      type: Number,
      default: 100
    },
    stats: {
      type: Object,
      default: () => ({
        likes: 1280,
        favorites: 128,
        shares: 59
      })
    },
    scoreText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      internalFontSizeScale: this.fontSizeScale
    }
  },
  watch: {
    fontSizeScale(newVal) {
      this.internalFontSizeScale = newVal;
    }
  },
  methods: {
    onFontSizeChange(scale) {
      this.$emit('font-size-change', scale);
    }
  }
}
</script>

<style scoped>
.profile-card {
  background: #FFFFFF;
  border-radius: 0 0 30rpx 30rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.profile-header {
  position: relative;
}

.profile-info {
  background: linear-gradient(180deg, #ff6043 51%, rgba(255, 96, 67, 0) 99%);
  position: relative;
  padding: 40rpx 10rpx 40rpx 40rpx;
  display: flex;
  align-items: center;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  align-items: flex-start;
}

.headLeft {
  flex: 0 0 50%;
  display: flex;
  max-width: 50%;
}

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

.headRight {
  flex: 0 0 50%;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  padding-left: 20rpx;
  box-sizing: border-box;
  margin-top: 16rpx;
}

.member-tag {
  display: flex;
  flex-wrap: wrap;
  max-width: 80%;
  align-items: center;
  background: rgba(255,255,255,0.2);
  padding: 4rpx 16rpx;
  border-radius: 24rpx;
  margin-right: auto;
  gap: 4rpx;
}

.member-tag text {
  font-size: 24rpx;
  margin-left: 8rpx;
}

.nickname {
  font-size: 36rpx;
  color: #000000;
  font-weight: bold;
  display: block;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
}

.mobile {
  font-size: 18rpx;
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
</style>