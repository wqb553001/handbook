<template>
  <view class="privacy-container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">隐私政策</text>
      <text class="subtitle">Privacy Policy</text>
      <text class="update-time">更新时间：2024-03-21</text>
    </view>
    
    <!-- 内容区域 -->
    <scroll-view scroll-y class="content">
      <!-- 引言 -->
      <view class="section">
        <view class="section-title">引言</view>
        <view class="section-content">
          本隐私政策帮助您了解我们如何收集、使用、存储和保护您的个人信息，以及您享有的相关权利。请您仔细阅读并确认了解本隐私政策所有内容。
        </view>
      </view>
      
      <!-- 信息收集 -->
      <view class="section">
        <view class="section-title">1. 信息收集</view>
        <view class="section-content">
          <view class="item">
            1.1 我们收集的信息包括：
            <view class="sub-item">
              <text class="dot">•</text>
              <text>账户信息（用户名、手机号、邮箱等）</text>
            </view>
            <view class="sub-item">
              <text class="dot">•</text>
              <text>身份信息（姓名、身份证号等）</text>
            </view>
            <view class="sub-item">
              <text class="dot">•</text>
              <text>位置信息（收货地址、当前位置等）</text>
            </view>
            <view class="sub-item">
              <text class="dot">•</text>
              <text>设备信息（设备型号、操作系统等）</text>
            </view>
          </view>
          
          <view class="item">
            1.2 信息收集方式：
            <view class="sub-item">
              <text class="dot">•</text>
              <text>您主动提供的信息</text>
            </view>
            <view class="sub-item">
              <text class="dot">•</text>
              <text>在您使用服务过程中产生的信息</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 信息使用 -->
      <view class="section">
        <view class="section-title">2. 信息使用</view>
        <view class="section-content">
          <view class="item">
            2.1 我们使用您的信息用于：
            <view class="sub-item">
              <text class="dot">•</text>
              <text>提供快递物流服务</text>
            </view>
            <view class="sub-item">
              <text class="dot">•</text>
              <text>改善用户体验</text>
            </view>
            <view class="sub-item">
              <text class="dot">•</text>
              <text>安全防护</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 信息保护 -->
      <view class="section">
        <view class="section-title">3. 信息保护</view>
        <view class="section-content">
          <view class="item">
            3.1 我们采取的保护措施：
            <view class="sub-item">
              <text class="dot">•</text>
              <text>数据加密存储</text>
            </view>
            <view class="sub-item">
              <text class="dot">•</text>
              <text>访问权限控制</text>
            </view>
            <view class="sub-item">
              <text class="dot">•</text>
              <text>安全审计</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 信息共享 -->
      <view class="section">
        <view class="section-title">4. 信息共享</view>
        <view class="section-content">
          <view class="highlight-box">
            <text class="highlight-title">重要提示</text>
            <text class="highlight-content">
              未经您的同意，我们不会与任何第三方分享您的个人信息，除非法律法规另有规定。
            </text>
          </view>
        </view>
      </view>
      
    
    </scroll-view>
    
    <!-- 底部按钮 -->
<!--    <view class="footer">
      <button class="disagree-btn" @tap="handleDisagree">不同意</button>
      <button class="agree-btn" @tap="handleAgree">同意</button>
    </view> -->
    <view class="footer">
      <button class="agree-btn" @tap="handleAgree">同意并继续</button>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleAgree = () => {
  uni.setStorageSync('privacy_accepted', true)
  uni.navigateBack()
}

const handleDisagree = () => {
	uni.navigateBack()
  // uni.showModal({
  //   title: '提示',
  //   content: '您需要同意隐私政策才能继续使用我们的服务',
  //   showCancel: false,
  //   confirmText: '我知道了'
  // })
}
</script>

<style lang="scss" scoped>
.privacy-container {
  min-height: 100vh;
  background: #fff;
  padding-bottom: env(safe-area-inset-bottom);
  
  .header {
    padding: 40rpx 32rpx;
    text-align: center;
    background: linear-gradient(180deg, #f8faff 0%, #fff 100%);
    
    .title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 12rpx;
    }
    
    .subtitle {
      font-size: 24rpx;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 2rpx;
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
    
    .section {
      margin-bottom: 48rpx;
      animation: fadeIn 0.5s ease-out;
      
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
          margin-bottom: 24rpx;
          
          .sub-item {
            margin: 16rpx 0;
            display: flex;
            align-items: flex-start;
            
            .dot {
              color: #2b85ff;
              margin-right: 12rpx;
              font-size: 24rpx;
              line-height: 1.6;
            }
          }
        }
        
        .highlight-box {
          background: #f8faff;
          border-radius: 16rpx;
          padding: 24rpx;
          margin: 24rpx 0;
          border: 1rpx solid rgba(43, 133, 255, 0.1);
          
          .highlight-title {
            font-size: 28rpx;
            font-weight: 600;
            color: #2b85ff;
            margin-bottom: 12rpx;
            display: block;
          }
          
          .highlight-content {
            font-size: 26rpx;
            color: #666;
            line-height: 1.6;
          }
        }
        
        .rights-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24rpx;
          margin-top: 24rpx;
          
          .rights-item {
            background: #f8faff;
            border-radius: 16rpx;
            padding: 24rpx;
            text-align: center;
            
            .rights-icon {
              font-size: 40rpx;
              margin-bottom: 12rpx;
              display: block;
            }
            
            .rights-text {
              font-size: 26rpx;
              color: #666;
              line-height: 1.4;
            }
          }
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
    display: flex;
    gap: 24rpx;
    
    .disagree-btn,
    .agree-btn {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      font-size: 32rpx;
      font-weight: 500;
      border-radius: 44rpx;
      letter-spacing: 2rpx;
    }
    
    .disagree-btn {
      background: #f5f5f5;
      color: #999;
      
      &:active {
        background: #f0f0f0;
      }
    }
    
    .agree-btn {
      background: #2b85ff;
      color: #fff;
      
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