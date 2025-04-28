<template>
	<view class="container">
		<uni-card :is-shadow="false" is-full style="text-align: center; display: block; ">
			<text class="uni-h6" >无所事事，难获持久尊重；劳逸结合，过好健康人生</text>
		</uni-card>
		
		<!-- <uni-section title="基础信息" type="line"> -->
			<view class="example">
				<!-- 基础用法，不包含校验规则 -->
				<uni-forms ref="baseForm" :model="baseFormData" label-width="4.5rem">
					<input style="display: none;" v-model="baseFormData.userId" />
					
					<!-- <view class="code-container " style="display: flex; gap: 20rpx;">
						<view style="flex: 1;">
							<uni-forms-item label="称谓" required>
								<uni-easyinput v-model="baseFormData.username" placeholder="您喜欢的陌生人对您的称呼或姓名" />
							</uni-forms-item>
						</view>
						<view style="flex: 1;">
							<uni-forms-item label="密码" required>
								<uni-easyinput v-model="baseFormData.password" placeholder="您喜欢的陌生人对您的称呼或姓名" />
							</uni-forms-item>
						</view>
						
					</view>
					
					<view class="code-container" style="display: flex; gap: 20rpx;">
						<view style="flex: 1; position: relative;">
							<uni-forms-item label="手机号" required >
								<uni-easyinput v-model="baseFormData.mobile" placeholder="请输入手机号" @change="validateMobile" class="code-input" />
							</uni-forms-item>
						</view>
						
						  <view style="flex: 1; display: flex; align-items: flex-end;">
							<uni-forms-item label="验证码" required style="flex: 1;">
							  <uni-easyinput v-model="baseFormData.smsCode" placeholder="请输入验证码" @change="validateCode" />
							</uni-forms-item>
							<view style="margin-left: 20rpx; margin-bottom: 22px;">
							  <button 
								class="sms-btn"
								:disabled="!canGetCode || isCounting"
								@click="getSMSCode"
							  >
								{{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
							  </button>
							</view>
						  </view>
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
					</view> -->
<!-- 					<uni-forms-item label="身份证号" required>
						<uni-easyinput v-model="baseFormData.ID" placeholder="请输入身份证号" />
					</uni-forms-item> -->
					<uni-forms-item label="角色">
						<uni-data-checkbox v-model="baseFormData.rule" :localdata="rules" />
					</uni-forms-item>
					
					<uni-forms-item label="性别">
						<uni-data-checkbox v-model="baseFormData.sex" :localdata="sexs" />
					</uni-forms-item>
					<uni-forms-item label="技能" required>
						<!-- <uni-data-checkbox v-model="parsedSkills" multiple :localdata="skillsOptions" /> -->
						<uni-data-checkbox v-model="parsedSkills" multiple :localdata="skillsOptions" />
						<input style="display: none;" v-model="baseFormData.skills" />
						<uni-easyinput v-if="hasOtherSkill" v-model="baseFormData.otherSkills" placeholder="多个用逗号分隔" />
					</uni-forms-item>
					<uni-forms-item label="出生年月">
						<picker mode="date" fields="month"  start="1900-01-01" :value="baseFormData.birth" @change="dateChange">
							<view class="selectDate">{{baseFormData.birth}}</view>
						</picker>
					</uni-forms-item>
					<uni-forms-item label="接单区域">
						<view class="address-selector">
						  <view class="selector" @click="goLocationMap">
						    <uni-easyinput class="address-input" @longpress="longPressCopyText(baseFormData.address)" v-model="baseFormData.address" placeholder="请选择接单区域"></uni-easyinput>
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
					<button type="primary" @click="submit">提交</button>
				</uni-forms>
			</view>
		<!-- </uni-section> -->

	</view>
</template>

<script>
	import graceChecker from "@/common/js/graceChecker.js"
	const SYS_ID = 2025040301
	const JOB_TOKEN = 'JOB_TOKEN'
	const JOB_USER_SKILLS = "jobUserSkills"
	const keyStr = "jobInfoMap";
	const baseRules = [
	    // { name: "username",	checkType: "notnull",	errorMsg: "姓名不能为空" },
	    // { name: "mobile", 	checkType: "mobile", 	errorMsg: "手机号格式不正确" },
	 //    { name: "sex", 		checkType: "in", 		errorMsg: "请选择性别",		checkRule: "0,1,2"},
		// { name: "skills", 	checkType: "notnull", 	errorMsg: "请至少选择一个" },
	 //    { name: "latitude", checkType: "notnull", 	errorMsg: "位置必选" },
	    // { name: "homeLocation", checkType: "notnull", errorMsg: "位置必选" },
	  ];
	export default {
		data() {
			return {
				userToken:{},
				// 基础表单数据
				baseFormData: {
					sysId: SYS_ID,
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
				// 	[10,"泥水工",["泥水工","砌砖"]],
				// 	[20,"维修工",["维修","水电","电器","家电"]],
				// 	[30,"汽修",["汽修"]],
				// 	[40,"外语",["外语","英语","法语","德语","俄语","韩语","日语","西班牙语"]],
				// 	[50,"剪辑",["剪辑","图片","图像"]],
				// 	[60,"编辑",["编辑","文本","文员","world","wps","文档"]],
				// 	[70,"驾驶",["驾驶","司机","代驾"]],
				// 	[80,"才艺",["才艺","艺术","艺术","美术","素描","临摹","水彩","画画","钢琴","乐器","电子琴","",""]],
				// 	[90,"教练",["教练","健身","游泳","拳击","跆拳道","截拳道"]],
				// 	[-1,"其他",[]]
				],
				toolsOptions: [
					{value: 20, text: "不自带"	},
					{value: 10, text: "自带"	},
				],
				tool: 20,
				toolStyle: 'display: none;',
				// 性别
				rules: [
					{ text: '找工', 	value: 0 }, 
					{ text: '用工', 	value: 1 }, 
				],
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
				if(this.baseFormData.address && this.baseFormData.address.includes(this.baseFormData.district)) return this.baseFormData.address;
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
				  // console.log('新选中值：', newVal);
				  const selected = newVal.map(value => {
					const option = this.skillsOptions.find(o => o.value === value);
					return {[Number(option.value)]: option.text  };
				  });
				  this.baseFormData.skills = JSON.stringify(selected);
				  // console.log('设置值：', this.baseFormData.skills);
				  this.hasOtherSkill = this.judgeIncludeOtherSkill(this.baseFormData.skills)
				}
			}
		},
		onLoad(options) {
			const _this = this
			uni.getStorage({
				key: JOB_TOKEN,
				success: function(resp){
					_this.userToken = resp.data
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
					_this.baseFormData.userId = _this.userToken.userId;
				},
				fail:function(){
				}
			});
			// console.log("传递参数：" + JSON.stringify(options))
			this.baseFormData.username = options.username;
			// 监听全局事件（获取选择的地址）
			uni.$on('acceptAddress', (data) => {
				
			    // console.log("接收地址：" + JSON.stringify(data))
				// this.baseFormData.address = data.title;
				this.baseFormData.latitude 	= data.location.lat;	// 纬度
				this.baseFormData.longitude = data.location.lng;	// 经度
				this.baseFormData.province 	= data.province;
				this.baseFormData.city 		= data.city;
				this.baseFormData.district 	= data.district;
				
				this.baseFormData.address = (data.title && data.title.includes(data.district))? data.title : data.district+data.title;
				
				const url = '/pages/job/user_list/user_list'
				// console.log("转化数据：" + JSON.stringify(data))
				// console.log("跳转地址："+ url)
				uni.navigateTo({ url });
			});
			this.initGetKills();
		},
		onUnload() {
			// 避免泄露，结束卸载监听
			uni.$off('acceptAddress');
		},
		onReady() {},
		methods: {
			async submit() {
				// console.log(JSON.stringify(this.baseFormData));
				
				if(this.baseFormData.hasTools == 10){
					baseRules.push({ name: "tools", checkType: "notnull", errorMsg: "工具/设备 不能为空" });
				}
				if(this.judgeIncludeOtherSkill()){
					baseRules.push({ name: "otherSkills", checkType: "notnull", errorMsg: "选中【其他】后面输入框，不能为空" });
				}
				if (!graceChecker.check(this.baseFormData, baseRules)) {
					uni.showToast({ title: graceChecker.error, icon: 'none' });
					return;
				}else{
					uni.showToast({ title: `校验通过` });
				}
				const submitForm = {
					sysId: 			SYS_ID,
					userId: 		this.baseFormData.userId,
					introduction: 	this.baseFormData.introduction,
					sex: 			this.baseFormData.sex,
					birth: 			this.baseFormData.birth,
					address:		this.baseFormData.address,				// 位置：地址
					latitude:		this.baseFormData.latitude,				// 位置：纬度-坐标
					longitude:		this.baseFormData.longitude,				// 位置：经度-坐标
					province:		this.baseFormData.province,				// 省份
					city:			this.baseFormData.city,					// 市
					district:		this.baseFormData.district,				// 区
					skills:			this.baseFormData.skills,					// 技能
					otherSkills:	this.baseFormData.otherSkills,				// 其他技能
					tools:			this.baseFormData.tools					// 工具/设备 名称
				}
				const userId = await this.updateUser(submitForm);
				if(userId){
					// console.log("保存成功，userId:", userId)
					const url = `/pages/job/head_img/head_img?userId=${this.baseFormData.userId}&afterUrl=/pages/job/user_list/user_list`;
					uni.navigateTo({ url });
				}else{
					uni.showToast({ title: '提交失败', icon: 'none' });
				}
				
				// 清除缓存 
				uni.removeStorage({key: JOB_USER_SKILLS});
			},
			getSkills(){
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/getToolSource', // 获取技能选项
					data: {sysId: SYS_ID},
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						// console.log('userStream 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							const respData = result.data.data;
							// console.log("getToolSource返回值："+JSON.stringify(respData))
							this.skillsHandle(respData);
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
			},
			skillsHandle(tools){
				var toolsObj = JSON.parse(tools);
				// 转换为适合组件的数据格式
				this.skillsOptions = toolsObj.map(item => ({
				  value: item[0],
				  text: item[1],
				  dataContent: item[2] // 转义双引号 JSON.stringify(item[2]).replace(/"/g, '\\"')
				}));
				// console.log("选项："+JSON.stringify(this.skillsOptions))
			},
			
			hasTool(e){
				this.hasTools = false;
				// console.log("工具选择："+ e.detail.value)
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
						this.countdown();
					}
					
				} catch (error) {
					uni.showToast({ title: '发送失败', icon: 'none' });
				}
			},
			
			// 倒计时逻辑
			countdown() {
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
			
			dateChange(e) {
				this.baseFormData.birth = e.detail.value;
				// console.log("选中日期："+this.baseFormData.birth)
				// 可以在这里处理选择后的逻辑，例如获取选择月份的第一天和最后一天
			},
			judgeIncludeOtherSkill(jsonStr){
				try {
				  return JSON.parse(jsonStr || "[]").some(item => "-1" in item);
				} catch {
				  return false;
				}
			},
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
			// 去到地图的地址选取页
			goLocationMap(){
				uni.navigateTo({
				  url: "/pages/job/map/map"
				});
			},
			
			initGetKills(){
				// console.log("从内存读取，字体设置数据："+ JOB_USER_SKILLS)
				var _this = this
				uni.getStorage({
					key: JOB_USER_SKILLS,
					success: function(resp){
						// console.log("key:", JOB_USER_SKILLS, "返回内存原值：", JSON.stringify(resp))
						_this.skillsOptions = resp.data
						// console.log("初始从缓存中取值，设置字体比例：" + _this.skillsOptions)
					},
					fail:function(){
						_this.getSkills();
					}
				});
			},
			
			async updateUser(form){
				form.token 	= this.userToken.token;
				form.selfId = this.userToken.userId;
				form.userId = this.userToken.userId;
				// console.log("提交表单内容："+JSON.stringify(form))
				try {
					const result = await uni.request({
						url: process.env.UNI_BASE_URL+ '/api/job/updateUser',
						header: { 'Content-Type': 'application/json' },
						method: 'POST',
						data: JSON.stringify(form)
					});
					// console.log("result", JSON.stringify(result))
					
					if (result.statusCode !== 200) {
					  // console.error('请求失败:', error || result.data);
					  throw new Error('保存失败，请检查网络');
					}
					if (result.data.code != 0) {
					  // console.error('保存失败:', result.data.msg);
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
				// console.log("保存最新数据：", JSON.stringify(mapObj))
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
				        // console.log('上传成功：', res);
				    },
				    fail: (err) => {
				        console.log('上传失败：', err);
				    }
				});
			},
			
			// 长按复制
			longPressCopyText(val){
				if(val==''){
					// console.log("无内容，直接退出！")
					return;
				}
				uni.setClipboardData({
					data: val,
					success() {
						uni.showToast({
							title:'已复制到剪贴板',
							icon:'none',
							position:'top'
						});
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
	
	.uni-data-checklist{
		padding-top: 6px;
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
