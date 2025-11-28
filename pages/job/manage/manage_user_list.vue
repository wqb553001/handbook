<template>
	<view class="uni-container">
		<view class="slider-container" style="z-index: 9999;">
			<u-slider v-model="fontSizeScale"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9"
			 min="50" max="200" step="10" block-size="20" @changing="onFontSizeChange" @change="onFontSizeChange" show-value></u-slider>
		</view>
		<view style="display: flex; margin: 0 10rpx;">
			<view class="left" >
				<!-- <text class="service-name">每页条数:</text> -->
				<uni-data-select style="argin-left: 10rpx;" v-model="pageSize" :localdata="workerPageSizes" @change="workerPageSizeChange"></uni-data-select>
			</view>
			<view class="right">
				<!-- <text class="service-name">状态筛选:</text> -->
				<uni-data-select multiple style="" v-model="workerLevel" :localdata="workerStatus" @change="workerStatusChange"></uni-data-select>
			</view>
			
		</view>
<!-- 		<view style="display: flex;">
			<view class="left">
				<text class="service-name" style="padding-top: 10rpx; margin: 0 10rpx;">每页条数:</text>
				<uni-data-select style="margin-left: 10rpx; width: 150rpx !important; flex: none !important; " v-model="pageSize" :localdata="workerPageSizes" @change="workerPageSizeChange"></uni-data-select>
			</view>
			<view class="right">
				<text class="service-name">状态筛选:</text>
				<uni-data-select multiple style="" v-model="workerLevel" :localdata="workerStatus" @change="workerStatusChange"></uni-data-select>
			</view>
		</view> -->
		<!-- 操作按钮 -->
		<view class="operation-buttons">
			<!-- <button @tap="clearSelection" class="uni-button" size="mini" type="default" style="background-color: yellow;">清空选择</button> -->
			<button @tap="getSelectedData" class="uni-button" size="mini" type="primary">批量升级</button>
			<button @tap="getSelectedData" class="uni-button" size="mini" type="warn">批量降级</button>
		</view>
		<view v-if="listData.length != 0" class="">
			<kingTable
				v-if="!isTwoHead"
				 ref="kingTable"
				:tableData="listData"
				:tableHeadL="tableHeadL"
				:tableHeadR="tableHeadR"
				:tableHeadLKey="tableHeadLKey"
				:tableHeadRKey="tableHeadRKey"
				:tableHeadLWidth="tableHeadLWidth"
				:tableHeadRWidth="tableHeadRWidth"
				:longPressColumns="longPressColumns"
				:exclusiveGroups="exclusiveGroups"
				:fontSizeScale="fontScale"
				:showCheckbox="true"
				:checkboxColumnWidth="70"
				:levelSettingOptions="permissionOptions"
				@getCellVal="getCellVal"
				@longpress="handleLongPress"
				@selection-change="handleSelectionChange"
				@permission-change="handlePermissionChange"
				@level-change-confirm="levelConfirm"
			></kingTable>
			<kingTwoHead
				v-if="isTwoHead"
				:tableData="listData"
				:tableHeadL="tableHeadL"
				:tableHeadR="tableHeadR"
				:tableHeadLKey="tableHeadLKey"
				:tableHeadRKey="tableHeadRKey"
				@getCellVal="getCellVal"
			></kingTwoHead>
			
		</view>
		<view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="currentPage" :total="total" @change="nextPage" /></view>
		<!-- <uni-section title="展示" type="line" style="background-color: #eee;">
				
		<uni-group title="用户列表:" style="background-color: #FCDAD5;">
			<uni-table border stripe emptyText="暂无更多数据" class="fixed-table">
				<uni-tr>
					<uni-th	width="160">		序号		</uni-th>
					<uni-th	width="180">		姓名		</uni-th>
					<uni-th	width="130">		位置		</uni-th>
					<uni-th	width="180">		技能		</uni-th>
					<uni-th	width="130">		更新时间	</uni-th>
					<uni-th	width="180">		评分		</uni-th>
					<uni-th	width="180">		操作		</uni-th>
				</uni-tr>
				<uni-tr v-for="(worker, index) in listData" :key="index+1" >
					<uni-td style="padding: 0px 4px;">{{ index + 1    			}}</uni-td>
					<uni-td style="padding: 0px 4px;">{{ worker.username 		}}</uni-td>
					<uni-td style="padding: 0px 4px;">{{ worker.province+worker.city+worker.district		}}</uni-td>
					<uni-td style="padding: 0px 4px;">
						{{ stringShowLenMap(worker.allSkills, 20, false) || ' ' }}
					</uni-td>
					<uni-td style="padding: 0px 4px; "><span style="white-space: nowrap;">{{ worker.updateTime 			}}</span></uni-td>
					<uni-td style="padding: 0px 4px;">{{ worker.multiScore 			}}</uni-td>
					<uni-td style="padding: 0px 4px;">
						<view class="uni-group">
							<button @tap="editOne(worker, index, 1)" class="uni-button" size="mini" type="primary">改</button>
							<button @tap="delOne(worker, 'inStorageUpRuleDataList', 'tableUpRuleData', 1)" class="uni-button" size="mini" type="warn">删</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</uni-group>
		</uni-section> -->
	</view>
