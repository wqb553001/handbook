<template>
  <!-- 帮助中心 -->
  <view class="agreement-container">
    <!-- 头部 -->
<!--    <view class="header">
      <text class="title">用户协议</text>
      <text class="subtitle">User Agreement</text>
      <text class="update-time">更新时间：2025-06-09</text>
    </view> -->
	
	<l-navbar title="找用工" leftColor="#ffffff" titleColor="#ffffff" iconColor="#ffffff" :search="true"
		:showLeft="false" :showMid="false" :debounce-delay="500" :border="false" 
		background="linear-gradient(180deg, #ff6043 51%, rgba(255, 96, 67, 0) 99%)" placeholderText="请输入关键词"
		@change="handleSearchChange" style="z-index: 999;"
		:searchStyle="handleSearchStyle" :fontSize="scaledFontSize"  :searchWidth="'300px'" :centerMargin="'0px'"
		 
		>
	</l-navbar>
    
    <!-- 内容区域 -->
    <scroll-view scroll-y class="content">
      
      <!-- 知识产权 -->
      <view class="section">
        <view class="section-title">常见问题列举与解答</view>
        <view class="section-content">
          <view class="highlight-text">
            如果您遇到的问题，未被列举。请点击下方的 “未解决，留言” 进行反馈，我们尽快根据反馈情况，及时调整、优化程序，丰富和完善问题解答。
          </view>
        </view>
      </view>
      
      <!-- 协议修改 -->
      <view class="section">
        <view class="section-title">1. 具备的技能，或者提供的服务，未在技能选项中，是否允许？</view>
        <view class="section-content">
          <view class="notice-box">
            <text class="notice-title">允许的。</text>
            <text class="notice-content" style="padding-bottom: 60rpx; ">
              请选择技能选项的最后一个 “其他”，在弹出的输入框中填写 所具备的技能或提供的服务。
            </text>
          </view>
        </view>
      </view>
	  
      
      <!-- 账号注册 -->
      <view class="section">
        <view class="section-title">2. 填写 “其他” 技能，有哪些技巧和注意事项？</view>
        <view class="section-content">
          <view class="card-item">
            <view class="card-content">
              <view class="list-item">
                • 同一个技能，有多种表述、描述方式时；建议采用多种表述，这样，能增加被检索到的机会。
              </view>
              <view class="list-item">
                • 同时，尽量避免歧义，给客户带来困难和不好印象。
              </view>
              <view class="list-item">
                • 当同种类的技能或服务，较多时，后续也会被完善、增补进入选项中；后续的使用者会更加方便。
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 协议修改 -->
      <view class="section">
        <view class="section-title">3. 技能选项，比较宽泛和笼统，不能表现我的服务的独特性、不易与其他同类服务相区分。怎么办？</view>
        <view class="section-content">
          <view class="notice-box">
            <text class="notice-title">没错，技能选项都属于大类。</text>
            <text class="notice-content" style="padding-bottom: 60rpx; ">
              需要您通过选取技能列表的最后一项 “其他”，在弹出的输入框中，细化自己具体提供的服务类别。方便与客户的需求精准匹配，增加契合度，同时增加客户选择的概率。
            </text>
          </view>
        </view>
      </view>
	  
      <!-- 用户责任 -->
      <view class="section">
        <view class="section-title">4. 为了增加检索的概率，我将所有的技能选项都选了，是否可以？</view>
        <view class="section-content">
          <view class="warning-box">
            <view class="warning-title">
              <text class="icon">⚠️</text>
              <text>禁止行为</text>
            </view>
            <view class="warning-list">
              <view class="warning-item">
                • 选取自身不具备的技能
              </view>
              <view class="warning-item">
                • 填写自身无法提供的服务
              </view>
              <view class="warning-item">
                • 描述与服务相违背
              </view>
			  <view class="notice-content" style="padding-bottom: 6rpx; ">
			    以上行为，都是禁止的。
			  </view>
			  <view class="notice-content" style="padding-bottom: 6rpx; ">
			    客户可以通过评价反馈等多种方式举报，提供虚假列举的情况。
			  </view>
			  <view class="notice-content" style="padding-bottom: 6rpx; ">
				一旦核实或反馈过于突出，您的受到 降低信誉值、排名靠后、一段时期的禁止接单、严重的甚至下架处理。
			  </view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">5. 客户的刁难和恶意评价，是不是就只能吃哑巴亏了？</view>
        <view class="section-content">
          <view class="notice-box">
            <text class="notice-title">不是。可以通过申诉，为自己辩护。</text>
          </view>
		  <view class="card-item">
		    <view class="card-content">
		      <view class="list-item">
		        • 服务的双方，人格上是平等的。
		      </view>
		      <view class="list-item">
		        • 不鼓励，“顾客就是上帝” 这样的口号和思想；认真做好本职工作。
		      </view>
		      <view class="list-item">
		        • 兢兢业业、精益求精，专研并提升技术和服务水平、增强竞争力，是我们对工作、生活的热爱和人生态度。
		      </view>
		    </view>
		  </view>
        </view>
      </view>
      
      <!-- <view class="section">
        <view class="section-title">3. 服务规则</view>
        <view class="section-content">
          <view class="rule-grid">
            <view class="rule-item">
              <text class="rule-icon">📦</text>
              <text class="rule-title">信息查询服务</text>
              <text class="rule-desc">根据技能匹配筛选，定位匹配距离由近及远，好评、优质排在前面；留言沟通、评价反馈</text>
            </view>
            <view class="rule-item">
              <text class="rule-icon">💰</text>
              <text class="rule-title">费用规则</text>
              <text class="rule-desc">按照公示价格收取服务费</text>
            </view>
            <view class="rule-item">
              <text class="rule-icon">🔒</text>
              <text class="rule-title">信息安全</text>
              <text class="rule-desc">数据加密存储、加密隐式传输</text>
            </view>
            <view class="rule-item">
              <text class="rule-icon">⏰</text>
              <text class="rule-title">服务质量提升</text>
              <text class="rule-desc">通过广大用户的反馈，我们将尽最大努力进一步指定与引导，培养与提升所有用户的素质和技能。</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">4. 知识产权</view>
        <view class="section-content">
          <view class="highlight-text">
            本应用的所有权利（包括但不限于商标、专利、著作权等）均归我们所有。未经允许，不得以任何形式使用或复制。
          </view>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">5. 协议修改</view>
        <view class="section-content">
          <view class="notice-box">
            <text class="notice-title">修改说明</text>
            <text class="notice-content" style="padding-bottom: 60rpx; ">
              我们保留随时修改本协议的权利。协议修改后，我们会在应用内显著位置公布修改后的协议内容。
            </text>
          </view>
        </view>
      </view> -->
	  
		<!--加载更多、向下-->
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
    </scroll-view>
    
    <!-- 底部按钮 -->
