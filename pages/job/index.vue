<template>
    <view class="container">
        <!-- 动态背景 -->
        <view class="dynamic-bg">
            <view class="shape shape-1"></view>
            <view class="shape shape-2"></view>
            <view class="glass-panel"></view>
        </view>
        
        <!-- 主要内容区 -->
        <view class="main-content">
            
            <!-- 切换开关 -->
            <view class="mode-switch" v-if="!isRegister">
                <view class="switch-track" :class="{ 'switch-register': !isMobileLogin }">
                    <view class="switch-handle">
                        {{ isMobileLogin ? '手机号登录' : '密码登录' }}
                    </view>
                    <view class="switch-text left">手机号登录</view>
                    <view class="switch-text right">密码登录</view>
                </view>
                <view class="switch-overlay" @tap="toggleMode"></view>
            </view>
            
            <!-- 表单卡片 -->
            <view class="form-card" :class="{ 'form-register': !isMobileLogin }">
                <!-- 动态标题 -->
                <view class="form-header" @click="goList">
                    <!-- <text class="emoji">{{ isMobileLogin ? '👋' : '✨' }}</text> -->
                    <text class="header-text">{{ !isRegister ? '欢迎归来' : '开始探索' }}</text>
                </view>
                
                <!-- 表单内容 -->
                <view class="form-content">
                    <!-- 用户名输入框组 -->
					<block v-if="!isRegister">
						<block v-if="isMobileLogin">
							<view class="form-wrapper">
								<!-- 手机号输入框 -->
								<view class="input-item">
									<text class="iconfont icon-phone"></text>
									<input 
										type="number" 
										v-model="form.mobile" 
										maxlength="11" 
										placeholder="请输入手机号" 
										placeholder-class="placeholder"
									/>
								</view>
								
								<!-- 登录时显示验证码输入框 -->
								<view class="input-item code-item">
									<text class="iconfont icon-safe"></text>
									<input 
										type="number" 
										v-model="form.verifyCode" 
										maxlength="6" 
										placeholder="验证码" 
										placeholder-class="placeholder"
									/>
									<text 
										class="code-btn" 
										:class="{ disabled: isCounting }"
										@tap="getVerifyCode"
									>{{ isCounting ? `${countdown}s` : '获取验证码' }}</text>
								</view>
							</view>
						</block>
						
						<!-- 注册时显示的额外字段 -->
						<block v-if="!isMobileLogin">
							<view class="input-group">
								<view class="input-label">
									<text class="required">*</text>
									<text>手机号</text>
								</view>
								<view class="input-box">
									<input 
										type="number"
										v-model="form.mobile"
										maxlength="11"
										placeholder="请输入手机号"
										placeholder-class="placeholder"
									/>
								</view>
							</view>
							<view class="input-group">
								<view class="input-label">
									<text class="required">*</text>
									<text>用户名</text>
								</view>
								<view class="input-box">
									<input 
										type="text"
										v-model="form.username"
										placeholder="请输入用户名"
										placeholder-class="placeholder"
									/>
								</view>
							</view>
							
							<!-- 密码输入框组 -->
							<view class="input-group">
							    <view class="input-label">
							        <text class="required">*</text>
							        <text>密码</text>
							    </view>
							    <view class="input-box">
							        <input 
							            type="password"
							            v-model="form.password"
							            placeholder="请输入密码"
							            placeholder-class="placeholder"
							        />
							    </view>
							</view>
						</block>
						
					</block>
					
					<block v-if="isRegister">
						
						<view class="input-group">
						    <view class="input-label">
						        <text class="required">*</text>
						        <text>手机号</text>
						    </view>
						    <view class="input-box">
						        <input 
						            type="number"
						            v-model="form.mobile"
						            maxlength="11"
						            placeholder="请输入手机号"
						            placeholder-class="placeholder"
						        />
						    </view>
						</view>
						
						<view class="input-group">
						    <view class="input-label">
						        <text class="required">*</text>
						        <text>验证码</text>
						    </view>
						    <view class="input-box code-box">
						        <input 
						            type="number"
						            v-model="form.verifyCode"
						            maxlength="6"
						            placeholder="请输入验证码"
						            placeholder-class="placeholder"
						        />
						        <view 
						            class="code-btn" 
						            :class="{ disabled: isCounting }"
						            @tap="getVerifyCode"
						        >
						            <text>{{ isCounting ? `${countdown}s` : '获取验证码' }}</text>
						        </view>
						    </view>
						</view>
						
						<view class="input-group">
							<view class="input-label">
								<text class="required">*</text>
								<text>用户名</text>
							</view>
							<view class="input-box">
								<input 
									type="text"
									v-model="form.username"
									placeholder="请输入用户名"
									placeholder-class="placeholder"
								/>
							</view>
						</view>
						
						<!-- 密码输入框组 -->
						<view class="input-group">
						    <view class="input-label">
						        <text class="required">*</text>
						        <text>密码</text>
						    </view>
						    <view class="input-box">
						        <input 
						            type="password"
						            v-model="form.password"
						            placeholder="请输入密码"
						            placeholder-class="placeholder"
						        />
						    </view>
						</view>
						
						<!-- 确认密码（注册时显示） -->
						<view class="input-group">
						    <view class="input-label">
						        <text class="required">*</text>
						        <text>确认密码</text>
						    </view>
						    <view class="input-box">
						        <input 
						            type="password"
						            v-model="form.confirmPassword"
						            placeholder="请再次输入密码"
						            placeholder-class="placeholder"
						        />
						    </view>
						</view>
						
					</block>
                    
                </view>
                
                <!-- 提交按钮 -->
                <view class="submit-area">
                    <button class="submit-btn" @tap="handleSubmit(isRegister)">
                        <text>{{ !isRegister ? '立即登录' : '立即注册' }}</text>
                        <text class="btn-icon">{{ !isRegister ? '→' : '+' }}</text>
                    </button>
					
					<view class="switch-wrapper">
						<view>
							<text v-if="!isRegister" class="forget-pwd" @tap="goToForgetPassword">忘记密码</text>
						</view>
					    
					    <view class="switch-box" >
					        <text class="switch-tip">{{ !isRegister ? '还没有账号？' : '已有账号？' }}</text>
					        <text class="switch-btn" @tap="switchLoginType(isRegister)">
					            {{ !isRegister ? '立即注册' : '去登录' }}
					        </text>
					    </view>
					</view>
                </view> 
                
                <!-- 在底部提示前添加隐私协议 -->
                <view class="privacy-policy">
                    <checkbox-group @change="handlePrivacyChange">
                        <label class="checkbox">
                            <checkbox :checked="agreePrivacy" color="#7c3aed" />
                            <text class="policy-text">我已阅读并同意</text>
                            <text class="policy-link" @tap.stop="showPrivacyPolicy">《用户协议和隐私政策》</text>
                        </label>
                    </checkbox-group>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const SYS_ID = 2025040301