</template>

<script >
	
	// 单个表头
	import kingTable from '@/components/kingTable/kingTable.vue';
	// 两个表头
	import kingTwoHead from '@/components/kingTwoHead/kingTwoHead.vue';
	
	const SYS_ID = 2025040301;
	const JOB_TOKEN = 'JOB_TOKEN';
	const JOB_USER_FONT_SET = "job_User_List_Font_Set";
	const JOB_OPT_HISTORY_RECORD = "JOB_OPT_HISTORY_RECORD";
	const JOB_OPT_HISTORY_RECORD_LEN = 50;
	const keyStr = "jobInfoMap";
	const MAP_PICKER_POSITION = "map_Picker_Position"
	const PAGE_LIMIT = 20
	
	const scaleAddressMap 		= {50:21, 60:17, 70:14, 80:12, 	90:11, 	100: 9,  110:8,  120:7,  130:6,  140:6,  150:5,	 160:5,  170:4,  180:4,  190:4, 200:3}
	const scaleTitleMap 		= {50:25, 60:23, 70:20, 80:17, 	90:15, 	100: 12, 110:11, 120:10, 130:9,  140:8,  150:8,	 160:8,  170:7,  180:7,  190:6, 200:6}
	const scaleIntroductionMap 	= {50:80, 60:68, 70:56,	80:46,	90:40,	100: 38, 110:34, 120:30, 130:28, 140:24, 150:23, 160:22, 170:19, 180:13, 190:9, 200:9}
	const scaleToolsMap 		= {50:50, 60:43, 70:36,	80:30,	90:27,	100: 23, 110:20, 120:19, 130:18, 140:16, 150:14, 160:12, 170:10, 180:10, 190:9, 200:9}
	const workerInitPageSizes	= [{text: "10",value: 10},{text: "20",value: 20},{text: "50",value: 50},{text: "100",value: 100},{text: "200",value: 200},{text: "500",value: 500},{text: "1000",value: 1000}]

	export default {
		components: {
			kingTable
		},
		data() {
			return {
				userId:0,
				userToken: {},
				// 字体缩放
				fontSet: 'font-size: 37.5rpx;',
				fontScale: 1.0,
				fontSizeScale: 100, // 默认100%比例
				baseFontSize: 16,   // 基础字体大小（根据设计稿调整）
				
				// 分页
				listData: [],
				total: 0,		// 总记录数
				pages: 0,		// 总页数
				currentPage: 1,	// 当前页码
				pageSize: 20,
				reload: false,	// 上拉加载更多-false; 下拉刷新-true
				status: 'more', // 加载状态  more：上拉加载更多；loading：加载中；nomore：没有更多
				isFirstLoad: true,// 首次加载
				loading: false,
				searchValue:"",
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				
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
					level:0,
					moreLevel:0
				}
				,duration :	2000
				,type :	'center'
				,msgType :	'msgType'
				,messageText :	''
				,input:''					// 验证码
				,storeUserIdMap: new Map
				
				,fontColor: {
					up: 	"color: red; ",
					down: 	"color: green; "
				},
			
				// 是否两个表头
				isTwoHead: Boolean,
				// 主表数据（后端返回来）
				tableData: [],
				// 左侧表头
				tableHeadL: ['序号', '姓名'],
				// 自定义左侧表头对应的字段（长度一定要跟表头的长度想对应）
				tableHeadLKey: ['index', 'username'],
				tableHeadLWidth: [100, 150],
				
				// 右侧表头
				tableHeadR: ['更新时间', '地区', '技能',  '评分', '权限', '操作'],
				// 自定义右侧表头对应的字段（长度一定要跟表头的长度想对应）
				tableHeadRKey: ['updateTime', 'address', 'allSkills', 'multiScore', 'level', 'opt'],
				tableHeadRWidth: [260, 360, 360, 100, 200, 150],
				// 设置支持长按弹框的列索引（右侧表格的列索引，从0开始）
				longPressColumns: [1, 2, 4], // 地区 和 技能 列支持长按弹框
				// 假设互斥分组为 [1,2,4,8] 和 [16,32]（根据你的需求调整）
				exclusiveGroups: [[2, 4], [16, 32], [64, 128, 256, 512]],
				workerStatus: [
					{text: "限制",value: -10,},{text: "初始",value: 0,},{text: "开放板块",value: 10,},{text: "开放手机号",value: 20},
				],
				workerLevel: [1],
				includeLevel: 0,
				workerPageSizes: workerInitPageSizes,
				// 多选
				multiple: true,
				currentSelectedData: [], // 存储选中的行数据
				permissionOptions: [
					{text: '升级',style: {backgroundColor: '#4CD964'},value: -2},
					{text: '降级',style: {backgroundColor: '#DD524D'},value: -3},
					{text: '重置',style: {backgroundColor: '#007AFF'},value: 0}
				],
			};
		}
		,mounted(){
			const _this = this
			uni.getStorage({
				key: JOB_TOKEN,
				success: async function(resp){
					_this.userToken = resp.data
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
				},
				fail:function(){
					// const res = uni.getSystemInfoSync();
					// _this.userToken.userId = res.deviceId
					// uni.setStorage({ key:JOB_TOKEN, data: _this.userToken });
				},
				complete() {
					_this.getList();			// 获取，内容列表数据
					_this.getLevelEnum();	// 读取位置信息
					_this.isTwoHead = false;
				}
			});
		}
		,onReady() {},
		methods: {
			getLevelEnum(){
				const _this = this;
				uni.request({
					url: process.env.UNI_BASE_URL + '/api/job/getLevelEnum',  // 用户数据
					data: {sysId: SYS_ID, userId: this.userToken.userId, selfId: this.userToken.userId, token: this.userToken.token},
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						// console.log('manage_user_list.getLevelEnum 返回值' + JSON.stringify(result));
						if (result.statusCode == 200 && result.data.code == 0) {
							const respData = result.data.data;
							// console.log("manage_user_list.getLevelEnum 返回Data："+JSON.stringify(respData))
							if(respData) {
								// 数据示例 [{"text": "他人不可见", "value": -2,"style": {"backgroundColor": '#007aff'}}, {"desc": "所有人(包括自己)不可见", "text": "所有人不可见", "value": -3,"style": {"backgroundColor": '#007aff'}}, {"text": "初始状态", "value": 0,"style": {"backgroundColor": '#007aff'}}, {"text": "管理员", "value": 2,"style": {"backgroundColor": '#007aff'}}, {"text": "开通板块信息", "value": 3,"style": {"backgroundColor": '#007aff'}}, {"text": "开通虚拟电话", "value": 5,"style": {"backgroundColor": '#007aff'}}]
								_this.workerStatus = JSON.parse(respData.settingsJson);
								_this.options2 = JSON.parse(respData.settingsJson);
								_this.permissionOptions = JSON.parse(respData.settingsJson);
								// console.log("转化后 _this.customizeSelecteds ：" + JSON.stringify(_this.customizeSelecteds))
							}
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
			},
			/**
			 * 增强版权限解析函数
			 * @param {number} level - 权限等级值
			 * @param {Array} settingsJson - 权限配置数组
			 * @param {Object} options - 配置选项
			 * @returns {string|Array} 解析结果
			 */
			parseLevel(level, settingsJson, options = {}) {
			    const {
			        returnType = 'string', // 'string' | 'array'
			        separator = ', ',
			        showDesc = false,
			        sortByValue = true
			    } = options;
			    
			    if (!level || level === 0 || !settingsJson || !Array.isArray(settingsJson)) {
			        return returnType === 'string' ? '' : [];
			    }
			    
			    // 如果需要按值排序
			    let permissionsList = settingsJson;
			    if (sortByValue) {
			        permissionsList = [...settingsJson].sort((a, b) => a.value - b.value);
			    }
			    
			    const permissions = [];
			    
			    permissionsList.forEach(item => {
			        if ((level & item.value) === item.value) {
			            if (showDesc && item.desc) {
			                permissions.push(`${item.text}(${item.desc})`);
			            } else {
			                permissions.push(item.text);
			            }
			        }
			    });
			    
			    return returnType === 'string' ? permissions.join(separator) : permissions;
			},
			// 处理权限变更
			handlePermissionChange(event) {
				console.log('权限变更事件:', event);
				const { action, data, index } = event;
				
				switch(action) {
					case -2:
						this.handleUpgrade(event);
						break;
					case -3:
						this.handleDowngrade(event);
						break;
					case 0:
						this.handleDowngrade(event);
						break;
					default:
						console.log('未知权限操作:', action);
				}
			},
			// 处理升级操作
			handleUpgrade(event) {
				console.log('升级操作:', event);
				const user = event.data;
				uni.showModal({
					title: '确认升级',
					content: `确定要升级用户 "${user.username}" 吗？`,
					success: (res) => {
						if (res.confirm) {
							// 执行升级操作
							this.updateUserLevel(user.userId, 'upgrade');
						}
					}
				});
			},
			// 处理降级操作
			handleDowngrade(event) {
				console.log('降级操作:', event);
				const user = event.data;
				uni.showModal({
					title: '确认降级',
					content: `确定要降级用户 "${user.username}" 吗？`,
					success: (res) => {
						if (res.confirm) {
							// 执行降级操作
							this.updateUserLevel(user.userId, 'downgrade');
						}
					}
				});
			},
			// 更新用户权限等级
			updateUserLevel(userId, action) {
				console.log(`执行${action}操作，用户ID: ${userId}`);
				// 这里添加实际的API调用逻辑
				uni.showToast({
					title: `${action === 'upgrade' ? '升级' : '降级'}操作已执行`,
					icon: 'success'
				});
				
				// 刷新数据
				setTimeout(() => {
					this.getList();
				}, 1000);
			},
			// 清空选择
			clearSelection() {
				console.log("manage_user_list.clearSelection() 清空选择")
				this.$refs.kingTable.clearSelection();
			},
				
			// 获取选中数据
			getSelectedData() {
				console.log("manage_user_list.getSelectedData() 获取选中数据")
				const selectedData = this.$refs.kingTable.getSelectedData();
				console.log('选中的数据:', selectedData);
				uni.showModal({
					title: '选中数据',
					content: `已选择 ${selectedData.length} 条数据`,
					showCancel: false
				});
			},
			// 处理选择变化
			handleSelectionChange(event) {
				console.log("manage_user_list.handleSelectionChange() 处理选择变化")
				this.currentSelectedData = event.selectedData;
				console.log('选择发生变化:', event);
			},
			// 计算页码集
			adjustPageSizes(total) {
			  // 找到最接近且大于 total 的最小值
			  const closestValue = workerInitPageSizes.find(size => size.value > total);
			
			  if (closestValue) {
			    // 返回小于或等于 closestValue 的所有选项
			    this.workerPageSizes = workerInitPageSizes.filter(size => size.value <= closestValue.value);
				return;
			  } else {
			    // 如果没有找到大于 total 的值，返回全部选项
			    this.workerPageSizes = workerInitPageSizes;
				return;
			  }
			},
			workerPageSizeChange(e) {
				console.log('workerPageSizeChange value changed:', e);
				this.listData = [];
				this.pageSize = e;
				this.getList();
				// console.log('Selected value changed:', e.detail.value);
				
			},
			workerStatusChange(arr) {
				console.log('workerStatusChange value changed:', arr);
				// console.log('Selected value changed:', e.detail.value);
				// this.workerLevel = e;
				if (arr.length === 0) {
				    console.log("数组为空");
				    this.includeLevel = 0;
				  } else {
				    let sum = 0;
				    for (let i = 0; i < arr.length; i++) {
				      sum += arr[i];
				    }
				    console.log("数组元素累加和为:", sum);
				    this.includeLevel = sum;
				  }
				this.getList();
			},
			// 获取，内容列表数据
			getList() {
				this.loading = true
				// if(this.status == 'nomore') return;
				let data = {sysId: SYS_ID, selfId: this.userToken.userId, token: this.userToken.token, local: this.location, isFirstLoad: false, deviceId: this.userToken.deviceId}
				if(this.searchValue){
					data.likeAllSkills =  "%"+this.searchValue+"%"
				}
				if(this.includeLevel&&this.includeLevel>0){
					data.includeLevel = this.includeLevel
				}
				data.isFirstLoad = false
				data.limit = this.pageSize;
				data.distance = 2000	// 默认，方圆1500公里内工作机会
				if (this.offset>0) {
					// 说明已有数据，目前处于上拉加载
					this.status = 'loading';
					data.offset = this.offset;				// 有序取数，下一批数据的指针
					data.time = new Date().getTime() + '';	// 添加请求时间戳，作用：防止 重复取数
				}
				
				// console.log('Base URL:', this.apiBaseUrl)
				// console.log('manage_user_list.userStream 请求参数：' + JSON.stringify(data))
				// console.log('step0--------');
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/userStream',  // 数据源的数据是 有序的   `${this.apiBaseUrl}/api/job/getBanner`
					// url: `${this.apiBaseUrl}`,
					data: JSON.stringify(data),
					method: 'POST',
					success: result => {
						this.loading = false
						// console.log('user_list.userStream 返回值：' + JSON.stringify(result));
						// console.log('step1--------');
						if (result.statusCode == 200 && result.data.code == 0) {
						// console.log('step2--------');
							const respData = result.data.data.rows;
							let list = this.dataHandle(respData);
							this.listData = list;
							if(list.length<1){
								// console.log('step3--------');
								this.total = 0;
								this.pages = 0;
								this.reload = false;
								this.status = 'nomore';	// 没有更多
								return;
							}
							this.isFirstLoad = false;		// 已加载过
							// console.log('step4--------');
							// this.listData = this.reload ? list : this.listData.concat(list);
							this.total = result.data.data.total
							// 计算页码集
							this.adjustPageSizes(this.total);
							this.pages = Math.ceil(this.total / this.pageSize);
							if(this.currentPage>this.pages) {
								// console.log('step5--------');
								this.status = 'nomore';	// 没有更多
								return;
							};
							// console.log('step6--------');
							this.reload = false;
							this.status = 'more';		// 上拉加载更多
							// this.nextPage();
							// console.log('【show Data】:' + JSON.stringify(this.listData));
							// console.log('【respond Data】:' + JSON.stringify(respData));
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					},
					complete: (result) =>{
						// console.log('result' + JSON.stringify(result));
						if (this.reload) { // 如果是刷新操作
							this.$emit('stop-pull-down');
						}
					}
				});
			},
			dataHandle(items) {
				var newItems = [];
				var _this = this
				let uIndex = null;
				items.forEach((e, index) => {
					let allSkills = e.skillsName;
					// if(e.skills) allSkills = JSON.parse(e.skills)
					//  .filter(obj =>!(Object.keys(obj).includes('-1')))
					//  .map(obj => Object.values(obj))
					//  .join(',');
					// console.log("allSkills:"+allSkills+";e.otherSkills:"+e.otherSkills)
					allSkills = (!allSkills)?e.otherSkills:(e.otherSkills!="")?(allSkills +'；'+ e.otherSkills):allSkills;
					if(e.address) e.address = e.address.replace(e.district, '').replace(e.city, '');
					// console.log("allSkills:"+allSkills)
					// e.allSkills 	= _this.truncateString(allSkills, 20);
					e.allSkills		= allSkills;
					e.address = e.province+e.city+e.district+e.address
					e.age 			= _this.calculateAge(e.birth);
					e.levelValue = e.level
					e.level = _this.parseLevel(e.level, _this.workerStatus)
					e.index = index + 1
					e.opt = ''
					// e.tools 		= _this.truncateString(e.tools, 20);
					// e.introduction 	= _this.truncateString(e.introduction, 45);
					// e.isStore 		= this.storeUserIdMap.get(e.userId)?true:false
					e.multiScore 	= e.multiScore || 0;
					return e;
				});
				// if(uIndex) {
				// 	console.log("移除元素", uIndex);
				// 	items.splice(uIndex, 1); // 移除索引为 1 的元素
				// }else{
				// 	console.log("无需移除元素");
				// }
				return items;
			},
			onFontSizeChange(scale) {
				// this.fontSizeScale = e.detail.value;
				this.fontSizeScale = scale;
				const scaleValue = this.fontSizeScale / 100;
				this.fontScale = scaleValue
				// console.log("字体大小设置为：" + this.fontSizeScale)
				// this.addressShowLen(scale)
				// console.log("实时计算比例："+ this.fontScale)
				
				/* #ifdef MP-WEIXIN */
				this.fontSet = 'font-size :' + 37.5*scaleValue + 'rpx;'
				// console.log("WEIXIN 实时计算样式："+ this.fontSet)
				/* #endif */
				
				/* #ifndef MP-WEIXIN */
				this.fontSet = 'font-size :' + 1*scaleValue + 'rem;'
				// console.log("APP/H5 实时计算样式："+ this.fontSet)
				/* #endif */
				// var _this = this
				// 字体大小存入缓存记忆
				uni.setStorage({key:JOB_USER_FONT_SET, data: this.fontSizeScale});
			},
			addressShowLen(scale){
				// console.log("初始倍数："+ scale)
				// if(scale>140) scale = 150 + Math.trunc((scale - 150)/20)*10
				// console.log("换算后倍数："+ scale)
				// var addressLen = 10 + (10 - scale/100 * 10)
				// console.log("地址显示字数"+ addressLen)
				var addressLen = scaleAddressMap[scale]
				// console.log("地址显示字数"+ addressLen)
				var str = this.location.address;
				if (typeof str == 'string') {
					str = str.length > addressLen ? '…' + str.slice(-addressLen-1) : str
				}
				this.location.text = str;
			},
			calculateAge(birth){
			  if(!birth) return;
			  const bIndex = birth.indexOf(' 00:00:00');
			  if(bIndex>0){birth = birth.substring(0, bIndex)}
			  // 将出生日期字符串转换为Date对象
			  const birthDateObj = new Date(birth);			  
			  // 获取当前日期
			  const today = new Date();			  
			  // 计算年龄
			  let age = today.getFullYear() - birthDateObj.getFullYear();			  
			  // 判断是否已过当年生日
			  const monthDiff = today.getMonth() - birthDateObj.getMonth();
			  const dayDiff = today.getDate() - birthDateObj.getDate();
			  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
			    age--;
			  }			  
			  return age;
			},
			
			truncateString(str, len = 45, defaultValue = ' ') {
				if (!str || str.length == 0) {
					return defaultValue;
				}
				
				str = String(str).trim();
				if (str.length > len) {
					return str.slice(0, len) + '…';
				}
				return str;
			  
			},
			
			setTime: function(items) {
				var newItems = [];
				items.forEach(e => {
					newItems.push({
						author_name: 	e.author_name,
						cover: 			e.cover,
						id: 			e.id,
						post_id: 		e.post_id,
						published_at: 	dateUtils.format(e.published_at),
						title: 			e.title
					});
				});
				return newItems;
			},
			stringShowLenMap(showString, mapNum, isHead=true){
				// console.log("输入值："+ showString)
				var len = mapNum==10?scaleIntroductionMap[this.fontSizeScale]:scaleToolsMap[this.fontSizeScale]
				// console.log("地址显示字数："+ len)
				if(showString?.length < len+1) return showString;
				if (typeof showString == 'string') {
					showString = isHead ? '…' + showString.slice(-len-1) : showString.slice(0, len)+'…'
				}
				// console.log("输出值："+ showString)
				return showString;
			},
			nextPage(e){
				this.currentPage = e.current;
				this.tableData = []
				console.log("下一页e:"+JSON.stringify(e))
				this.offset = (e?(e.current - 1):0) * PAGE_LIMIT;
				console.log("nextPage(e): this.offset = " + this.offset)
				this.getList();			// 获取，内容列表数据
			},
			handleLongPress(event) {
			  console.log('长按事件，回调:', event);
			  // 可以在这里处理长按事件的额外逻辑
			},
			levelConfirm(e){
				console.log("点击了确认修改，传递值："+JSON.stringify(e))
				this.updateJobUserLevel(e)
			},
			updateJobUserLevel(form){
				form.sysId		= SYS_ID;
				form.token 		= this.userToken.token;
				form.selfId 	= this.userToken.userId;
				// form.userId 	= this.userToken.userId;
				// console.log("提交前参数：", JSON.stringify(form))
				const _this = this
				uni.request({
					url: process.env.UNI_BASE_URL + '/api/job/updateJobUserLevel',
					header: { 'Content-Type': 'application/json' },
					method: 'POST',
					data: JSON.stringify(form),
					success() {
						// uni.showToast({ title: `授权已变更！` });
						_this.getList();
					},
					fail() {
						// uni.showToast({ title: '授权失败，请稍后重试！', icon: 'none' });
					}
				});
			},
		},
	}
</script>

<style lang="scss">
	.operation-buttons {
		display: flex;
		justify-content: flex-start;
		margin: 10rpx 0;
		padding: 0 20rpx;
	}
	
	.operation-buttons .uni-button {
		margin-right: 20rpx;
	}
	
	
	.left {
	  width: 150rpx;
	  align-items: center;
		
	  .service-icon {
	    width: 64rpx;
	    height: 64rpx;
	    border-radius: 32rpx;
	    margin-right: 24rpx;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	  }
		
	  .service-name {
	    font-size: 28rpx;
	    color: #333;
	  }
	}
		
	.right {
	  flex-grow: 1;
	  align-items: center;
		
	  .desc {
	    font-size: 24rpx;
	    color: #999;
	    margin-right: 16rpx;
	  }
	}
	
	.uni-select__selector{
		z-index: 13 !important;
	}
	
	// .page-size-select{
	// 	.uni-stat__select {
	// 		width: 150rpx !important;
	// 		flex: none !important;
	// 	}
	// }
</style>
