<template>
    <view class="container">
        <view class="dynamic-bg">
            <view class="shape shape-1"></view>
            <view class="shape shape-2"></view>
            <view class="glass-panel"></view>
        </view>
        
        <view class="main-content">
            <!-- 表单卡片 -->
            <view class="form-card">
                <!-- 表单标题 -->
                <view class="form-header">
                    <text class="emoji">🔑</text>
                    <text class="header-text">找回密码</text>
                </view>
                
                <view class="form-content">
                    <!-- 手机号输入框 -->
                    <view class="input-group">
                        <view class="input-label">
                            <text class="required">*</text>
                            <text>手机号</text>
                        </view>
                        <view class="input-box">
                            <input 
                                type="number"
                                v-model="form.phone"
                                maxlength="11"
                                placeholder="请输入手机号"
                                placeholder-class="placeholder"
                            />
                        </view>
                    </view>
                    
                    <!-- 验证码输入框 -->
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
                                :class="{ disabled: counting }"
                                @tap="getVerifyCode"
                            >
                                <text>{{ counting ? `${counter}s` : '获取验证码' }}</text>
                            </view>
                        </view>
                    </view>
                    
                    <!-- 新密码输入框 -->
                    <view class="input-group">
                        <view class="input-label">
                            <text class="required">*</text>
                            <text>新密码</text>
                        </view>
                        <view class="input-box">
                            <input 
                                type="password"
                                v-model="form.password"
                                placeholder="请输入新密码"
                                placeholder-class="placeholder"
                            />
                        </view>
                    </view>
                    
                    <!-- 确认新密码 -->
                    <view class="input-group">
                        <view class="input-label">
                            <text class="required">*</text>
                            <text>确认新密码</text>
                        </view>
                        <view class="input-box">
                            <input 
                                type="password"
                                v-model="form.confirmPassword"
                                placeholder="请再次输入新密码"
                                placeholder-class="placeholder"
                            />
                        </view>
                    </view>
                </view>
                
                <!-- 提交按钮 -->
                <view class="submit-area">
                    <button class="submit-btn" @tap="handleSubmit">
                        <text>重置密码</text>
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            form: {
                phone: '',
                verifyCode: '',
                password: '',
                confirmPassword: ''
            },
            counting: false,
            counter: 60
        }
    },
    methods: {
        goBack() {
            uni.navigateBack()
        },
        
        getVerifyCode() {
            if (this.counting) return
            
            if (!this.form.phone) {
                uni.showToast({
                    title: '请输入手机号',
                    icon: 'none'
                })
                return
            }
            
            if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
                uni.showToast({
                    title: '手机号格式不正确',
                    icon: 'none'
                })
                return
            }
            
            this.counting = true
            this.counter = 60
            const timer = setInterval(() => {
                this.counter--
                if (this.counter <= 0) {
                    clearInterval(timer)
                    this.counting = false
                }
            }, 1000)
            
            uni.showToast({
                title: '验证码已发送',
                icon: 'success'
            })
        },
        
        handleSubmit() {
            if (!this.form.phone || !this.form.verifyCode || 
                !this.form.password || !this.form.confirmPassword) {
                uni.showToast({
                    title: '请填写完整信息',
                    icon: 'none'
                })
                return
            }
            
            if (this.form.password !== this.form.confirmPassword) {
                uni.showToast({
                    title: '两次密码不一致',
                    icon: 'none'
                })
                return
            }
            
            uni.showToast({
                title: '密码重置成功',
                icon: 'success',
                duration: 2000,
                success: () => {
                    setTimeout(() => {
                        uni.navigateBack()
                    }, 2000)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background: #1a1b1e;
    position: relative;
    overflow: hidden;
}

/* 动态背景 */
.dynamic-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    
    .shape {
        position: absolute;
        filter: blur(100rpx);
        opacity: 0.3;
        will-change: transform;
        
        &-1 {
            width: 600rpx;
            height: 600rpx;
            background: linear-gradient(135deg, #7c3aed, #3b82f6);
            top: -200rpx;
            right: -200rpx;
            border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
            animation: shapeMove1 15s ease-in-out infinite alternate;
        }
        
        &-2 {
            width: 500rpx;
            height: 500rpx;
            background: linear-gradient(225deg, #6366f1, #8b5cf6);
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
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(60rpx);
        -webkit-backdrop-filter: blur(60rpx);
    }
}

/* 动画效果 */
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

/* 主要内容区 */
.main-content {
    position: relative;
    z-index: 2;
    padding: 40rpx;
    padding-top: var(--status-bar-height);
}

/* 表单卡片 */
.form-card {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 30rpx;
    padding: 40rpx;
    backdrop-filter: blur(20rpx);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.2);
}

/* 表单标题 */
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
        color: #fff;
        font-weight: 600;
    }
}

/* 表单内容 */
.form-content {
    .input-group {
        margin-bottom: 40rpx;
        
        .input-label {
            display: flex;
            align-items: center;
            margin-bottom: 16rpx;
            
            .required {
                color: #ef4444;
                margin-right: 8rpx;
            }
            
            text {
                color: rgba(255, 255, 255, 0.6);
                font-size: 26rpx;
            }
        }
        
        .input-box {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 16rpx;
            height: 90rpx;
            padding: 0 30rpx;
            
            input {
                height: 100%;
                color: #fff;
                font-size: 28rpx;
            }
            
            &.code-box {
                display: flex;
                align-items: center;
                padding-right: 20rpx;
                
                input {
                    flex: 1;
                }
                
                .code-btn {
                    height: 60rpx;
                    padding: 0 30rpx;
                    background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(99, 102, 241, 0.2));
                    border: 1px solid rgba(124, 58, 237, 0.3);
                    border-radius: 30rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    
                    text {
                        color: #a78bfa;
                        font-size: 24rpx;
                    }
                    
                    &.disabled {
                        opacity: 0.5;
                    }
                }
            }
        }
    }
}

/* 提交按钮 */
.submit-area {
    margin-top: 60rpx;
    
    .submit-btn {
        background: linear-gradient(135deg, #7c3aed, #6366f1);
        height: 90rpx;
        border-radius: 45rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 30rpx;
        font-weight: 500;
        box-shadow: 0 8rpx 20rpx rgba(124, 58, 237, 0.3);
        
        &:active {
            transform: scale(0.98);
            box-shadow: 0 4rpx 10rpx rgba(124, 58, 237, 0.2);
        }
    }
}

/* 占位符样式 */
.placeholder {
    color: rgba(255, 255, 255, 0.2);
}
</style> 