const JOB_TOKEN = 'JOB_TOKEN'
export default {
    data() {
        return {
			userToken:{},
            isMobileLogin: true,
            isRegister: false,
            form: {
				sysId: SYS_ID,
                username: '',
                mobile: '',
                verifyCode: '',
                password: '',
                confirmPassword: ''
            },
            isCounting: false,
            countdown: 60,
            agreePrivacy: false,
            timer: null,
			codeValid: 0,	// 短信验证  1：通过；-1：未通过
        }
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    },
	onLoad(){
		const _this = this
		uni.getStorage({
			key: JOB_TOKEN,
			success: function(resp){
				_this.userToken = resp.data
				// console.log("缓存取值："+ JSON.stringify(_this.userToken))
				uni.navigateTo({ url: `/pages/job/user_list/user_list` });
			},
			fail:function(){
			}
		});
	},
    methods: {
        toggleMode() {
            this.isMobileLogin = !this.isMobileLogin
			// 清空（不清空）
    //         this.form = {
				// sysId: SYS_ID,
    //             username: '',
    //             mobile: '',
    //             verifyCode: '',
    //             password: '',
    //             confirmPassword: ''
    //         }
            this.agreePrivacy = false
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
                this.isCounting = false
                this.countdown = 60
            }
        },
		
        
        async getVerifyCode() {
            if (this.isCounting) return
            
            if (!this.form.mobile) {
                uni.showToast({
                    title: '请输入手机号',
                    icon: 'none'
                })
                return
            }
            
            if (!/^1[3-9]\d{9}$/.test(this.form.mobile)) {
                uni.showToast({ title: '手机号格式不正确', icon: 'none' })
                return
            }
            
            console.log('获取验证码：', this.form.mobile)
            
			try {
				const param = {
						phone: this.form.mobile,
						opt: 'add jobUser',
						sysId: SYS_ID
				}
				// 调用后端API发送验证码
				const res = await uni.request({
					url: process.env.UNI_BASE_URL+'/api/sys/sms/sendCodeMessage',
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					data: param
				});
				// console.log("短信验证码-参数"+JSON.stringify(param)+"；返回值：" + JSON.stringify(res))
				if(res.data.code == 0) {
					uni.showToast({ title: '验证码已发送' });
					this.startCountdown();
				}
				
			} catch (error) {
				uni.showToast({ title: '发送失败', icon: 'none' });
			}
			
        },
		
		
		// 倒计时逻辑
		startCountdown() {
			this.isCounting = true;
			this.countdown = 60;
			const timer = setInterval(() => {
				if(this.countdown <= 0) {
					clearInterval(timer);
					this.isCounting = false;
					return;
				}
				this.countdown--;
			}, 1000);
		},
		
        
        handleSubmit(isRegister) {
            if (!this.agreePrivacy) {
                uni.showToast({ title: '请先同意用户协议和隐私政策', icon: 'none' })
                return
            }
            
			// 登录
            if (!isRegister) {
				// 密码登录
				if(!this.isMobileLogin){
					this.form.verifyCode = ''; // 密码登录，需将 验证码置空
					if(!this.form.password || !this.form.username){
						uni.showToast({ title: '请填写完整信息', icon: 'none' })
						return
					}
				}else
				
				// 手机号登录
				if(!this.form.mobile || !this.form.verifyCode){
					this.form.password = ''; // 手机号登录，需将 密码置空
					uni.showToast({ title: '请填写完整信息', icon: 'none' })
					return
				}
                // console.log('登录信息：', JSON.stringify(this.form))
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/login',  // job登录
					data: this.form,
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						// console.log('job/login 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							let retData = result.data
							if(retData.code == 0){
								let ret = retData.data;
								uni.setStorage({ key:JOB_TOKEN, data: ret });
								// 登录成功
								const url = '/pages/job/user_list/user_list'
								uni.navigateTo({ url });
								return;
							}
							uni.showToast({title: retData.msg, icon: 'error'});
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
				return;
            } 
			
			// 注册
			if (!this.form.username || !this.form.password || 
				!this.form.mobile || !this.form.verifyCode) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' })
				return
			}
			
			if (this.form.password !== this.form.confirmPassword) {
				uni.showToast({ title: '两次密码不一致', icon: 'none' })
				return
			}
			// 提交注册
			this.saveUser(this.form)
			
        },
		
		saveUser(userData){
			try {
				const _this = this
				// console.log("注册信息："+ JSON.stringify(userData))
				uni.request({
					url: process.env.UNI_BASE_URL+ '/api/job/saveUser',
					header: { 'Content-Type': 'application/json' },
					method: 'POST',
					data: JSON.stringify(userData),
					success: result => {
						// console.log('userStream 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							const respData = result.data;
							// console.log("getUser返回值："+JSON.stringify(respData))
							if(respData.code == 0) {
								let ret = respData.data;
								uni.setStorage({ key:JOB_TOKEN, data: ret });
								
								console.log("this.saveUser 返回值：" + JSON.stringify(ret))
								const url = '/pages/job/user_add/user_add?username='+userData.username;
								uni.navigateTo({ url });
								// console.log('注册信息：', JSON.stringify(this.form))
								uni.showToast({
								    title: this.isRegister ? '注册成功' : '登录成功',
								    icon: 'success'
								})
								return;
							};
						}
						
						uni.showToast({
						    title: this.isRegister ? '注册失败，请稍后重试！' : '登录失败，请稍后重试！',
						    icon: 'error'
						})
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
				
			} catch (err) {
			    console.error('捕获异常:', err);
			}
		},
		
        goList(){			
		},
		
		switchLoginType(isRegister){
			this.isRegister = !isRegister;
		},
		
        handlePrivacyChange(e) {
            this.agreePrivacy = e.detail.value.length > 0
        },
        
        showPrivacyPolicy() {
            uni.showModal({
                title: '用户协议和隐私政策',
                content: '感谢您使用我们的服务。我们非常重视您的个人信息和隐私保护。使用我们的服务即表示您同意我们按照本协议收集和使用您的相关信息。',
                showCancel: false,
                confirmText: '我知道了'
            })
        },
        
        goToForgetPassword() {
            uni.navigateTo({
                url: './forget-password'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background: #f8f9fd;
    position: relative;
    overflow: hidden;
}

/* 动态背景 - 优化后 */
.dynamic-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    
    .shape {
        position: absolute;
        filter: blur(100rpx); // 减小模糊半径
        opacity: 0.3; // 降低不透明度
        will-change: transform; // 优化动画性能
        
        &-1 {
            width: 600rpx;
            height: 600rpx;
            background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
            top: -200rpx;
            right: -200rpx;
            border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
            animation: shapeMove1 15s ease-in-out infinite alternate;
        }
        
        &-2 {
            width: 500rpx;
            height: 500rpx;
            background: linear-gradient(225deg, #84fab0 0%, #8fd3f4 100%);
            bottom: -150rpx;
            left: -150rpx;
            border-radius: 58% 42% 30% 70% / 55% 55% 45% 45%;
            animation: shapeMove2 15s ease-in-out infinite alternate;
        }
    }
    
    .glass-panel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(40rpx); // 减小模糊半径
        -webkit-backdrop-filter: blur(60rpx);
    }
}

/* 优化动画效果 */
@keyframes shapeMove1 {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }
    100% {
        transform: translate(30rpx, 30rpx) rotate(90deg) scale(1.1);
    }
}

@keyframes shapeMove2 {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1.1);
    }
    100% {
        transform: translate(-30rpx, -30rpx) rotate(-90deg) scale(1);
    }
}

