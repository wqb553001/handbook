<template>
  <view class="agreement-container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">服务条款</text>
      <text class="subtitle">Service Agreement</text>
      <text class="update-time">更新时间：2024-03-21</text>
    </view>
    
    <!-- 内容区域 -->
    <scroll-view scroll-y class="content">
      <!-- 前言 -->
      <view class="section">
        <view class="section-title">前言</view>
        <view class="section-content">
          欢迎使用我们的快递服务。在使用我们的服务之前，请您仔细阅读以下全部内容。
        </view>
      </view>
      
      <!-- 定义 -->
      <view class="section">
        <view class="section-title">1. 定义</view>
        <view class="section-content">
          <view class="item">
            1.1 "服务"是指我们提供的快递、物流及相关服务。
          </view>
          <view class="item">
            1.2 "用户"是指使用我们服务的个人或组织。
          </view>
        </view>
      </view>
      
      <!-- 服务内容 -->
      <view class="section">
        <view class="section-title">2. 服务内容</view>
        <view class="section-content">
          <view class="item">
            2.1 快递服务范围包括但不限于：
            <view class="sub-item">• 国内快递服务</view>
            <view class="sub-item">• 国际快递服务</view>
            <view class="sub-item">• 仓储物流服务</view>
          </view>
          <view class="item">
            2.2 服务时效：我们将尽最大努力在承诺的时间内完成配送。
          </view>
        </view>
      </view>
      
      <!-- 用户权利与义务 -->
      <view class="section">
        <view class="section-title">3. 用户权利与义务</view>
        <view class="section-content">
          <view class="item">
            3.1 用户应当：
            <view class="sub-item">• 提供真实、准确的收寄信息</view>
            <view class="sub-item">• 遵守相关法律法规</view>
            <view class="sub-item">• 按约定支付服务费用</view>
          </view>
        </view>
      </view>
      
      <!-- 隐私保护 -->
      <view class="section">
        <view class="section-title">4. 隐私保护</view>
        <view class="section-content">
          <view class="item">
            4.1 我们将严格保护用户的个人信息，未经用户同意不会向第三方披露。
          </view>
        </view>
      </view>
      
      <!-- 免责声明 -->
      <view class="section">
        <view class="section-title">5. 免责声明</view>
        <view class="section-content">
          <view class="item">
            5.1 因不可抗力导致的服务延误或损失，我们不承担责任。
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部按钮 -->
    <view class="footer">
      <button class="agree-btn" @tap="handleAgree">同意并继续</button>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleAgree = () => {
  // 处理同意操作
  uni.setStorageSync('agreement_accepted', true)
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.agreement-container {
  min-height: 100vh;
  background: #fff;
  padding-bottom: env(safe-area-inset-bottom);
  
  .header {
    padding: 40rpx 32rpx;
    text-align: center;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
    
    .title {
      font-size: 46rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 12rpx;
    }
    
    .subtitle {
      font-size: 24rpx;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 2rpx;
      display: block;
	  padding-top: 5px;
    }
    
    .update-time {
      font-size: 24rpx;
      color: #999;
      margin-top: 16rpx;
      display: block;
    }
  }
  
  .content {
    height: calc(100vh - 300rpx);
    padding: 32rpx;
    box-sizing: border-box;
    
    .section {
      margin-bottom: 40rpx;
      animation: fadeIn 0.5s ease-out;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .section-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 24rpx;
        display: flex;
        align-items: center;
        
        &::before {
          content: '';
          width: 6rpx;
          height: 32rpx;
          background: #2b85ff;
          margin-right: 16rpx;
          border-radius: 6rpx;
        }
      }
      
      .section-content {
        color: #666;
        line-height: 1.6;
        font-size: 28rpx;
        
        .item {
          margin-bottom: 20rpx;
          padding-left: 20rpx;
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 16rpx;
            width: 8rpx;
            height: 8rpx;
            background: #2b85ff;
            border-radius: 50%;
          }
        }
        
        .sub-item {
          margin: 16rpx 0 16rpx 24rpx;
          color: #666;
          font-size: 26rpx;
        }
      }
    }
  }
  
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 24rpx 32rpx;
    background: #fff;
    box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.05);
    
    .agree-btn {
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background: #2b85ff;
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
      border-radius: 44rpx;
      letter-spacing: 2rpx;
      
      &:active {
        transform: scale(0.98);
        opacity: 0.9;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 