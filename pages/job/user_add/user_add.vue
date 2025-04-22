<template>
	<view class="container">
		<uni-card :is-shadow="false" is-full style="text-align: center; display: block; ">
			<text class="uni-h6" >无所事事，难获持久尊重；劳逸结合，过好健康人生</text>
		</uni-card>
		
		<!-- <uni-section title="基础信息" type="line"> -->
			<view class="example">
				<!-- 基础用法，不包含校验规则 -->
				<uni-forms ref="baseForm" :model="baseFormData" labelWidth="80px">
					<input style="display: none;" v-model="baseFormData.userId" />
					<uni-forms-item label="称谓" required>
						<uni-easyinput v-model="baseFormData.username" placeholder="您喜欢的陌生人对您的称呼或姓名" />
					</uni-forms-item>
					
					<view class="code-container">
						<uni-forms-item label="手机号" required >
							<uni-easyinput v-model="baseFormData.mobile" placeholder="请输入手机号" @change="validateMobile" class="code-input" />
						</uni-forms-item>
						<!-- 获取验证码按钮 -->
						<button 
						    class="sms-btn"
						    :disabled="!canGetCode || isCounting"
						    @click="getSMSCode"
						>
						    {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
						</button>
					</view>
					
					<view class="code-container">
						<uni-forms-item label="验证码" required>
							<uni-easyinput class="code-input"
								v-model="baseFormData.smsCode" 
								placeholder="请输入验证码" 
								@change="validateCode"
							/>
						</uni-forms-item>
						<u-icon 
						    v-if="codeValid==1" 
						    name="checkmark-circle-fill" 
						    color="#06A88B" 
						    size="40rpx" 
						    class="valid-icon"
						/>
						<u-icon 
							v-if="codeValid==0"
							name="question-circle" 
							color="#D3D3D3" 
							size="36rpx" 
							class="question-icon"
						/>
						<u-icon 
							v-if="codeValid==-1"
							name="close-circle-fill" 
							color="#FF4D4F" 
							size="36rpx" 
							class="invalid-icon"
						/>
					</view>
<!-- 					<uni-forms-item label="身份证号" required>
						<uni-easyinput v-model="baseFormData.ID" placeholder="请输入身份证号" />
					</uni-forms-item> -->
					<uni-forms-item label="性别">
						<uni-data-checkbox v-model="baseFormData.sex" :localdata="sexs" />
					</uni-forms-item>
					<uni-forms-item label="技能" required>
						<uni-data-checkbox v-model="parsedSkills" multiple :localdata="skillsOptions" />
						<input style="display: none;" v-model="baseFormData.skills" />
						<uni-easyinput v-if="hasOtherSkill" :value="baseFormData.otherSkills" placeholder="多个用逗号分隔" />
					</uni-forms-item>
					<uni-forms-item label="出生年月">
						<picker mode="date" fields="month"  start="1900-01-01" :value="baseFormData.birth" @change="dateChange">
							<view class="selectDate">{{baseFormData.birth}}</view>
						</picker>
					</uni-forms-item>
					<uni-forms-item label="接单区域">
						<view class="address-selector">
						  <view class="selector" @click="location">
						    <uni-easyinput class="address-input" v-model="fullAddress" placeholder="请选择接单区域"></uni-easyinput>
						    <uni-icons type="arrowright" size="18" class="arrow-icon"></uni-icons>
							<input style="display: none;" v-model="baseFormData.latitude"   placeholder="纬度-接单区域坐标" />
							<input style="display: none;" v-model="baseFormData.longitude"  placeholder="经度-接单区域坐标" />
						  </view>
						</view>
					</uni-forms-item>
					
					<uni-forms-item label="是否自带工具\设备">
						<uni-data-checkbox v-model="tool" @change="hasTool" :localdata="toolsOptions" />
						<uni-easyinput v-if="hasTools" v-model="baseFormData.tools" 
						placeholder="多个用逗号分隔" />
					</uni-forms-item>
					<uni-forms-item label="自我介绍">
						<uni-easyinput type="textarea" v-model="baseFormData.introduction" placeholder="请输入自我介绍" />
					</uni-forms-item>
					<button type="primary" @click="submit('baseForm')">提交</button>
				</uni-forms>
			</view>
		<!-- </uni-section> -->

	</view>
</template>

<script>
	import graceChecker from "@/common/js/graceChecker.js"
	const keyStr = "jobInfoMap";
	const baseRules = [
	    // { name: "username",	checkType: "notnull",	errorMsg: "姓名不能为空" },
	    { name: "mobile", 	checkType: "mobile", 	errorMsg: "手机号格式不正确" },
	 //    { name: "sex", 		checkType: "in", 		errorMsg: "请选择性别",		checkRule: "0,1,2"},
		// { name: "skills", 	checkType: "notnull", 	errorMsg: "请至少选择一个" },
	 //    { name: "latitude", checkType: "notnull", 	errorMsg: "位置必选" },
	    // { name: "homeLocation", checkType: "notnull", errorMsg: "位置必选" },
	  ];
	export default {
		data() {
			return {
				// 基础表单数据
				baseFormData: {
					sysId: 2025040301,
					userId: 0,
					username: '',
					mobile: '',
					introduction: '',
					sex: 2,
					birth: '1970-01',
					address: '',				// 位置：地址
					latitude: '1',				// 位置：纬度-坐标
					longitude: '1',				// 位置：经度-坐标
					province:'',				// 省份
					city:'',					// 市
					district:'',				// 区
					skills: '',					// 技能
					otherSkills:'',				// 其他技能
					tools: '',					// 工具/设备 名称
				},
				// 技能
				skillsOptions: [
					{value: 10, text: "泥水工"	},
					{value: 20, text: "修水电"	},
					{value: 30, text: "修电器"	},
					{value: 40, text: "修车"	},
					{value: 50, text: "外语"	},
					{value: 60, text: "编程"	},
					{value: 70, text: "司机"	},
					{value: 80, text: "游泳"	},
					{value: 90, text: "画画"	},
					{value: 100, text: "书法"	},
					{value: 110, text: "钢琴"	},
					{value: 120, text: "演唱"	},
					{value: 130, text: "乐器"	},
					{value: -1,  text: "其他"	},
				],
				toolsOptions: [
					{value: 20, text: "不自带"	},
					{value: 10, text: "自带"	},
				],
				tool: 20,
				toolStyle: 'display: none;',
				// 性别
				sexs: [
					{ text: '男', 	value: 0 }, 
					{ text: '女', 	value: 1 }, 
					{ text: '保密', value: 2 },
				],
				// 头像样式
				headImageStyles: {
					width: 64,
					height: 64,
					border: {
						radius: '50%'
					}
				},
				hasOtherSkill: false,		// 其他技能
				hasTools: false,			// 是否带工具
				
				countdown: 0,
				isCounting: false,
				codeValid: 0,
				smsCodeDisabled: false,
				canGetCode : false,
				
			}
		},
		computed: {
			fullAddress(){
				return this.baseFormData.district + this.baseFormData.address;
			},
			parsedSkills: {
				get() {
				  try {
					return Object.values(JSON.parse(this.baseFormData.skills).map(item=>parseInt(Object.keys(item)[0])));
				  } catch {
					return [];
				  }
				},
				set(newVal) {
					console.log('新选中值：', newVal);
				  const selected = newVal.map(value => {
					const option = this.skillsOptions.find(o => o.value === value);
					return {[Number(option.value)]: option.text  };
				  });
				  this.baseFormData.skills = JSON.stringify(selected);
				  console.log('设置值：', this.baseFormData.skills);
				  this.hasOtherSkill = this.judgeIncludeOtherSkill(this.baseFormData.skills)
				}
			}
		},
		onLoad() {
			// 监听全局事件（获取选择的地址）
			uni.$on('acceptAddress', (data) => {
				
			    // console.log("接收地址：" + JSON.stringify(data))
				// uni.showToast({title: "接收地址：" +JSON.stringify(data)})
				// this.baseFormData.address = `${data.title}`;
				
				this.baseFormData.address = data.title;
				this.baseFormData.latitude 	= data.location.lat;	// 纬度
				this.baseFormData.longitude = data.location.lng;	// 经度
				this.baseFormData.province 	= data.province;
				this.baseFormData.city 		= data.city;
				this.baseFormData.district 	= data.district;
				// console.log("转化地址：" + this.baseFormData.address)
			});
		},
		onUnload() {
			// 避免泄露，结束卸载监听
			uni.$off('acceptAddress');
		},
		onReady() {},
		methods: {
			async submit(ref) {
				console.log(this.baseFormData);
				if(this.baseFormData.hasTools == 10){
					baseRules.push({ name: "tools", checkType: "notnull", errorMsg: "工具/设备 不能为空" });
				}
				if(this.judgeIncludeOtherSkill()){
					baseRules.push({ name: "otherSkills", checkType: "notnull", errorMsg: "技能 不能为空" });
				}
				if (!graceChecker.check(this.baseFormData, baseRules)) {
					uni.showToast({ title: graceChecker.error, icon: 'none' });
					return;
				}else{
					uni.showToast({
						title: `校验通过`
					});
				}
				const userId = await this.saveToStore(this.baseFormData);
				if(userId){
					console.log("保存成功，userId:", userId)
					const url = `/pages/job/head_img/head_img?userId=${userId}`;
					uni.navigateTo({ url });	
				}else{
					uni.showToast({ title: '注册失败', icon: 'none' });
				}

			},
			
			hasTool(e){
				this.hasTools = false;
				console.log("工具选择："+ e.detail.value)
				if(e.detail.value === 10) this.hasTools = true;
			},

			// 验证手机号格式
			validateMobile() {
				const reg = /^1[3-9]\d{9}$/;
				this.canGetCode = reg.test(this.baseFormData.mobile);
				// console.log("手机号："+this.baseFormData.mobile+"；验证结果："+this.canGetCode)
			},
			
			// 获取验证码
			async getSMSCode() {
				if (!this.canGetCode) return;
				
				try {
					const param = {
							phone: this.baseFormData.mobile,
							opt: 'add jobUser',
							sysId: this.baseFormData.sysId
					}
					// 调用后端API发送验证码
					const res = await uni.request({
						url: process.env.UNI_BASE_URL+'/api/sys/sms/sendCodeMessage',
						// url: 'http://localhost:18281/api/sys/sms/sendCodeMessage',
						// url: 'http://xny.world:18281/api/sys/sms/sendCodeMessage',
						method: 'POST',
						header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
						data: param
					});
					console.log("短信验证码-参数"+JSON.stringify(param)+"；返回值：" + JSON.stringify(res))
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
			
			// 短信验证
			async validateCode(){
				this.codeValid = 1;
				return
				try {
					const param = {
							phone: this.baseFormData.mobile,
							code: this.baseFormData.smsCode,
							opt: 'add jobUser',
							sysId: this.baseFormData.sysId
					}
					// 调用后端API发送验证码
					const res = await uni.request({
						url: process.env.UNI_BASE_URL+'/api/sys/sms/checkCode',
						// url: 'http://localhost:18281/api/sys/sms/checkCode',
						// url: 'http://xny.world:18281/api/sys/sms/checkCode',
						method: 'POST',
						header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
						data: param
					});
					// console.log("短信验证码-参数"+JSON.stringify(param)+"；返回值：" + JSON.stringify(res))
					if(res.data.code == 0) {
						uni.showToast({ title: '验证通过', icon: 'success'});
						// 短信验证通过
						this.codeValid = 1;
					}else{
						this.codeValid = -1;
					}
					
				} catch (error) {
					uni.showToast({ title: '发送失败', icon: 'error' });
				}
			},
			
			dateChange(e) {
				this.baseFormData.birth = e.detail.value;
				console.log("选中日期："+this.baseFormData.birth)
				// 可以在这里处理选择后的逻辑，例如获取选择月份的第一天和最后一天
			},
			judgeIncludeOtherSkill(jsonStr){
				try {
				  return JSON.parse(jsonStr || "[]").some(item => "-1" in item);
				} catch {
				  return false;
				}
			}
			,
			skillsChange(e) {
				if(e.detail.value == -1) return;
				const selectOptions = e.detail.value.map(value => {
					// 根据 value 查找对应的 text；同时 排除 ‘其他’ 选项
					const selectOption = this.skillsOptions.find(option => (option.value === value));
					if(selectOption){
						return {
							value: selectOption.value,
							text: selectOption.text ,
						};
					}
				});
				
				this.baseFormData.skills = JSON.stringify(selectOptions);
			},
			
			location(){
				uni.navigateTo({
				  url: "/pages/job/map/map"
				});
			},
			
			getStoreByKey(){
				uni.getStorage({
					key: keyStr,
					success: function(resp){
						console.log("key:", keyStr, "返回值：", JSON.stringify(resp.data))
						// 更新对象 的指定属性，或追加属性
						// _this.$set(_this, table_tag_key, resp.data);
					},
					fail:function(){
						console.log("未取得 key:", keyStr);
					}
				});
			},
			
			async saveToStore(saveData){
				try {
					const result = await uni.request({
						url: process.env.UNI_BASE_URL+ '/api/job/saveUser',
						// url: 'http://localhost:18281/api/job/saveUser',
						// url: 'http://xny.world:18281/api/job/saveUser',
						header: { 'Content-Type': 'application/json' },
						method: 'POST',
						data: JSON.stringify(saveData)
					});
					console.log("result", JSON.stringify(result))
					
					if (result.statusCode !== 200) {
					  console.error('请求失败:', error || result.data);
					  throw new Error('保存失败，请检查网络');
					}
					if (result.data.code != 0) {
					  console.error('保存失败:', result.data.msg);
					  throw new Error(result.data.msg || '保存失败');
					}

					// 明确返回数据给调用处
					return result.data.data;
				} catch (err) {
				    console.error('捕获异常:', err);
				}
				
				
				// console.log("已保存 keyStr:", keyStr, "数据：", JSON.stringify(saveData));
				// return 10;
			},
			
			setStore(map, saveData){
				map.set(saveData.mobile, saveData)
				const mapObj = Object.fromEntries(map);
				uni.setStorage({
					key: 	keyStr,
					data:	mapObj
				});
				console.log("保存最新数据：", JSON.stringify(mapObj))
			},
			
			// 选择或者拍照
			chooseImage() {
			  uni.chooseImage({
			    count: 1, // 默认9，这里我们只选一张图
			    sizeType: ['original', 'compressed'], // 可选择原图或压缩图
			    sourceType: ['album', 'camera'], // 支持从相册和摄像头选择
			    success: (res) => {
			      const filePath = res.tempFilePaths; // 获取选择的第一张图片路径
			      // 在这里可以对图片进行进一步处理，如上传、预览等
			    },
			    fail: (err) => {
			      uni.showToast({
			        title: '选择图片失败',
			        icon: 'none'
			      });
			    }
			  });
			},
			
			preShow(tempFilePaths){
				uni.previewImage({
				    urls: tempFilePaths // 需要预览的图片路径数组
				});
			},
			
			uploadFile(tempFilePaths){
				uni.uploadFile({
				    url: '服务器上传接口地址',
				    filePath: tempFilePaths, // 选择的第一张图片路径
				    name: 'file',
				    success: (res) => {
				        console.log('上传成功：', res);
				    },
				    fail: (err) => {
				        console.log('上传失败：', err);
				    }
				});
			},
			
			
			
		}
	}
</script>

<style lang="scss">
	.example {
		padding: 15px;
		background-color: #fff;
		// background:linear-gradient(180deg, #ff6043 51%, rgba(255, 96, 67, 0) 100%);
	}

	.segmented-control {
		margin-bottom: 15px;
	}

	.button-group {
		margin-top: 15px;
		display: flex;
		justify-content: space-around;
	}

	.form-item {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.button {
		display: flex;
		align-items: center;
		height: 35px;
		line-height: 35px;
		margin-left: 10px;
	}
	
	.selectDate {
	    border: 1px solid #e5e5e5;
	    border-radius: 4px;
	    background-color: #EAF4FF;
	    color: #3399FF;
	    font-size: 30rpx;
	    font-family: PingFangSC;
	    font-weight: Regular;
	    max-width: 600rpx;
	    height: 70rpx;
	    line-height: 70rpx;
	    padding-left: 30rpx;
	}
	
	.address-input {
		color: #3399FF;
	}
	.arrow-icon {
	  position: absolute;
	  right: 10px;
	  top: 50%;
	  transform: translateY(-50%);
	  z-index: 2;
	}
	
	  // .force-highlight-other {
	  //   // 未选中时高亮
	  //    ::v-deep .uni-data-checklist .checklist-item[data-value='-1']:not(.checked) {
	  //      .checklist-box {
	  //        border: 2rpx solid #FF4D4F !important;  // 红色边框
	  //        background-color: #FFF1F0 !important;    // 浅红背景
			//  &::after { /* 处理组件可能的内置伪元素 */
			//    border-color: #FF4D4F !important;
			//  }
	  //      }
	  //      .checklist-content .checklist-text {
	  //        color: #FF4D4F !important;               // 红色文字
	  //        font-weight: bold !important;            // 加粗
	  //      }
	  //    }
		 
	  //    // 选中时恢复默认
	  //    ::v-deep .checklist-item[data-value="-1"].checked {
	  //      .checklist-box {
	  //        border-color: #007AFF !important;
	  //        background-color: #fff !important;
	  //      }
	  //      .checklist-text {
	  //        color: #333 !important;
	  //        font-weight: normal !important;
	  //      }
	  //    }
	  //  }
	
	// .force-highlight-other {
	//   // 未选中状态
	//   ::v-deep .uni-data-checklist .checklist-group .checklist-item[data-value="-1"] {
	//     .checklist-box {
	//       border-color: #f00 !important; // 边框红色
	//     }
	//     .checklist-content .checklist-text {
	//       color: #f00 !important; // 文字红色
	//     }
	//   }
	// }
	
	// .uni-h6{
	// 	height:91px;background:linear-gradient(180deg, #ff6043 51%, rgba(255, 96, 67, 0) 100%);padding-top:47px;width:100%
	// }
	
	/* 新增样式 */
	uni-button{
		margin-left: 5px;
		margin-right: auto;
	}
	.code-container {
	    position: relative;
	    display: flex;
	    align-items: center;
	    gap: 10px;
		
		::v-deep .u-icon__icon{
			margin-bottom: 20px;
		}
		
	    /* 新增固定宽度容器 */
	    ::v-deep .uni-forms-item__content {
		  flex: 0 0 300rpx !important; // 固定内容区宽度
		  max-width: 300rpx;
		  min-width: 300rpx;
	    }
	
	    .sms-btn {
	        width: 200rpx;
	        height: 70rpx;
	        line-height: 70rpx;
	        font-size: 24rpx;
	        background: #06A88B;
	        color: white;
	        border-radius: 8rpx;
	        transition: all 0.3s;
			margin-bottom: 22px;
	
	        &.disabled {
	            background: #cccccc;
	            opacity: 0.7;
	        }
	
	        &:active {
	            opacity: 0.8;
	            transform: scale(0.98);
	        }
	    }
	}
	
	/* 响应式适配 */
	@media (min-width: 768px) {
	    .code-container {
			position: relative;
	        .sms-btn {
	            width: 160px;
	            font-size: 14px;
	        }
			
			::v-deep .u-icon__icon{
				margin-bottom: 20px;
			}
			
			::v-deep .uni-forms-item__content {
			  flex: 0 0 160px !important;
			  max-width: 160px;
			  min-width: 160px;
			}
	    }
		
	}
</style>