/* 主要内容区 - 优化阴影和层级 */
.main-content {
    position: relative;
    z-index: 2; // 提高层级
    padding: 40rpx;
    padding-top: 80rpx;
}


/* Logo动画 */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-40rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 切换开关 - 完全重写 */
.mode-switch {
    width: 400rpx;
    height: 80rpx;
    margin: 0 auto 60rpx;
    position: relative;
    
    .switch-track {
        width: 100%;
        height: 100%;
        // background: rgba(255, 255, 255, 0.9);
        background: linear-gradient(225deg, #84fab0 0%, #fbc2eb 100%);
        border-radius: 40rpx;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4rpx;
        
        .switch-handle {
            position: absolute;
            width: calc(50% - 4rpx);
            height: calc(100% - 8rpx);
            background: linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%);
            border-radius: 36rpx;
            color: #fff;
            font-size: 28rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            left: 4rpx;
            z-index: 2;
        }
        
        .switch-text {
            width: 50%;
            text-align: center;
            font-size: 28rpx;
            color: rgba(255, 255, 255, 0.5);
            transition: color 0.3s;
            z-index: 1;
            
            &.left {
                color: rgba(255, 255, 255, 0.5);
            }
            
            &.right {
                color: rgba(255, 255, 255, 0.5);
            }
        }
        
        &.switch-register {
            .switch-handle {
                transform: translateX(100%);
            }
        }
    }
    
    .switch-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
    }
}

