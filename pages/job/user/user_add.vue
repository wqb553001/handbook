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
					<uni-forms-item label="用户名" required>
						<uni-easyinput v-model="baseFormData.jobUserDO.username" placeholder="多个用逗号分隔" />
					</uni-forms-item>
					<uni-forms-item label="角色" required>
						<uni-data-checkbox v-model="baseFormData.jobUserDO.rule" :localdata="rules" />
					</uni-forms-item>
					
					<uni-forms-item label="性别" required>
						<uni-data-checkbox v-model="baseFormData.jobUserDO.sex" :localdata="sexs" />
					</uni-forms-item>
					<!-- `${process.env.UNI_BASE_URL}/api/job/getToolSource` -->
					<uni-forms-item label="职业">
						<search-dropdown ref="careerDropdown" 
							@options-update="onOptionsUpdate"
						    :api="'/api/job/career/list'"
							:apiParam="careerApiParam"
							:auto-load="careerAutoLoad"
							:page-size="10"
							v-model="selectedCareerId"
						    placeholder="关键字匹配职业"
						    noMoreData="不满意，请调整匹配关键字"
							@change="onCareerChange"
						  />
					</uni-forms-item>
					
					<view v-for="(skill, index) in skillArray" :key="index">
						<uni-forms-item :label="skill.name">
							<view class="checkbox-group">
								<view v-for="(item, itemIndex) in objAttriteToArray(skill)" :key="itemIndex" 
									 :class="['checkbox-item', {selected: isSelected(index, item.value)}]"
									 @click="toggleSkill(index, item.value)">
									<label :for="'skill-'+index+'-'+itemIndex">{{ item.text }}</label>
								</view>
							</view>
							
							<view v-if="isSelected(index, -1)" class="other-input">
								<input 
									type="text" 
									v-model="otherSkillsInput[index]"
									@input="updateOtherSkills(index, $event.target.value)"
									:placeholder="'请输入' + skill.name + '的其他内容'"
								>
							</view>
							<input style="display: none;" v-model="baseFormData.jobUserDO.skillsName" />
						</uni-forms-item>
					</view>
					
					
