<template>
	<view class="container">
		<uni-card :is-shadow="false" is-full style="text-align: center; display: block; ">
			<text class="uni-h6" >无所事事，难获持久尊重；劳逸结合，过好健康人生</text>
		</uni-card>
		
		<!-- <view class="slider-container" style="z-index: 9999;">
			<u-slider v-model="fontSizeScale"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9"
			 min="50" max="200" step="10" block-size="20" @changing="onFontSizeChange" show-value></u-slider>
		</view> -->
		    <!-- <text style="text-align: center; display: block;">字体缩放比例：{{fontSizeScale}}%</text> -->
		
		<!-- <uni-section title="基础信息" type="line"> -->
			<view class="example" >
				<!-- 基础用法，不包含校验规则 -->
				<uni-forms ref="baseForm" :model="baseFormData" label-width="6.5rem">
					<input style="display: none;" v-model="baseFormData.jobUserDO.userId" />
					<uni-forms-item label="角色" required>
						<uni-data-checkbox v-model="baseFormData.jobUserDO.rule" :localdata="rules" />
					</uni-forms-item>
					
					<uni-forms-item label="性别" required>
						<uni-data-checkbox v-model="baseFormData.jobUserDO.sex" :localdata="sexs" />
					</uni-forms-item>
					<uni-forms-item label="技能" required>
						<uni-data-checkbox v-model="parsedSkills" multiple :localdata="skillsOptions" :map="{ value: 'value', text: 'text' }" />
						<input style="display: none;" v-model="baseFormData.jobUserDO.skillsName" />
						<uni-easyinput v-if="baseFormData.jobUserDO.skills?.includes(-1)" v-model="baseFormData.jobUserDO.otherSkills" placeholder="多个用逗号分隔" />
					</uni-forms-item>
					<uni-forms-item label="出生年月">
						<picker mode="date" fields="month"  start="1900-01-01" :value="baseFormData.jobUserDO.birth" @change="dateChange">
							<view class="selectDate">{{baseFormData.jobUserDO.birth}}</view>
						</picker>
					</uni-forms-item>
					<uni-forms-item label="接单区域" required>
						<view class="address-selector">
						  <view class="selector" @click="goLocationMap">
						    <uni-easyinput class="address-input" @longpress="longPressCopyText(baseFormData.jobUserDO.address)" v-model="baseFormData.jobUserDO.address" placeholder="请选择接单区域"></uni-easyinput>
						    <uni-icons type="arrowright" size="18" class="arrow-icon"></uni-icons>
							<input style="display: none;" v-model="baseFormData.jobUserDO.latitude"   placeholder="纬度-接单区域坐标" />
							<input style="display: none;" v-model="baseFormData.jobUserDO.longitude"  placeholder="经度-接单区域坐标" />
						  </view>
						</view>
					</uni-forms-item>
					
					<uni-forms-item label="工具\设备">
						<uni-data-checkbox v-model="tool" @change="handleTool" :localdata="toolsOptions" />
						<uni-easyinput v-if="baseFormData.jobUserDO.tools?true:false" v-model="baseFormData.jobUserDO.tools" 
						placeholder="多个用逗号分隔" />
					</uni-forms-item>
					<uni-forms-item label="自我介绍">
						<uni-easyinput type="textarea" v-model="baseFormData.jobUserDO.introduction" placeholder="请输入自我介绍" />
					</uni-forms-item>
					
					
					<uni-section title="扩展信息" type="line">
						<view class="example">
							<!-- 动态表单校验 -->
							<uni-forms ref="dynamicForm" :rules="dynamicRules" :model="dynamicFormData" labelWidth="80px">
								<!-- <uni-card> -->
								<uni-card v-for="(item, index) in dynamicFormData.domains" :key="item.id"
									:label="item.label+' '+index" required :rules="item.rules" :name="['domains', index, 'value']">
									<!-- <view class="form-item"> -->
									<view style="display: flex; justify-content:space-between; ">
										<uni-badge class="uni-badge-left-margin" size="normal" :text="'板块'+index" type="primary" :customStyle="{ backgroundColor: '#45b97c', color: '#fff' }" />
										<view style="display: flex; flex-direction: column; align-items: center;">
											<view>关闭/开启</view>
											<uniListItem :titleStyle="handleTitleStyle(18)" :border="false" :show-switch="true"
												@switchChange="handleSwitchChange" :switchObj="index" :switchChecked="dynamicFormData.domains[index].enabled==0?true:false" />
										</view>
										
										<view style="display: flex;">
											<view class="move-icon bg-green2" > <uni-icons type="arrow-up" 	 size="20"	@click="moveUpDownItem(index, 0)" color="#fff"></uni-icons> </view>
											<view class="move-icon bg-green2" > <uni-icons type="arrow-down" size="20"	@click="moveUpDownItem(index, 1)" color="#fff"></uni-icons> </view>
										</view>
									</view>
									
									<uni-easyinput v-model="dynamicFormData.domains[index].title" placeholder="请输入标题" />
									<uni-easyinput style="margin-top: 10px !important; margin-bottom: 10px !important; " type="textarea" v-model="dynamicFormData.domains[index].summary" placeholder="请输入简介" />
									
									<!-- 图片上传 -->
									<uni-forms-item label="上传图片">
										<uni-file-picker
											v-model="dynamicFormData.domains[index].images"
											limit="20"  
											:image-styles="imageStyles"
											mode="grid"
											:sourceType="['camera','album']"
											:del-icon="true"
											:auto-upload="false"
											file-mediatype="image"
											@select="handleSelectUpload($event, index)"
										></uni-file-picker>
									</uni-forms-item>
									
									<button class="button" style="background-color: #ed1941; justify-content:center;" type="default" @click="delDynamicItem(item.id)">删除</button>
									<!-- </view> -->
									
								<!-- </uni-forms-item> -->
								</uni-card>
								<button class="button" style="background-color: #45b97c; justify-content:center;" type="default" @click="addDynamicItem">新增板块</button>
								
								<view class="button-group" style="align-items: center; justify-content:center; " >
								</view>
								
								<uni-forms-item label="自定义" name="content" style="margin-top: 30rpx;">
									<uni-easyinput type="textarea" v-model="dynamicFormData.content" placeholder="请输入html" />
								</uni-forms-item>
							</uni-forms>
						</view>
					</uni-section>
					
					<button style="background-color: #45b97c; " type="primary" @click="submit">提交</button>
				</uni-forms>
			</view>
		<!-- </uni-section> -->

	</view>