/* 表单卡片 */
.form-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 30rpx;
    padding: 40rpx;
    backdrop-filter: blur(20rpx);
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.05);
    
    .form-header {
        text-align: center;
        margin-bottom: 60rpx;
        
        .emoji {
            font-size: 60rpx;
            margin-bottom: 20rpx;
            display: block;
        }
        
        .header-text {
            font-size: 40rpx;
            // color: #333;
            font-weight: 600;
			background: linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%);
			-webkit-background-clip: text;
			color: transparent;
        }
    }
}

/* 表单内容 */
.form-content {
    .input-group {
        margin-bottom: 40rpx;
        display: flex;
		
        .input-label {
			flex: 0 0 25%; 		/* 固定比例宽度 */
			min-width: 100rpx; /* 最小宽度 */
			max-width: 240rpx; /* 最大宽度 */
            display: flex;
            align-items: center;
			white-space: nowrap; /* 防止文字换行 */
            margin-bottom: 16rpx;
            .required {
                color: #ef4444;
                margin-right: 8rpx;
            }
            
            text {
                color: #666 !important;
                font-size: 26rpx;
            }
        }
        
        .input-box {
            background: #f8f9fd;
            border: 1px solid #e6e6e6;
            border-radius: 16rpx;
            height: 90rpx;
            padding: 0 30rpx;
            flex: 1;
			min-width: 0; /* 允许压缩 */
            input {
                height: 100%;
                // color: #fff;
				color: #333;
                font-size: 28rpx;
            }
            
            &.code-box {
                display: flex;
                align-items: center;
                padding-right: 20rpx;
                
                input {
                    flex: 1;
					color: #333 !important;
                }
                
                .code-btn {
                    height: 60rpx;
                    padding: 0 30rpx;
                    background: rgba(161, 140, 209, 0.1) !important;
                    border: 1px solid rgba(161, 140, 209, 0.3) !important;
                    border-radius: 30rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    
                    text {
                        color: #a18cd1 !important;
                        font-size: 24rpx;
                    }
                    
                    &.disabled {
                        opacity: 0.5;
                    }
                }
            }
        }
    }
	
/* 表单样式 */
.form-wrapper {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 30rpx;
    padding: 40rpx;
    box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
    
    .input-item {
        display: flex;
        align-items: center;
        height: 100rpx;
        background: #f8f9fd;
        border-radius: 20rpx;
        padding: 0 30rpx;
        margin-bottom: 30rpx;
        
        .iconfont {
            font-size: 36rpx;
            color: #a18cd1;
            margin-right: 20rpx;
        }
        
        input {
            flex: 1;
            font-size: 28rpx;
            color: #333;
        }
        
        .placeholder {
            color: #999;
        }
    }
    
    .code-item {
        padding-right: 200rpx;
        position: relative;
        
        .code-btn {
            position: absolute;
            right: 30rpx;
            top: 50%;
            transform: translateY(-50%);
            font-size: 26rpx;
            color: #a18cd1;
            
            &.disabled {
                color: #999;
            }
        }
    }
}
}