<!-- 					<uni-forms-item label="技能">
						<uni-data-checkbox v-model="parsedSkills" multiple :localdata="skillsOptions" :map="{ value: 'value', text: 'text' }" />
						<input style="display: none;" v-model="baseFormData.jobUserDO.skillsName" />
						<uni-easyinput v-if="baseFormData.jobUserDO.skills?.includes(-1)" v-model="baseFormData.jobUserDO.otherSkills" placeholder="多个用逗号分隔" />
					</uni-forms-item> -->
					
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
						<uni-easyinput v-model="baseFormData.jobUserDO.tools" placeholder="自带，多个用逗号分隔" />
					</uni-forms-item>
					<uni-forms-item label="自我简介">
						<search-dropdown
							:fromOptions="introductionOptions"
							v-model="selectedIntroduction"
							placeholder="可直接编辑"
							@change="onIntroductionChange"
						  />
					</uni-forms-item>
					<view style="margin: -22px auto !important;">
						<uni-forms-item label="自我详述" > <!-- detailOptions -->
							<search-dropdown
								disabled="false"
								:fromOptions="introductionOptions"
								v-model="baseFormData.jobUserDO.detail"
								placeholder="只选，下方编辑"
								@change="onDetailChange"
							  />
						</uni-forms-item>
					</view>
					
					<uni-easyinput type="textarea" maxlength="500" rows="8" class="detail-textarea" v-model="baseFormData.jobUserDO.detail" placeholder="详细的自我介绍" />

					
					<uni-card v-if="baseFormData.jobUserDO.level>0" style="text-align: center; display: block; background-color: #45b97c; ">
						<view class="text" style="display: flex; align-items: center;">
							<view class="text uni-flex" style="width: 110rpx; height: 100%;">
								<view >提交后：</view>
							</view>
							<view class="uni-row" style="flex: 1;">
								<view class="uni-flex uni-column" style="min-height: 80rpx;  line-height:70rpx;" >
									<view class="text" style="-webkit-flex: 1;flex: 1;">
										<text>↑ 以上，会</text><text style="color: #ed1941; font-weight: bold;">立即生效</text>；
									</view>
									<view class="text" style="-webkit-flex: 1;flex: 1;">
										<u-line></u-line>
									</view>
									<view class="text" style="-webkit-flex: 1;flex: 1;">
										<text>↓ 以下，会生成新的</text><text style="color: green; font-weight: bold;">待启用版本</text>。
									</view>
								</view>
						
							</view>
						</view>
						
					</uni-card>
					
					<!-- 数据预览 -->
					<!-- <view class="data-preview" v-if="skillArray.length > 0">
						<view class="data-title">当前数据状态：</view>
						<pre>{{ JSON.stringify(baseFormData, null, 2) }}</pre>
					</view>
					<view class="action-buttons">
						<button class="btn btn-primary" @click="saveData"><i class="fas fa-save"></i>保存数据</button>
						<button class="btn btn-secondary" @click="resetForm"><i class="fas fa-redo"></i>重置表单</button>
					</view> -->
								
					<uni-section v-if="baseFormData.jobUserDO.level>0" title="扩展信息" type="line">
						<view class="example">
							<!-- 动态表单校验 -->
							<uni-forms ref="dynamicForm" :rules="dynamicRules" :model="baseFormData.moreReturnDOList" labelWidth="80px">
								<!-- <uni-card> -->
								<uni-card v-for="(item, index) in baseFormData.moreReturnDOList" :key="item.id"
									:label="item.label+' '+index" required :rules="item.rules" :name="['domains', index, 'value']">
									<!-- <view class="form-item"> -->
									<view style="display: flex; justify-content:space-between; ">
										<uni-badge class="uni-badge-left-margin" size="normal" :text="'板块'+index" type="primary" :customStyle="{ backgroundColor: '#45b97c', color: '#fff' }" />
										<view style="display: flex; flex-direction: column; align-items: center;">
											<view>关闭/开启</view>
											<uniListItem :titleStyle="handleTitleStyle(18)" :border="false" :show-switch="true"
												@switchChange="handleSwitchChange" :switchObj="index" :switchChecked="item.enabled==0?true:false" />
										</view>
										
										<view style="display: flex;">
											<view class="move-icon bg-green2" > <uni-icons type="arrow-up" 	 size="20"	@click="moveUpDownItem(index, 0)" color="#fff"></uni-icons> </view>
											<view class="move-icon bg-green2" > <uni-icons type="arrow-down" size="20"	@click="moveUpDownItem(index, 1)" color="#fff"></uni-icons> </view>
										</view>
									</view>
									
									<uni-easyinput v-model="item.title" placeholder="请输入标题" />
									<view style="margin-top: 10px !important; margin-bottom: 10px !important; ">
										<uni-easyinput type="textarea" v-model="item.summary" placeholder="请输入内容" />
									</view>
									
									
									<!-- 图片上传 -->
									<uni-forms-item label="上传图片">
										<uni-file-picker
											v-model="item.images"
											limit="20"  
											:image-styles="imageStyles"
											mode="grid"
											:sourceType="['camera','album']"
											:del-icon="true"
											:auto-upload="false"
											file-mediatype="image"
											@select="handleSelectUpload($event, item)"
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
									<uni-easyinput type="textarea" v-model="baseFormData.content" placeholder="请输入html" />
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
	
	import graceChecker from "@/common/js/graceChecker.js";
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import SearchDropdown from '@/components/search-dropdown/search-dropdown.vue';
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
	const CAREER_MAP = new Map();
	export default {
		components: { uniListItem, SearchDropdown },
		data() {
			return {
				uploadToken: '',
				userToken:{userId:null},
				// 基础表单数据
				baseFormData: {
					isChanged: true,
					content:'',
					jobUserDO:{
						sysId: SYS_ID,
						userId: 0,
						username: '',
						mobile: '',
						rule:0,
						sex: 2,
						birth: '1970-01',
						address: '',				// 位置：地址
						latitude: '1',				// 位置：纬度-坐标
						longitude: '1',				// 位置：经度-坐标
						careerId:null,
						province:'',				// 省份
						city:'',					// 市
						district:'',				// 区
						skills: '',					// 技能
						skillsName: '',				// 技能
						otherSkills:'',				// 其他技能
						introduction: '',			// 简介
						detail: '',					// 详情
						selectedCity:'',
						moreLevel:0
					},
					moreReturnDOList:[]
					
					// dynamicFormData: {
					// 	content: '',
					// 	domains: [{id:0, label: '介绍', title:'', summary:'', content:'', images:[] }]
					// },
				},
				// 基础表单数据
				baseFormDataOld: {
					content:'',
					jobUserDO:{
						sysId: SYS_ID,
						userId: 0,
						username: '',
						mobile: '',
						rule:0,
						sex: 2,
						birth: '1970-01',
						address: '',				// 位置：地址
						latitude: '1',				// 位置：纬度-坐标
						longitude: '1',				// 位置：经度-坐标
						careerId:null,
						province:'',				// 省份
						city:'',					// 市
						district:'',				// 区
						skills: '',					// 技能
						skillsName: '',				// 技能
						otherSkills:'',				// 其他技能
						introduction: '',			// 简介
						detail: '',					// 详情
						selectedCity:'',
					},
					moreReturnDOList:[]
					
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
				toolStyle: 'display: none;',
				hasTools: false,			// 是否带工具
				
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
				searchApi: '',
				cityList: [
					{ value: 'bj', label: '北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京北京' },
					{ value: 'sh', label: '上海' },
					{ value: 'gz', label: '广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州广州' },
					{ value: 'sz', label: '深圳' },
					{ value: 'cd', label: '成都成都成都成都成都成都成都成都成都成都成都成都成都成都成都成都成都成都成都成都成都成都成都' },
					{ value: 'wh', label: '武汉' },
					{ value: 'hz', label: '杭州' },
					
					// { value: 1, label: '北京' },
					// { value: 2, label: '上海' },
					// { value: 3, label: '广州' },
					// { value: 4, label: '深圳' },
					// { value: 5, label: '成都' },
					// { value: 6, label: '武汉' },
					// { value: 7, label: '杭州' },
				],
				selectedCareerId: null, // 用于v-model绑定的职业ID（回显的值）
				selectedCareerName: '', // 用于显示的职业名称（回显的标签）
				skillArray: [],
				selectedSkills: {},
				otherSkillsInput: {},
				dataLoaded: false,
				selectedCity: '',
				selectedValue: '',
				selectedCareer: {},
				selectedIntroduction:'',
				introductions:[],
				introductionOptions:[],
				selectedDetail:'',
				detailOptions:[],
				otherSkillNames:[],
				careerAutoLoad: false,	// 职业组件，初始关闭自动加载
				userCareerId:null,		// 保存记录中的 职业id
				careerApiParam:null,	// 职业的附加请求参数
				isFirstLoad: true,
			}
		},
		watch:{
			selectedSkills: {
				handler() {
					// 当selectedSkills变化时，确保所有技能选择项都是数组
					for (const index in this.selectedSkills) {
						if (this.selectedSkills.hasOwnProperty(index) && !Array.isArray(this.selectedSkills[index])) {
							this.$set(this.selectedSkills, index, []);
						}
					}
				},
				deep: true
			},
			otherSkillsInput: {
				handler(newVal) {
					// 检查对象是否为空
					if (newVal && Object.keys(newVal).length > 0) {
						this.baseFormData.jobUserDO.otherSkills = JSON.stringify(newVal);
					} else {
						this.baseFormData.jobUserDO.otherSkills = null;
					}
				},
				deep: true
			},
			
			selectedCareerId(newVal) {
				console.log('selectedCareerId变更:', newVal);
				
				// 根据careerId查找对应的职业对象
				if (newVal && this.careers.length > 0) {
					this.selectedCareer = this.careers.find(option => option.id === newVal) || null;
				} else {
					this.selectedCareer = null;
				}
			}
		},
		computed: {
			fullAddress(){
				if(this.baseFormData.jobUserDO.address && this.baseFormData.jobUserDO.address.includes(this.baseFormData.jobUserDO.district)) return this.baseFormData.jobUserDO.address;
				return this.baseFormData.jobUserDO.district + this.baseFormData.jobUserDO.address;
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
				success: async function(resp){
					_this.userToken = resp.data
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
					_this.baseFormData.jobUserDO.userId = _this.userToken.userId;
					await _this.getJobUserByUserId();
					// 数据获取完成后，设置自动加载为true
					_this.careerAutoLoad = true;
				
					// 确保子组件已经渲染，然后手动调用加载
					_this.$nextTick(() => {
						if (_this.$refs.careerDropdown) {
							_this.$refs.careerDropdown.loadData();
						}
					});
					
					// console.log("获取用户数据："+ JSON.stringify(_this.baseFormData))
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
			onOptionsUpdate(options) {
				this.careers = options;
				if(!this.isFirstLoad)return;
				// // 组件挂载后，设置需要回显的值
				const savedCareerId = this.baseFormData.jobUserDO.careerId
				
				// this.selectedCareerName = career.career;
				if (savedCareerId) {
					// 调用子组件的方法设置选中项
					this.$refs.careerDropdown.setSelected(savedCareerId);
				}
				
				this.selectedCareerId = savedCareerId;
				// 初始化表单数据（数据回显）
				this.initFormData();
				this.careerApiParam = {}
				this.isFirstLoad = false;
				console.log("已完成职业列表的加载----------")
				// console.log("执行了onOptionsUpdate().执行后，this.careers："+JSON.stringify(this.careers))
			},
			// 初始化表单数据（数据回显）
			initFormData() {
				try {
					// 解析保存的技能数据
					// console.log("初始数据："+JSON.stringify(this.baseFormData))
					// debugger
					const skillsObj = JSON.parse(this.baseFormData.jobUserDO.skills);
					const careerId = this.baseFormData.jobUserDO.careerId;
					// 根据careerId找到对应的职业
					// this.careers = this.$refs.careerDropdown.getOptions();
					// console.log("职业列表："+JSON.stringify(this.careers))
					const career = this.careers?.find(c => c.id === careerId);
					this.selectedCareerId = careerId
					if (career) {
						this.selectedCareer = career;
						this.selectedCareerName = career.name;
						this.skillArray = JSON.parse(career.skills);
						
						// 优化实现：直接将整个对象赋值，然后移除careerId属性
						this.selectedSkills = {...skillsObj};
						// delete this.selectedSkills.careerId;
						// 回显其他技能输入
						if (this.baseFormData.jobUserDO.otherSkills) {
							const otherSkillsObj = JSON.parse(this.baseFormData.jobUserDO.otherSkills);
							this.otherSkillsInput = {...otherSkillsObj};
						}
						
						if(this.selectedSkills)		CAREER_MAP.set(careerId+'selectedSkills', this.selectedSkills)
						if(this.otherSkillsInput)	CAREER_MAP.set(careerId+'otherSkillsInput', this.otherSkillsInput)
						
						this.dataLoaded = true;
						setTimeout(() => {
							this.dataLoaded = false;
						}, 3000);
					}
				} catch (e) {
					console.error("初始化表单数据时出错:", e);
				}
			},
			onCareerChange(career) {
				try {
					if(career.id == this.selectedCareerId) return;
					this.selectedCareerId = career.id;
					// console.log("选中项："+JSON.stringify(career))
					this.selectedCareerName = career.name;
					if (career) {
						this.skillArray = JSON.parse(career.skills);
						// 初始化选中技能和输入框
						this.selectedSkills = {};
						this.otherSkillsInput = {};
						if(CAREER_MAP.has(this.selectedCareerId+'selectedSkills'))	{
							this.selectedSkills = CAREER_MAP.get(this.selectedCareerId+'selectedSkills');
							this.baseFormData.jobUserDO.skills = JSON.stringify(this.selectedSkills);
						}
						if(CAREER_MAP.has(this.selectedCareerId+'otherSkillsInput')){
							this.otherSkillsInput = CAREER_MAP.get(this.selectedCareerId+'otherSkillsInput');
						}
						this.updateSkillsName();
						// CAREER_MAP.set(careerId+'selectedSkills', this.selectedSkills) 
						// CAREER_MAP.set(careerId+'otherSkillsInput',  this.otherSkillsInput)
						
						// 更新技能数据结构，包含careerId
						// const skillsObj = {};
						// skillsObj.careerId = career.id;
						// this.baseFormData.jobUserDO.otherSkills = "{}";
						// this.baseFormData.jobUserDO.skillsName = "";
						this.baseFormData.jobUserDO.careerId = career.id;
						
						const introductionObj = JSON.parse(career.introduction)
						const introductions = introductionObj?.enum
						if(introductions?.length>0){
							this.introductionOptions = introductions.map((item, index) => ({
							    name: item,
							    id: index
							}));
							// console.log("选项值："+JSON.stringify(this.introductionOptions))
						}
						
					} else {
						this.skillArray = [];
					}
				} catch (e) {
					console.error("解析职业数据时出错:", e);
				}
			},
			onIntroductionChange(item) {
				this.baseFormData.jobUserDO.introduction = item.name;
			},
			onDetailChange(item) {
				this.baseFormData.jobUserDO.detail = item.name;
			},
			// 检查是否选中了某个技能
			isSelected(skillIndex, value) {
				return this.selectedSkills[skillIndex] && this.selectedSkills[skillIndex].includes(value);
			},
			// 切换技能选择状态
			toggleSkill(skillIndex, value) {
				// 确保selectedSkills[skillIndex]是数组
				if (!Array.isArray(this.selectedSkills[skillIndex])) {
					this.$set(this.selectedSkills, skillIndex, []);
				}
				
				const index = this.selectedSkills[skillIndex].indexOf(value);
				if (index === -1) {
					// 如果未选中，则添加
					this.selectedSkills[skillIndex].push(value);
				} else {
					
					// 如果已选中，则移除
					if(this.selectedSkills[skillIndex].length===1){
						// 移除整个属性
						delete this.selectedSkills[skillIndex];
					}else{
						// 移除索引值
						this.selectedSkills[skillIndex].splice(index, 1);
					}
					
					// 如果移除了"其他"选项，清除对应的输入
					if (value === -1) {
						console.log("移除其他："+skillIndex)
						// this.$set(this.otherSkillsInput, skillIndex, '');  // 旧（不可用）：这句只是置空，而非移除
						delete this.otherSkillsInput[skillIndex];
						this.updateOtherSkills(skillIndex, '');
					}
				}
				
				// 更新技能选择
				this.updateSkills();
			},
			// 更新技能数据
			updateSkills() {
				try {
					CAREER_MAP.set(this.selectedCareerId+'selectedSkills',	this.selectedSkills)
					// 创建新的技能对象，包含careerId
					const skillsObj = {...this.selectedSkills};
					
					// 确保不包含careerId属性
					if (skillsObj.hasOwnProperty('careerId')) {
						delete skillsObj.careerId;
					}
					
					this.baseFormData.jobUserDO.skills = Object.keys(skillsObj).length>0 ? JSON.stringify(skillsObj) : null;
					
					// 更新技能名称
					this.updateSkillsName();
				} catch (e) {
					console.error("更新技能选择时出错:", e);
				}
			},
			updateOtherSkills(index, value) {
				try {
					CAREER_MAP.set(this.selectedCareerId+'otherSkillsInput', this.otherSkillsInput)
					const otherSkillsObj = {...this.otherSkillsInput};
					
					if (value) {
						otherSkillsObj[index] = value;
					} else {
						// console.log("清除选项:"+index)
						delete otherSkillsObj[index];
					}
					this.baseFormData.jobUserDO.otherSkills = Object.keys(otherSkillsObj).length > 0 ? JSON.stringify(otherSkillsObj) : null;
					console.log("updateOtherSkills("+index+", "+value+"): " + this.baseFormData.jobUserDO.otherSkills)
				} catch (e) {
					console.error("更新其他技能时出错:", e);
				}
			},
			updateSkillsName() {
				try {
					const skillsObj = this.baseFormData.jobUserDO.skills?JSON.parse(this.baseFormData.jobUserDO.skills):{};
					let allSkills = [];
					
					for (const index in skillsObj) {
						if (index === 'careerId') continue;
						
						const skillIndex = parseInt(index);
						const values = skillsObj[index];
						
						// 确保values是数组
						if (!Array.isArray(values)) {
							console.warn(`技能索引 ${index} 的值不是数组:`, values);
							continue;
						}
						
						values.forEach(v => {
							if (v !== -1) {
								if (this.skillArray[skillIndex] && this.skillArray[skillIndex].enum[v]) {
									allSkills.push(this.skillArray[skillIndex].enum[v]);
								}
							}
						});
					}
					
					this.baseFormData.jobUserDO.skillsName = allSkills.length>0 ? allSkills.join(',') : null;
				} catch (e) {
					console.error("更新技能名称时出错:", e);
				}
			},
			// 重置表单
			resetForm() {
				this.selectedCareer = '';
				// this.skillArray = [];
				this.selectedSkills = {};
				this.otherSkillsInput = {};
				this.baseFormData.jobUserDO.skills = '';
				this.baseFormData.jobUserDO.otherSkills = '';
				this.baseFormData.jobUserDO.skillsName = '';
			},
			objAttriteToArray(skill){
                try {
					const array = skill.enum.map((item, index) => ({ text: item, value: index }));
					array.push({ text: '其他', value: -1 });
					return array;
				} catch (e) {
					console.error("处理技能数据时出错:", e);
					return [];
				}
			},
			judgeOtherByIndex(index){
				console.log("judgeOtherByIndex 根据index:"+this.baseFormData.jobUserDO.skills)
				const parsedMap = JSON.parse(this.baseFormData.jobUserDO.skills);
				if(parsedMap.hasOwnProperty(index)) return true;
				
			},
			getOtherByIndex(index){
				console.log("根据index:"+index+";获取 ‘其他’")
				const parsedMap = JSON.parse(this.baseFormData.jobUserDO.otherSkills);
				console.log("根据index:"+index+";获取 ‘其他s’"+JSON.stringify(parsedMap))
				if(parsedMap.hasOwnProperty(index)) {
					console.log("根据index:"+index+";获取 ‘其他’："+parsedMap[index])
					return parsedMap[index];
				}
			},
			moveUpDownItem(index, upDown){
				console.log(upDown==0?"上移":"下移");
				// 顶元素，上移无效
				if(upDown==0 && index==0) return;
				// 底元素，下移无效
				if(upDown==1 && index==this.baseFormData.moreReturnDOList.length-1) return;
				// 上移
				if(upDown==0){
					let temp = this.baseFormData.moreReturnDOList[index];
					this.$set(this.baseFormData.moreReturnDOList, index, this.baseFormData.moreReturnDOList[index - 1]);
					this.$set(this.baseFormData.moreReturnDOList, index - 1, temp);
				}
				// 下移
				if(upDown==1){
					let temp = this.baseFormData.moreReturnDOList[index];
					this.$set(this.baseFormData.moreReturnDOList, index, this.baseFormData.moreReturnDOList[index + 1]);
					this.$set(this.baseFormData.moreReturnDOList, index + 1, temp);
				}
				
			},
			
			addDynamicItem() {
				if(this.baseFormData.moreReturnDOList.length>20){
					uni.showToast({ title: '板块最多支持20个，请优化！', icon: 'none' });
					return;
				}
				this.baseFormData.moreReturnDOList.push({
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
				let index = this.baseFormData.moreReturnDOList.findIndex(v => v.id === id)
				this.baseFormData.moreReturnDOList.splice(index, 1)
			},
		
			// 处理文件选择事件
			async handleSelectUpload(e, item) {
				// console.log("选择文件事件:", e);
				// 合并新旧文件（保留完整文件对象）
				// console.log("e.tempFiles:", e.tempFiles)
				// console.log("item.images:", item.images)
				
				// this.$forceUpdate(); // 强制更新视图
				// return;
				
				const MAX_SIZE = 5 * 1024 * 1024; // 5MB限制
				
				// 获取当前所有文件（包括新选择的）
				let allFiles = [...e.tempFiles];
				// console.log("allFiles.before:", allFiles)
				// 逐个检查并移除过大文件
				for (let i = allFiles.length - 1; i >= 0; i--) {
					const file = allFiles[i];
					let fileSize = 0;
					
					try {
						// 先尝试从file对象中获取size
						if (file.size && typeof file.size === 'number') {
							fileSize = file.size;
						} else {
							// 如果没有size属性，则通过API获取
							const fileInfo = await uni.getFileInfo({ filePath: file.path || file.tempFilePath });
							fileSize = fileInfo.size;
						}
						
						// 检查文件是否超过大小限制
						if (fileSize > MAX_SIZE) {
							// 提示用户
							uni.showToast({
								// title: `文件 ${file.name || '未命名'} 超过5MB限制`,
								title: `自动移除，超过5MB限制的文件： ${file.name || '未命名'}`,
								icon: 'none',
								duration: 5000
							});
							
							// 从文件列表中移除
							allFiles.splice(i, 1);
						}
					} catch (error) {
						console.error('文件大小检查失败:', error);
						// 移除出错的文件
						allFiles.splice(i, 1);
					}
				}
				// 更新文件列表（已移除所有过大文件）
				// item.images = allFiles;
				
				item.images = [...item.images, ...allFiles];
				// console.log("allFiles.after:", item.images)
				this.$forceUpdate(); // 强制更新视图
			},
			
			async submit() {
				const uploadToken = this.uploadToken
				const userToken = this.userToken
				// console.log("处理前："+JSON.stringify(this.baseFormData));
				if(this.baseFormData.jobUserDO.careerId){
					baseRules.push({ name: "careerId", checkType: "notnull", errorMsg: "职业必选" });
				}
				if(this.baseFormData.jobUserDO.hasTools == 10){
					baseRules.push({ name: "tools", checkType: "notnull", errorMsg: "工具/设备 不能为空" });
				}
				// if(this.hasOtherSkill){
				// 	baseRules.push({ name: "otherSkills", checkType: "notnull", errorMsg: "选中【其他】后面输入框，不能为空" });
				// }
				if (!graceChecker.check(this.baseFormData.jobUserDO, baseRules)) {
					uni.showToast({ title: graceChecker.error, icon: 'none' });
					return;
				}
				
				let skillsObj 	= JSON.parse(this.baseFormData.jobUserDO.skills);
				let otherSkillsObj= JSON.parse(this.baseFormData.jobUserDO.otherSkills);
				for (const index in skillsObj) {
					const skillIndex = parseInt(index);
					const values = skillsObj[index];
					if(values.includes(-1) && (!otherSkillsObj||!otherSkillsObj[skillIndex])) {
						if(values.length === 1){
							delete skillsObj[index];
						}else{
							skillsObj[index] = values.filter(value => value !== -1);
						}
					}
				}
				this.baseFormData.jobUserDO.skills = JSON.stringify(skillsObj);
				this.baseFormData.jobUserDO.otherSkills = JSON.stringify(otherSkillsObj);
				
				if(this.baseFormData.moreReturnDOList && this.baseFormData.moreReturnDOList?.length>0){
					for(let num = this.baseFormData.moreReturnDOList.length-1; num>=0; num--){
						let domain = this.baseFormData.moreReturnDOList[num];
						
						// 无数据板块，自动移除
						if(!domain || domain.images==0 && !domain.title && !domain.summary && !domain.content){
							this.baseFormData.moreReturnDOList.splice(num, 1);
							continue;
						}
						
						// 无图片，不必上传
						if(domain.images.length==0) continue;
						for(let i = 0; i<domain.images.length; i++){
							let file = domain.images[i]
							const path = file.url || file.path || file
							domain.images[i] = path;
							if(path.includes("//cdn.xny.world")) continue; 
							// debugger
							const imgPath = await uploadUtils.uploadImg(path, uploadToken, 'job/userInfo/', userToken.userId);
							// console.log("upload after path:"+imgPath)
							if(imgPath){
								domain.images[i] = imgPath;
							}
						}
					}
					// console.log("更新后板块信息："+JSON.stringify(this.dynamicFormData.images))
				}
				// return;
				this.judgeChange();
				// console.log("页面数据新："+JSON.stringify(this.baseFormData))
				// console.log("页面数据旧："+JSON.stringify(this.baseFormDataOld))
				// return
				this.updateUser(this.baseFormData);
				if(!this.baseFormData.jobUserDO?.headImgPath){
					// console.log("保存成功，userId:", userId)
					const url = `/pages/job/head_img/head_img?userId=${this.baseFormData.jobUserDO.userId}&afterUrl=/pages/job/index`;
					uni.navigateTo({ url });
				}
				
				// 清除缓存 
				uni.removeStorage({key: JOB_USER_SKILLS});
				uni.navigateBack()
			},
			judgeChange(){
				this.baseFormData.isChanged = true;
				if(this.baseFormData.jobUserDO.level<1){
					this.baseFormData.isChanged = false;
					return
				}
				if(this.isEqualList(this.baseFormData.moreReturnDOList, this.baseFormDataOld.moreReturnDOList) 
				&& (this.baseFormData.content == this.baseFormDataOld.content)) this.baseFormData.isChanged = false;
			},
			isDeepEqual(x, y) {
			    if (x === y) {
			        return true;
			    } else if (typeof x === 'object' && x !== null && typeof y === 'object' && y !== null) {
			        const keysX = Object.keys(x);
			        const keysY = Object.keys(y);
			        if (keysX.length !== keysY.length) {
			            return false;
			        }
			        for (const key of keysX) {
			            if (!this.isDeepEqual(x[key], y[key])) {
			                return false;
			            }
			        }
			        return true;
			    } else {
			        return false;
			    }
			},
			isEqualList(oldList, newList) {
			    if (oldList.length !== newList.length) return false;
				let flag = false;
			    for (let i = 0; i < oldList.length; i++) {
			        if (!this.isDeepEqual(oldList[i], newList[i])) {
						return false
					};
			    }
			    return true;
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
							// console.log("this.skillsOptions："+JSON.stringify(this.skillsOptions))
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
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
				// console.log("输入 技能集合:", JSON.stringify(e))
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
						// console.log("初始从缓存中取值，技能：" + _this.skillsOptions)
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
				// console.log("提交数据："+JSON.stringify(form)) // '/api/job/updateUserMore'
				uni.request({
					url: process.env.UNI_BASE_URL + '/api/job/userMoreAddLevel',
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
			
			async getJobUserByUserId(){
				// return new Promise((resolve, reject) => {
				const _this = this;
				console.log("this.userToken.userId：" + this.userToken.userId)
				const params = {sysId: SYS_ID, userId: this.userToken.userId, 
								selfId: this.userToken.userId, token: this.userToken.token}
				if(this.baseFormData?.jobUserDO?.moreLevel) params.level = this.baseFormData.jobUserDO.moreLevel;
				return new Promise((resolve, reject) => {
						uni.request({
						url: process.env.UNI_BASE_URL + '/api/job/getUserDetail',  // 用户数据 getUserDetail  getUser
						data: params,
						method: 'POST',
						header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
						success: async (result) => {
							console.log('user_add.getUserDetail 返回值' + JSON.stringify(result));
							if (result.statusCode == 200 && result.data.code == 0) {
								const respData = result.data.data;
								// console.log("user_add.getUserDetail返回值2："+JSON.stringify(respData))
								if(respData) {
									_this.baseFormData = respData;
									// 存2份，提交时，比对是否对 后续部分进行了修改。
									_this.baseFormDataOld = {...respData};
									if(respData.moreReturnDOList){
										_this.baseFormData.moreReturnDOList = _this.transformImagesToObjectArray(respData.moreReturnDOList)
									}
									const userCareerId = _this.baseFormData.jobUserDO?.careerId
									if(userCareerId){
										_this.careerApiParam = {id: userCareerId}
									}
								};
							}
							resolve();
						},
						fail: (result, code) => {
							console.log('fail' + JSON.stringify(result));
							// reject(error);
							reject(result);
						}
					});
				});
			},
			// 对象数组内images字符串数组 转 对象数组
			transformImagesToObjectArray(data) {
			  return data.map(item => ({
				  ...item,
				  images: item?.images?.map(url => ({ url }))
				}));
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
			  console.log("选择图片")
			  uni.chooseImage({
			    count: 1, // 默认9，这里我们只选一张图
			    sizeType: ['original', 'compressed'], // 可选择原图或压缩图
			    sourceType: ['album', 'camera'], 	  // 支持从相册和摄像头选择
			    success: async (res) => {
					const filePaths = res.tempFilePaths; // 获取选择的图片路径
					console.log("循环上传图片")
					// 在这里可以对图片进行进一步处理，如上传、预览等
					
					for (let i = filePaths.length - 1; i >= 0; i--) {
					// for(let filePath of filePaths){
						const filePath = filePaths[i];
						try {
							
							// 上传图片
							const imgUrl = await uploadUtils.uploadImg(
							  filePath,
							  this.uploadToken,
							  'job/userInfo/image/',
							  this.userToken.userId
							);
							if(!imgUrl){
								// 上传失败：从文件列表中移除
								filePaths.splice(i, 1);
							}
						} catch (error) {
						  console.error('文件处理失败:', error);
						  filePaths.splice(i, 1); // 移除出错的文件
						}
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
			
			async getToken(){
				console.log("async getToken().this.userToken.userId："+this.userToken.userId)
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
				this.baseFormData.moreReturnDOList[index].enabled = enabled ;
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
	
	
	.skill-name i {
		margin-right: 8px;
		color: #007aff;
	}
	.checkbox-group {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 10px;
	}
	.checkbox-item {
		display: flex;
		align-items: center;
		background: #f5f7fa;
		padding: 6px 12px;
		border-radius: 4px;
		transition: all 0.3s;
		cursor: pointer;
	}
	.checkbox-item:hover {
		background: #e6f7ff;
		transform: translateY(-2px);
	}
	.checkbox-item input {
		margin-right: 6px;
		cursor: pointer;
	}
	.checkbox-item.selected {
		background: #007aff;
		color: white;
	}
	.other-input {
		margin-top: 12px;
		padding: 12px;
		background: #f1f8ff;
		border-radius: 6px;
		border-left: 3px solid #007aff;
		transition: all 0.3s;
	}
	.other-input:hover {
		background: #e6f7ff;
	}
	.other-input input {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		font-size: 14px;
	}
	.data-preview {
		margin-top: 30px;
		padding: 20px;
		background: #e7f3ff;
		border-radius: 8px;
	}
	.data-title {
		font-weight: bold;
		margin-bottom: 12px;
		color: #007aff;
		display: flex;
		align-items: center;
	}
	.data-title::before {
		content: "📊";
		margin-right: 8px;
	}
	pre {
		background: #fff;
		padding: 15px;
		border-radius: 6px;
		overflow: auto;
		font-size: 14px;
		max-height: 300px;
		border: 1px solid #cce5ff;
	}
	.instructions {
		background: #fff8e6;
		padding: 15px;
		border-radius: 6px;
		margin-bottom: 20px;
		border-left: 4px solid #ffc53d;
	}
	.instructions h3 {
		margin-bottom: 10px;
		color: #ffa940;
		display: flex;
		align-items: center;
	}
	.instructions h3 i {
		margin-right: 8px;
	}
	.instructions ul {
		padding-left: 20px;
	}
	.instructions li {
		margin-bottom: 8px;
	}
	.highlight {
		background: #fff566;
		padding: 2px 5px;
		border-radius: 3px;
	}
	.action-buttons {
		display: flex;
		gap: 12px;
		margin-top: 20px;
	}
	.btn {
		padding: 10px 18px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		display: flex;
		align-items: center;
		transition: all 0.3s;
	}
	.btn i {
		margin-right: 6px;
	}
	.btn-primary {
		background: #007aff;
		color: white;
	}
	.btn-primary:hover {
		background: #0056cc;
	}
	.btn-secondary {
		background: #6c757d;
		color: white;
	}
	.btn-secondary:hover {
		background: #545b62;
	}
	.status-indicator {
		padding: 8px 12px;
		background: #28a745;
		color: white;
		border-radius: 4px;
		font-size: 14px;
		display: inline-flex;
		align-items: center;
		margin-top: 10px;
	}
	.status-indicator i {
		margin-right: 6px;
	}
	@media (max-width: 768px) {
		.skills-container {
			grid-template-columns: 1fr;
		}
		.action-buttons {
			flex-direction: column;
		}
	}
	
	// ::v-deep .detail-textarea{
		::v-deep .uni-easyinput__content-textarea {
			height: 180px !important;
		}
	// }

	
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