<!--   <view class="footer">
      <button class="reject-btn" @tap="handleReject">拒绝</button>
      <button class="accept-btn" @tap="handleAccept">同意并继续</button>
    </view> -->
    
    <!-- 底部按钮 handleAgree -->
    <view class="footer">
		<view class="btn" style="display: flex;">
			<button class="ok" @tap="ok">已解决</button>
			<button class="no" @tap="no">未解决，留言</button>
		</view>
      
    </view>
  </view>
</template>

<script>
	import SuggestUtil from '@/common/js/util/suggestUtil.js';
	
	const SYS_ID = 2025040301;
	const JOB_TOKEN = 'JOB_TOKEN';
	
	export default {
		data() {
			return {
				userId:0,
				userToken: {userId: 0},
				// 字体缩放
				fontSet: '',
				fontScale: 1.0,
				fontSizeScale: 100, // 默认100%比例
				baseFontSize: 16,   // 基础字体大小（根据设计稿调整）
				searchValue: null, 	// 搜索词
				
				// 分页
				listData: [],
				total: 0,		// 总记录数
				pages: 0,		// 总页数
				currentPage: 1,	// 当前页码
				reload: false,	// 上拉加载更多-false; 下拉刷新-true
				status: 'more', // 加载状态  more：上拉加载更多；loading：加载中；nomore：没有更多
			}
		}
		,
		mounted(){
			this.getToken();
		},
		computed:{
			scaledFontSize() {
				return this.baseFontSize * (this.fontSizeScale / 100);
			},
			handleSearchStyle() {
				var fontSize = this.baseFontSize * (this.fontSizeScale / 100);
				return 'color: #000000; fontSize: '+fontSize+'px; font-size: '+fontSize+'px;';
			}
		},
		methods:{
			getToken(){
				// 获取用户信息
				const _this = this
				uni.getStorage({
					key: JOB_TOKEN,
					success: function(resp){
						_this.userToken = resp.data
						if(!_this.userToken) uni.removeStorage({key: JOB_TOKEN})
						// console.log("缓存取值："+ JSON.stringify(_this.userToken))
					},
					fail:function(){
					}
				});
			},
			handleSearchChange(searchValue){
				this.searchValue = searchValue
				console.log("搜索框输入："+ searchValue)
				// this.initData();
				// this.getList();
			},
			ok(){
				uni.navigateBack();
			},
			async no(){
				await SuggestUtil.syncFabClick(this.userToken);
				uni.navigateBack();
			},
		}
	}
</script>


<!-- 
<script setup lang="ts">
// const handleAccept = () => {
//   uni.setStorageSync('user_agreement_accepted', true)
//   uni.navigateBack()
// }
// const handleAgree = () => {
//   uni.setStorageSync('user_agreement_accepted', true)
//   uni.navigateBack()
// }

// const handleReject = () => {
//   uni.navigateBack();
  
//   // uni.showModal({
//   //   title: '提示',
//   //   content: '您需要同意用户协议才能继续使用我们的服务',
//   //   showCancel: false,
//   //   confirmText: '我知道了'
//   // })
// }
// </script>
 -->
 
 
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
          font-size: 30rpx;
          color: #666;
          line-height: 1.6;
          margin-bottom: 12rpx;
          padding-left: 24rpx;
          position: relative;
          
          // &::before {
          //   content: '';
          //   position: absolute;
          //   left: 8rpx;
          //   top: 16rpx;
          //   width: 6rpx;
          //   height: 6rpx;
          //   background: #2b85ff;
          //   border-radius: 50%;
          // }
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
	
	// .agree-btn {
	//   height: 88rpx;
	//   line-height: 88rpx;
	//   text-align: center;
	//   font-size: 25rpx;
	//   background: #2b85ff;
	//   color: #fff;
	//   width: 50%;
	//   font-weight: 500;
	//   border-radius: 44rpx;
	//   letter-spacing: 2rpx;
	//   &:active {
	//     transform: scale(0.98);
	//     opacity: 0.9;
	//   }
	// }
	
	.btn {
	  height: 88rpx;
	  line-height: 88rpx;
	  text-align: center;
	  font-weight: 500;
	  justify-content: space-around;
	  .ok{
	    font-size: 35rpx;
	    width: 49%;
		background: #52c41a;
		color: #fff;
	    border-radius: 20rpx;
	    letter-spacing: 2rpx;
	  }
	  .no{
	    font-size: 33rpx;
	    width: 49%;
		background: #fa8c16;
		color: #fff;
	    border-radius: 20rpx;
	    letter-spacing: 2rpx;
	  }
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