</template>

<script>
	import graceChecker from "@/common/js/graceChecker.js"
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import uploadUtils from '@/common/js/util/uploadUtils.js';
	
	const SYS_ID = 2025040301
	const JOB_TOKEN = 'JOB_TOKEN'
	const JOB_USER_SKILLS = "jobUserSkills"
	const keyStr = "jobInfoMap";
	const baseRules = [
	    // { name: "rule",	checkType: "notnull",	errorMsg: "角色必选" },
	    { name: "username",	checkType: "notnull",	errorMsg: "姓名不能为空" },
	    // { name: "mobile", 	checkType: "mobile", 	errorMsg: "手机号格式不正确" },
	    // { name: "sex", 		checkType: "in", 		errorMsg: "请选择性别",		checkRule: "0,1,2"},
	 	{ name: "skills", 	checkType: "notnull", 	errorMsg: "如何选项中没有，就选最后一个“其他”" },
	    { name: "latitude", checkType: "notnull", 	errorMsg: "位置必选" },
	    // { name: "homeLocation", checkType: "notnull", errorMsg: "位置必选" },
	  ];
	export default {
        components: { uniListItem },
		data() {
			return {
				uploadToken: '',
				userToken:{},
				// 基础表单数据
				baseFormData: {
					jobUserDO:{
						sysId: SYS_ID,
						userId: 0,
						username: '',
						mobile: '',
						rule:0,
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
						skillsName: '',					// 技能
						otherSkills:'',				// 其他技能
						tools: '',					// 工具/设备 名称
					}
					
					// dynamicFormData: {
					// 	content: '',
					// 	domains: [{id:0, label: '介绍', title:'', summary:'', content:'', images:[] }]
					// },
				},
				// 技能
				skillsOptions: [
				// {"value":30,"text":"汽修","keyword":["汽修"]},{"value":40,"text":"外语","keyword":["外语","英语","法语","德语","俄语","韩语","日语","西班牙语"]},{"value":50,"text":"剪辑","keyword":["剪辑","图片","图像"]},{"value":60,"text":"编辑","keyword":["编辑","文本","文员","world","wps","文档"]},{"value":70,"text":"驾驶","keyword":["驾驶","司机","代驾"]},{"value":80,"text":"才艺","keyword":["才艺","艺术","艺术","美术","素描","临摹","水彩","画画","钢琴","乐器","电子琴"]},{"value":90,"text":"教练","keyword":["教练","健身","游泳","拳击","跆拳道","截拳道"]},{"value":10,"text":"砌砖","keyword":["泥水工","砌砖"]},{"value":20,"text":"维修","keyword":["维修","水电","电器","家电"]},{"value":-1,"text":"其他","keyword":[]}

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
				hasTools: false,			// 是否带工具
				
				hasOtherSkill: false,		// 其他技能
				
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
				
				dynamicFormData: {
					content: '',
					domains: []
					// domains: [{id:0, label: '介绍', title:'', summary:'', content:'', images:[], enabled: 0 }]
				},
				dynamicRules: {
					email: {
						rules: [{
							required: true,
							errorMessage: '域名不能为空'
						}, {
							format: 'email',
							errorMessage: '域名格式错误'
						}]
					}
				},
				
				
				images: [],
				imageStyles: {
				    width: 160,
				    height: 160,
					mode: 'aspectFill', 	// 图片填充模式
					background: '#f8f8f8', 	// 加载时的背景色
				    border: {
				        color: '#eee',
				        width: 1,
				        style: 'solid'
				    }
				},
				
				showUploadSheet: false,  	// 弹出 选项
				uploadActions: [
					{ index: 0, name: '从相册选择' },
					{ index: 1, name: '拍照' }
				],
				
				isCounting: false,
				codeValid: 0,
				smsCodeDisabled: false,
				canGetCode : false,
				
				// 字体缩放
				fontSet: '',
				fontScale: 1.0,
				fontSizeScale: 100, // 默认100%比例
				baseFontSize: 16,   // 基础字体大小（根据设计稿调整）
			}
		},
		computed: {
			fullAddress(){
				if(this.baseFormData.jobUserDO.address && this.baseFormData.jobUserDO.address.includes(this.baseFormData.jobUserDO.district)) return this.baseFormData.jobUserDO.address;
				return this.baseFormData.jobUserDO.district + this.baseFormData.jobUserDO.address;
			}
			,
			parsedSkills: {
				get() {
				  try {
					return JSON.parse(this.baseFormData.jobUserDO.skills||[]) ;
				  } catch {
					return [];
				  }
				},
				set(newVal) {
				  // console.log('新选中值：', newVal);
				  this.baseFormData.jobUserDO.skills = JSON.stringify(newVal)
				  this.$set(this.baseFormData, 'skills', JSON.stringify(newVal))
				  const validSkills = newVal.filter(v => v !== -1);
				        this.baseFormData.jobUserDO.skillsName = validSkills
				          .map(v => this.skillsOptions.find(o => o.value === v)?.text || '')
				          .filter(Boolean)
				          .join(',');
				  // console.log('设置值：', this.baseFormData.jobUserDO.skills);
				  this.hasOtherSkill = newVal.includes(-1)
				  if (!this.hasOtherSkill) {
				    this.$set(this.baseFormData, 'otherSkills', '')
				  }
				}
			}
		},
		onLoad() {
			// 监听全局事件（获取选择的地址）
			uni.$on('acceptAddress', (data) => {
				// console.log("接收地址：" + JSON.stringify(data))
				// this.baseFormData.jobUserDO.address = data.title;
				this.baseFormData.jobUserDO.latitude 	= data.location.lat;	// 纬度
				this.baseFormData.jobUserDO.longitude = data.location.lng;	// 经度
				this.baseFormData.jobUserDO.province 	= data.province;
				this.baseFormData.jobUserDO.city 		= data.city;
				this.baseFormData.jobUserDO.district 	= data.district;
				
				this.baseFormData.jobUserDO.address = (data.title && data.title.includes(data.district))? data.title : data.district+data.title;
				
				// console.log("转化数据：" + JSON.stringify(data))
				// console.log("跳转地址："+ url)
				uni.navigateTo({ url: `/pages/job/user/user_list` });
			});
			
		},
		onUnload() {
			// 避免泄露，结束卸载监听
			uni.$off('acceptAddress');
		},
		mounted(){
			const _this = this
			uni.getStorage({
				key: JOB_TOKEN,
				success: function(resp){
					_this.userToken = resp.data
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
					_this.baseFormData.jobUserDO.userId = _this.userToken.userId;
					_this.getJobUserByUserId();
				},
				fail:function(){
					uni.showToast({ title: '需要先登录！', icon: 'none' });
					setTimeout(() => {
					  uni.navigateTo({ url: `/pages/job/index` });
					}, 1000); // 1000毫秒等于1秒
				},
				complete() {
					_this.initGetKills();
					_this.getToken()
				}
			});
			// console.log("传递参数：" + JSON.stringify(options))
		},
		onReady() {},
		methods: {
			moveUpDownItem(index, upDown){
				console.log(upDown==0?"上移":"下移");
				// 顶元素，上移无效
				if(upDown==0 && index==0) return;
				// 底元素，下移无效
				if(upDown==1 && index==this.dynamicFormData.domains.length-1) return;
				// 上移
				if(upDown==0){
					let temp = this.dynamicFormData.domains[index];
					this.$set(this.dynamicFormData.domains, index, this.dynamicFormData.domains[index - 1]);
					this.$set(this.dynamicFormData.domains, index - 1, temp);
				}
				// 下移
				if(upDown==1){
					let temp = this.dynamicFormData.domains[index];
					this.$set(this.dynamicFormData.domains, index, this.dynamicFormData.domains[index + 1]);
					this.$set(this.dynamicFormData.domains, index + 1, temp);
				}
				
			},
			
			addDynamicItem() {
				if(this.dynamicFormData.domains.length>20){
					uni.showToast({ title: '板块最多支持20个，请优化！', icon: 'none' });
					return;
				}
				this.dynamicFormData.domains.push({
					label: '介绍',
					title:'', summary:'', content:'', enabled:0, images:[],
					rules: [{
						'required': true,
						errorMessage: '域名项必填'
					}],
					id: Date.now()
				})
			},
			
			delDynamicItem(id) {
				let index = this.dynamicFormData.domains.findIndex(v => v.id === id)
				this.dynamicFormData.domains.splice(index, 1)
			},
		
			// 处理文件选择事件
			handleSelectUpload(e, index) {
				// console.log("选择文件事件:", e);
				// 合并新旧文件（保留完整文件对象）
				this.dynamicFormData.domains[index].images = [...this.dynamicFormData.domains[index].images, ...e.tempFiles];
				this.$forceUpdate(); // 强制更新视图
			},
			
			async submit() {
				const uploadToken = this.uploadToken
				const userToken = this.userToken
				// console.log(JSON.stringify(this.baseFormData));
				if(this.baseFormData.jobUserDO.hasTools == 10){
					baseRules.push({ name: "tools", checkType: "notnull", errorMsg: "工具/设备 不能为空" });
				}
				if(this.hasOtherSkill){
					baseRules.push({ name: "otherSkills", checkType: "notnull", errorMsg: "选中【其他】后面输入框，不能为空" });
				}
				if (!graceChecker.check(this.baseFormData.jobUserDO, baseRules)) {
					uni.showToast({ title: graceChecker.error, icon: 'none' });
					return;
				}
				
				const _this = this
				if(this.dynamicFormData.domains && this.dynamicFormData.domains?.length>0){
					for(let num = this.dynamicFormData.domains.length-1; num>=0; num--){
						let domain = this.dynamicFormData.domains[num];
						
						// 无数据板块，自动移除
						if(!domain || domain.images==0 && !domain.title && !domain.summary && !domain.content){
							this.dynamicFormData.domains.splice(num, 1);
							continue;
						}
						
						// 无图片，不必上传
						if(domain.images.length==0) continue;
						for(let i = 0; i<domain.images.length; i++){
							let file = domain.images[i]
							const path = file.url || file.path || file
							const imgPath = await uploadUtils.uploadImg(path, uploadToken, 'job/userInfo/', userToken.userId);
							// console.log("upload after path:"+imgPath)
							if(imgPath){
								domain.images[i] = imgPath;
							}
						}
					}
					// console.log("更新后板块信息："+JSON.stringify(this.dynamicFormData.domains))
				}
				
				const submitForm = {
					jobUserDO:{
						sysId: 				SYS_ID,
						userId: 			this.baseFormData.jobUserDO.userId,
						introduction: 		this.baseFormData.jobUserDO.introduction,
						sex: 				this.baseFormData.jobUserDO.sex,
						birth: 				this.baseFormData.jobUserDO.birth,
						address:			this.baseFormData.jobUserDO.address,			// 位置：地址
						latitude:			this.baseFormData.jobUserDO.latitude,			// 位置：纬度-坐标
						longitude:			this.baseFormData.jobUserDO.longitude,			// 位置：经度-坐标
						province:			this.baseFormData.jobUserDO.province,			// 省份
						city:				this.baseFormData.jobUserDO.city,				// 市
						district:			this.baseFormData.jobUserDO.district,			// 区
						skills:				this.baseFormData.jobUserDO.skills,				// 技能 
						skillsName:			this.baseFormData.jobUserDO.skillsName,			// 技能名称
						otherSkills:		this.baseFormData.jobUserDO.otherSkills,		// 其他技能
						tools:				this.baseFormData.jobUserDO.tools				// 工具/设备 名称
					},
					content:				this.dynamicFormData.content,
					userMoreVOList:			this.dynamicFormData.domains,
				}
				this.updateUser(submitForm);
				if(!this.baseFormData.jobUserDO?.headImgPath){
					// console.log("保存成功，userId:", userId)
					const url = `/pages/job/head_img/head_img?userId=${this.baseFormData.jobUserDO.userId}&afterUrl=/pages/job/index`;
					uni.navigateTo({ url });
				}
				
				// 清除缓存 
				uni.removeStorage({key: JOB_USER_SKILLS});
				uni.navigateBack()
			},
			
			getSkills(){
				const _this = this;
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
							// _this.skillsHandle(respData);
							this.skillsOptions = JSON.parse(respData);
							console.log("this.skillsOptions："+JSON.stringify(this.skillsOptions))
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
			},
			
			handleTool(e){
				this.hasTools = false;
				// console.log("工具选择："+ e.detail.value)
				if(e.detail.value === 10) this.hasTools = true;
			},

			// 验证手机号格式
			validateMobile() {
				const reg = /^1[3-9]\d{9}$/;
				this.canGetCode = reg.test(this.baseFormData.jobUserDO.mobile);
				// console.log("手机号："+this.baseFormData.jobUserDO.mobile+"；验证结果："+this.canGetCode)
			},
			
			// 获取验证码
			async getSMSCode() {
				if (!this.canGetCode) return;
				try {
					const param = {
							phone: this.baseFormData.jobUserDO.mobile,
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
					if(res.statusCode == 200 && res.data.code == 0) {
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
				this.countdownNum = 60;
				const timer = setInterval(() => {
					if(this.countdownNum <= 0) {
						clearInterval(timer);
						this.isCounting = false;
						return;
					}
					this.countdownNum --;
				}, 1000);
			},
			
			dateChange(e) {
				this.baseFormData.jobUserDO.birth = e.detail.value;
				// console.log("选中日期："+this.baseFormData.jobUserDO.birth)
				// 可以在这里处理选择后的逻辑，例如获取选择月份的第一天和最后一天
			},
			
			skillsChange(e) {
				if(e.detail.value == -1) return;
				const selectOptions = e.detail.value.map(value => {
					// 根据 value 查找对应的 text；同时 排除 ‘其他’ 选项
					const selectOption = this.skillsOptions.find(option => (option.value === value));
					if(selectOption){
						return { value: selectOption.value, text: selectOption.text };
					}
				});
				
				this.baseFormData.jobUserDO.skills = JSON.stringify(selectOptions);
			},
			
			hasOtherSkills(e){
				console.log("输入 技能集合:", JSON.stringify(e))
				if(!e) return false;
				return e.includes(-1);
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
						console.log("初始从缓存中取值，技能：" + _this.skillsOptions)
					},
					fail:function(){
						_this.getSkills();
					}
				});
			},
			
			updateUser(form){
				form.sysId = SYS_ID;
				form.token 	= this.userToken.token;
				form.selfId = this.userToken.userId;
				form.userId = this.userToken.userId;
				uni.request({
					url: process.env.UNI_BASE_URL + '/api/job/updateUserMore',
					header: { 'Content-Type': 'application/json' },
					method: 'POST',
					data: JSON.stringify(form),
					success() {
						uni.showToast({ title: `修改成功！` });
					},
					fail() {
						uni.showToast({ title: '更新失败，请稍后重试！', icon: 'none' });
					}
				});
			},
			
			getJobUserByUserId(){
				const _this = this;
				uni.request({
					url: process.env.UNI_BASE_URL + '/api/job/getUser',  // 用户数据
					data: {sysId: SYS_ID, userId: this.userToken.userId, selfId: this.userToken.userId, token: this.userToken.token},
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						// console.log('user_add.getUser 返回值' + JSON.stringify(result));
						if (result.statusCode == 200 && result.data.code == 0) {
							const respData = result.data.data;
							// console.log("user_add.getUser返回值2："+JSON.stringify(respData))
							if(respData) {
								// console.log("转化前："+respData.skills)
								this.baseFormData.jobUserDO = respData
								// console.log("转化后："+JSON.stringify(respData))
								if(respData.birth) this.baseFormData.jobUserDO.birth = respData.birth.substring(0, 7)
								this.tool = this.baseFormData.jobUserDO.tools?10:20;
								if(respData.dynamicFormData) {
									if(respData.dynamicFormData.content) this.dynamicFormData.content = respData.dynamicFormData.content
									if(respData.dynamicFormData.domains) this.dynamicFormData.domains = respData.dynamicFormData.domains
								}
							};
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
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
			    sourceType: ['album', 'camera'], 	  // 支持从相册和摄像头选择
			    success: async (res) => {
					const filePath = res.tempFilePaths; // 获取选择的图片路径
					// 在这里可以对图片进行进一步处理，如上传、预览等
					for(let filePath of filePaths){
						// 上传图片
						const imgUrl = await uploadUtils.uploadImg(
						  res.tempFilePaths[0],
						  this.uploadToken,
						  'job/userInfo/image/',
						  this.userToken.userId
						);
					}
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
				    filePath: tempFilePaths[0], // 选择的第一张图片路径
				    name: 'file',
				    success: (res) => {
				        // console.log('上传成功：', res);
				    },
				    fail: (err) => {
				        console.log('上传失败：', err);
				    }
				});
			},
			
			async getToken(){
				this.uploadToken = await uploadUtils.getUploadToken(this.userToken.userId);
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
			handleSwitchChange(e){
				const index = e.switchObj ;
				const enabled = e.data?0:1 ;
				this.dynamicFormData.domains[index].enabled = enabled ;
				// console.log("this.dynamicFormData.domains[index].enabled: " + this.dynamicFormData.domains[index].enabled)
			},
		
			onFontSizeChange(scale) {
				// this.fontSizeScale = e.detail.value;
				this.fontSizeScale = scale;
				const scaleValue = this.fontSizeScale / 100;
				this.fontScale = scaleValue
				// console.log("字体大小设置为：" + this.fontSizeScale)
				
				// console.log("实时计算比例："+ this.fontScale)
				
				/* #ifdef MP-WEIXIN */
				this.fontSet = 'font-size :' + 37.5*scaleValue + 'rpx;'
				// console.log("WEIXIN 实时计算样式："+ this.fontSet)
				/* #endif */
				
				/* #ifndef MP-WEIXIN */
				this.fontSet = 'font-size :' + 1*scaleValue + 'rem;'
				// console.log("APP/H5 实时计算样式："+ this.fontSet)
				/* #endif */
				var _this = this
				// 字体大小存入缓存记忆
				uni.setStorage({key:JOB_USER_FONT_SET, data: _this.fontSizeScale});
			},
			handleTitleStyle(baseFontSize=16) {
				var fontSize = baseFontSize * (this.fontSizeScale / 100);
				return 'padding: 0; color: #000000; fontSize: '+fontSize+'px; font-size: '+fontSize+'px;';
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
	// ::v-deep .uni-input-placeholder, .uni-textarea-placeholder, .uni-textarea-wrapper ,
	::v-deep 
	.selectDate, 
	.checklist-text, 
	.uni-forms-item__label, 
	.uni-easyinput__placeholder-class, 
	.uni-textarea-wrapper,
	.uni-easyinput__content-input,
	.uni-easyinput__content-textarea {
		font-size: 20px !important;
	}
	
	uni-text{
		/* #ifdef MP-WEIXIN */
		font-size: 45rpx !important;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		font-size: 1.2rem !important;
		/* #endif */
	}
	
	::v-deep .checkbox__inner, .radio__inner{
		width: 24px !important;
		height: 24px !important;
		transform: scale(1.2); /* 调整选项框大小 */
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
	    // font-size: 30rpx;
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
	
	
	.move-icon {
	  width: 64rpx;
	  height: 64rpx;
	  margin-bottom: 10rpx;
	  border-radius: 32rpx;
	  margin-right: 24rpx;
	  display: flex;
	  align-items: center;
	  justify-content: center;
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
	
	
/* 背景色 */
.bg-red { background: #ff4d4f; }
.bg-blue { background: #1890ff; }
.bg-green { background: #52c41a; }
.bg-green2 { background: #45b97c; }
.bg-purple { background: #722ed1; }
.bg-orange { background: #fa8c16; }
.bg-cyan { background: #13c2c2; }
.bg-pink { background: #eb2f96; }
.bg-gray { background: #666666; }

</style>
