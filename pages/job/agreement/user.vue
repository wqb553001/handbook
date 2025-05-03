<template>
  <view class="agreement-container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">用户协议</text>
      <text class="subtitle">User Agreement</text>
      <text class="update-time">更新时间：2024-03-21</text>
    </view>
    
    <!-- 内容区域 -->
    <scroll-view scroll-y class="content">
      <!-- 协议概述 -->
      <view class="section">
        <view class="section-title">协议概述</view>
        <view class="section-content">
          本协议是您与我们之间关于使用我们的快递服务所订立的协议。请您仔细阅读本协议，您点击"同意"按钮即表示您已充分阅读、理解并接受本协议的全部内容。
        </view>
      </view>
      
      <!-- 账号注册 -->
      <view class="section">
        <view class="section-title">1. 账号注册</view>
        <view class="section-content">
          <view class="card-item">
            <view class="card-header">
              <text class="card-title">注册要求</text>
            </view>
            <view class="card-content">
              <view class="list-item">
                • 您确保注册信息真实、准确、完整
              </view>
              <view class="list-item">
                • 您必须年满18周岁并具有完全民事行为能力
              </view>
              <view class="list-item">
                • 不得以任何方式转让或授权他人使用您的账号
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 用户责任 -->
      <view class="section">
        <view class="section-title">2. 用户责任</view>
        <view class="section-content">
          <view class="warning-box">
            <view class="warning-title">
              <text class="icon">⚠️</text>
              <text>禁止行为</text>
            </view>
            <view class="warning-list">
              <view class="warning-item">
                • 发布违法违规信息
              </view>
              <view class="warning-item">
                • 干扰系统正常运行
              </view>
              <view class="warning-item">
                • 侵犯他人合法权益
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 服务规则 -->
      <view class="section">
        <view class="section-title">3. 服务规则</view>
        <view class="section-content">
          <view class="rule-grid">
            <view class="rule-item">
              <text class="rule-icon">📦</text>
              <text class="rule-title">快递服务</text>
              <text class="rule-desc">提供快速、安全的快递服务</text>
            </view>
            <view class="rule-item">
              <text class="rule-icon">💰</text>
              <text class="rule-title">费用规则</text>
              <text class="rule-desc">按照公示价格收取服务费</text>
            </view>
            <view class="rule-item">
              <text class="rule-icon">🔒</text>
              <text class="rule-title">安全保障</text>
              <text class="rule-desc">保障物品运输安全</text>
            </view>
            <view class="rule-item">
              <text class="rule-icon">⏰</text>
              <text class="rule-title">时效承诺</text>
              <text class="rule-desc">承诺的时效内送达</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 知识产权 -->
      <view class="section">
        <view class="section-title">4. 知识产权</view>
        <view class="section-content">
          <view class="highlight-text">
            本应用的所有权利（包括但不限于商标、专利、著作权等）均归我们所有。未经允许，不得以任何形式使用或复制。
          </view>
        </view>
      </view>
      
      <!-- 协议修改 -->
      <view class="section">
        <view class="section-title">5. 协议修改</view>
        <view class="section-content">
          <view class="notice-box">
            <text class="notice-title">修改说明</text>
            <text class="notice-content">
              我们保留随时修改本协议的权利。协议修改后，我们会在应用内显著位置公布修改后的协议内容。
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部按钮 -->
<!--    <view class="footer">
      <button class="reject-btn" @tap="handleReject">拒绝</button>
      <button class="accept-btn" @tap="handleAccept">同意并继续</button>
    </view> -->
    
    <!-- 底部按钮 handleAgree -->
    <view class="footer">
      <button class="agree-btn" @tap="handleAgree">同意并继续</button>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleAccept = () => {
  uni.setStorageSync('user_agreement_accepted', true)
  uni.navigateBack()
}
const handleAgree = () => {
  uni.setStorageSync('user_agreement_accepted', true)
  uni.navigateBack()
}

const handleReject = () => {
  uni.navigateBack();
  
  // uni.showModal({
  //   title: '提示',
  //   content: '您需要同意用户协议才能继续使用我们的服务',
  //   showCancel: false,
  //   confirmText: '我知道了'
  // })
}
</script>

<style lang="scss" scoped>
.agreement-container {
  min-height: 100vh;
  background: #fff;
  box-sizing: border-box;
  
  .header {
    padding: 40rpx 32rpx;
    text-align: center;
    background: linear-gradient(180deg, #f0f5ff 0%, #fff 100%);
    
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
      margin-bottom: 48rpx;
      animation: slideIn 0.5s ease-out;
      
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
      
      .card-item {
        background: #f8faff;
        border-radius: 16rpx;
        padding: 24rpx;
        margin-bottom: 24rpx;
        
        .card-header {
          margin-bottom: 16rpx;
          
          .card-title {
            font-size: 28rpx;
            font-weight: 600;
            color: #2b85ff;
          }
        }
        
        .list-item {
          font-size: 26rpx;
          color: #666;
          line-height: 1.6;
          margin-bottom: 12rpx;
          padding-left: 24rpx;
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            left: 8rpx;
            top: 16rpx;
            width: 6rpx;
            height: 6rpx;
            background: #2b85ff;
            border-radius: 50%;
          }
        }
      }
      
      .warning-box {
        background: #fff7e6;
        border-radius: 16rpx;
        padding: 24rpx;
        
        .warning-title {
          display: flex;
          align-items: center;
          margin-bottom: 16rpx;
          font-size: 28rpx;
          font-weight: 600;
          color: #fa8c16;
          
          .icon {
            margin-right: 8rpx;
          }
        }
        
        .warning-item {
          font-size: 26rpx;
          color: #666;
          margin-bottom: 12rpx;
        }
      }
      
      .rule-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24rpx;
        
        .rule-item {
          background: #f8faff;
          border-radius: 16rpx;
          padding: 24rpx;
          text-align: center;
          
          .rule-icon {
            font-size: 48rpx;
            margin-bottom: 12rpx;
            display: block;
          }
          
          .rule-title {
            font-size: 28rpx;
            font-weight: 600;
            color: #333;
            margin-bottom: 8rpx;
            display: block;
          }
          
          .rule-desc {
            font-size: 24rpx;
            color: #666;
            line-height: 1.4;
          }
        }
      }
      
      .highlight-text {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
        padding: 24rpx;
        background: #f8faff;
        border-radius: 16rpx;
        border-left: 4rpx solid #2b85ff;
      }
      
      .notice-box {
        background: #f6ffed;
        border-radius: 16rpx;
        padding: 24rpx;
        
        .notice-title {
          font-size: 28rpx;
          font-weight: 600;
          color: #52c41a;
          margin-bottom: 12rpx;
          display: block;
        }
        
        .notice-content {
          font-size: 26rpx;
          color: #666;
          line-height: 1.6;
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
    // display: flex;
    // gap: 24rpx;
    
    // .reject-btn,
    // .accept-btn {
    //   flex: 1;
    //   height: 88rpx;
    //   line-height: 88rpx;
    //   text-align: center;
    //   font-size: 32rpx;
    //   font-weight: 500;
    //   border-radius: 44rpx;
    // }
    
    // .reject-btn {
    //   background: #f5f5f5;
    //   color: #999;
      
    //   &:active {
    //     background: #f0f0f0;
    //   }
    // }
    
    // .accept-btn {
    //   background: #2b85ff;
    //   color: #fff;
      
    //   &:active {
    //     transform: scale(0.98);
    //     opacity: 0.9;
    //   }
    // }
	
	
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 