/* 提交按钮 */
.submit-area {
    margin-top: 60rpx;
    
    .submit-btn {
        background: linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%) !important;
        height: 90rpx;
        border-radius: 45rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 30rpx;
        font-weight: 500;
        box-shadow: 0 8rpx 20rpx rgba(161, 140, 209, 0.3) !important;
        
        .btn-icon {
            margin-left: 12rpx;
            font-size: 32rpx;
        }
        
        &:active {
            transform: scale(0.98);
            box-shadow: 0 4rpx 10rpx rgba(124, 58, 237, 0.2);
        }
    }
	
	.switch-wrapper {
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
		// justify-content: flex-end;
	    margin-top: 40rpx;
	    padding: 0 20rpx;
			
	    
	    .forget-pwd {
	        font-size: 26rpx;
	        color: #a18cd1;
	    }
	    
	    .switch-box {
	        .switch-tip {
	            font-size: 26rpx;
	            color: #666;
	        }
	        
	        .switch-btn {
	            font-size: 26rpx;
	            color: #a18cd1;
	            margin-left: 10rpx;
	        }
	    }
	}
	
}

/* 底部文字 */
.form-footer {
    margin-top: 40rpx;
    text-align: center;
    
    .footer-text {
        color: rgba(255, 255, 255, 0.4);
        font-size: 24rpx;
    }
    
    .footer-link {
        color: #a78bfa;
        font-size: 24rpx;
        margin-left: 8rpx;
    }
	
	/* 链接颜色统一 */
	.footer-link, 
	.forgot-password, 
	.policy-link {
	    color: #a18cd1 !important; 
	}
}

/* 占位符样式 */
.placeholder {
    color: #999 !important;
}

/* 修改忘记密码样式 */
.forgot-password {
    text-align: right;
    padding: 10rpx 0;
    font-size: 24rpx;
    color: #a78bfa;
    margin-top: 8rpx;
}

.privacy-policy {
    margin-top: 20rpx;
    
    .checkbox {
        display: flex;
        align-items: center;
        
        .policy-text {
            font-size: 24rpx;
            color: #666 !important;
            margin-left: 10rpx;
        }
        
        .policy-link {
            font-size: 24rpx;
            color: #a18cd1 !important;
        }
    }
}

/* 响应式适配 */
@media screen and (max-width: 360px) {
    .input-label {
        flex-basis: 30% !important; /* 小屏幕增加标签占比 */
    }
}

@media screen and (min-width: 768px) {
    .input-label {
        flex-basis: 20% !important; /* 大屏幕减少标签占比 */
    }
}
</style> 