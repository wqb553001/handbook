<template>
	<view class="container">
	<!-- <uni-card :is-shadow="false" is-full style="text-align: center; display: block;z-index: 9999; ">
			<text class="uni-h6" >无所事事，难获持久尊重；劳逸结合，过好健康人生</text>
		</uni-card> -->
		
		<!-- #ifndef H5 -->
		<uni-notice-bar v-if="banners[0]?.noticeShow || banners[0].noticeShow===true" :fontSize="13*fontScale" :speed="20" 
			class="fixed-notice" show-get-more show-icon scrollable 
			:text="banners[0].noticeText" @getmore="getMore" @longpress="getMore"  />
		<!-- #endif -->
		<l-navbar title="找用工" leftColor="#ffffff" titleColor="#ffffff" iconColor="#ffffff" :search="true"
			:showLeft="false" :showMid="true" :debounce-delay="500" centerMargin="195px" leftWidth="300px" :border="false" 
			background="linear-gradient(180deg, #ff6043 51%, rgba(255, 96, 67, 0) 99%)" placeholderText="请输入关键词"
			@midClick="midClick" @change="handleSearchChange" style="z-index: 999;"
			:searchStyle="handleSearchStyle" :fontSize="scaledFontSize" 
			:leftText="location.text?location.text:'选择位置'" :leftTextFull="location.address?location.address:'选择位置'" 
			>
		</l-navbar>
		
		<!-- #ifdef H5 -->
		<uni-notice-bar v-if="banners[0]?.noticeShow || banners[0].noticeShow===true" :fontSize="13*fontScale" :speed="10" 
			style="position: absolute; margin-top: -70rpx; z-index: 99999;" show-get-more show-icon scrollable 
			:text="banners[0].noticeText" @getmore="getMore" @longpress="getMore" />
		<!-- #endif -->
		
		<view class="slider-container" style="z-index: 9999;">
			<u-slider v-model="fontSizeScale"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9"
			 min="50" max="200" step="10" block-size="20" @changing="onFontSizeChange" @change="onFontSizeChange" show-value></u-slider>
			<!-- <text style="text-align: center; display: block;">字体缩放比例：{{fontSizeScale}}%</text> -->
		</view>
		
		<banner-swiper :banners="banners" :font-set="fontSet" ></banner-swiper>
		
		<view class="uni-list">
			<view style="margin: -10px;" v-for="(worker, index) in listData" :key="index">
				<uni-card style="padding:0px" >
					<template v-slot:title>
						<uni-list v-if="worker.userId != userToken.userId"  style="border-bottom: none; border: none !important;">
							<uniListItem :titleStyle="handleTitleStyle(18)" :border="false" :show-switch="true" :title="stringShowLen(worker.allSkills, false)"
								@switchChange="handleSwitchChange" :switchObj="worker" :switchChecked="worker.isStore" />
						</uni-list>
					</template>
					<view class="uni-flex uni-row" style="border: none; border-top: none;">
						<view class="uni-row" style="width:100%" >
							<view class="text" style="display: flex; padding-top: 10rpx;">
								<view class="text uni-flex" style="width: 200rpx; height: 200rpx; padding-top: 10px;">
									<!-- <uni-badge class="uni-badge-left-margin" absolute="rightTop" :text="worker.multiScore" :offset="[4, 4]" size="normal" :customStyle="{background: headTipColor(worker.workStatus), color: '#fff' }" >
										
									</uni-badge> -->
									<image :src="worker.headImgPath" style="width: 150rpx; height: 150rpx;"></image>
								</view>
								<view class="uni-row" style="flex: 1; padding-top: 10rpx; ">
									<view class="uni-flex uni-column" @click="toDetail(worker)"
										style="min-height: 80rpx;  line-height:70rpx;" :style="fontSet">
										{{ stringShowLenMap(worker.introduction, 10, false) || ' ' }}
									</view>
							
								</view>
							</view>
							<view class="uni-flex uni-row" style="justify-content: space-between; padding-top: 10rpx;">
								<view class="text" style="min-width: 160rpx; line-height:70rpx;" :style="fontSet">
									{{ stringShowLenMap(worker.tools, 20, false) || ' ' }}
								</view>
								
								<view class="text" style="color: #2E8B57; min-width: 30%; font-weight: bold; flex-wrap: wrap; justify-content: space-between; line-height:70rpx; " @longpress="longPressCopyText(worker.address)">
									<text :style="handleFontSize(16)" style="flex: 1; text-align: left; word-break: break-all;"  >{{ worker.address || ' ' }}</text>
									<text :style="handleFontSize(10)" style="flex-shrink: 0; white-space: nowrap; text-align: right; margin-left: 5rpx; float: right; padding-right: 20rpx;">{{ ((worker.district)?worker.district:worker.city) || ' ' }}</text>
								</view>
							</view>
								
							<view class="uni-flex uni-row"  :style="fontSet" style="-webkit-justify-content: space-between; justify-content: space-between;  line-height:70rpx; display: flex;">
								<view class="text" style="color: #8c531b; font-weight: bold; " >{{ worker.username +(worker.sex==0?' 先生':worker.sex==1?' 女士':'') }}</view>
								<view v-if="worker.multiScore !== null && worker.multiScore !== undefined" style="display: block;">
									<uni-rate :readonly="true" :max="5" :value="worker.multiScore>5?5:worker.multiScore" 	:size="13*fontScale"  />
									<uni-rate :readonly="true" :max="5" :value="worker.multiScore>5?worker.multiScore-5:0" 	:size="13*fontScale"  />
								</view>
								
								<view v-if="worker.userId != this.userToken?.userId" class="text" style="display: flex; font-weight: bold; color: #2E8B57;" @click="makePhoneCall(worker.userId)">立即联系
									<u-icon name="chat" :color="headTipColor(worker.workStatus)"  size="36rpx" />
								</view>
								<view v-else style="margin-right: 10rpx;"><uni-icons type="contact" size="34" color="#FFCC33"></uni-icons></view>
								
							</view>
						</view>
					</view>
				</uni-card>
			</view>
			
		</view>
			
		<!-- #ifdef APP-PLUS -->
		<view class="ad-view" v-if="(index > 0 && (index+1) % 10 == 0)">
			<ad :adpid="adpid" @error="aderror"></ad>
		</view>
		<!-- #endif -->
		<uni-fab ref="fab" :pattern="fab.pattern" :content="fab.content" 
			:horizontal="fab.horizontal" :vertical="fab.vertical"
			:direction="fab.direction" @trigger="trigger" @fabClick="fabClick" />
		<!--加载更多、向下-->
		<uni-load-more :status="status" :load-more-style="{'fontSize': scaledFontSize+'px'}" :icon-size="16" :content-text="contentText" />
	</view>
</template>

<script>
	import { dateUtils } from  '../../common/js/util.js';
	import { JobStoreManager } 	from '../../common/js/util/jobStoreManager.js';
	// import deviceInfoMixin 		from '../../common/js/util/deviceInfoMixin.js';
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import BannerSwiper from '@/components/banner-swiper/banner-swiper.vue';
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	
	const SYS_ID = 2025040301;
	const JOB_TOKEN = 'JOB_TOKEN';
	const JOB_USER_FONT_SET = "job_User_List_Font_Set";
	const JOB_OPT_HISTORY_RECORD = "JOB_OPT_HISTORY_RECORD";
	const JOB_OPT_HISTORY_RECORD_LEN = 50;
	const keyStr = "jobInfoMap";
	const MAP_PICKER_POSITION = "map_Picker_Position"
	const PAGE_LIMIT = 10
	const scaleAddressMap 		= {50:21, 60:17, 70:14, 80:12, 	90:11, 	100: 9,  110:8,  120:7,  130:6,  140:6,  150:5,	 160:5,  170:4,  180:4,  190:4, 200:3}
	const scaleTitleMap 		= {50:25, 60:23, 70:20, 80:17, 	90:15, 	100: 12, 110:11, 120:10, 130:9,  140:8,  150:8,	 160:8,  170:7,  180:7,  190:6, 200:6}
	const scaleIntroductionMap 	= {50:80, 60:68, 70:56,	80:46,	90:40,	100: 38, 110:34, 120:30, 130:28, 140:24, 150:23, 160:22, 170:19, 180:13, 190:9, 200:9}
	const scaleToolsMap 		= {50:50, 60:43, 70:36,	80:30,	90:27,	100: 23, 110:20, 120:19, 130:18, 140:16, 150:14, 160:12, 170:10, 180:10, 190:9, 200:9}
	
	export default {
		name: 'jobList',
		// mixins: [deviceInfoMixin],   // 将 deviceInfoMixin 加入 mixins 数组
	    components: { uniListItem, uniFab, BannerSwiper },
		props: {
			apiBaseUrl: {  // 新增API基础URL属性
				type: String,
				default: process.env.UNI_BASE_URL+'/api/job/userStream' 
			},
			showWhereBanner: {  // 新增API基础URL属性
				type: Number,
				default: 0
			}
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
				
				
				banners: [{
					mediumType: 2,
					url: '',
					titile: '',
					fontColor: '',
					noticeShow: false
				},{
					mediumType: 2,
					url: '',
					titile: '',
					fontColor: '',
					noticeShow: false
				}],
				banner: {
					mediumType: 2,
					url: '',
					titile: '',
					fontColor: '',
					noticeShow: false
				},
				
				// 分页
				listData: [],
				total: 0,		// 总记录数
				pages: 0,		// 总页数
				currentPage: 1,	// 当前页码
				reload: false,	// 上拉加载更多-false; 下拉刷新-true
				status: 'more', // 加载状态  more：上拉加载更多；loading：加载中；nomore：没有更多
				isFirstLoad: true,// 首次加载
				adpid: '',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				location:{
					text: "选择位置",  	// 显示地址
					address: "选择位置",	// 实际完整地址
					latitude: "",
					longitude: "",
					province: "",
					city: "贵阳市",
					district: "南明区"
				},
				searchValue:"",
				
				// 收藏
				historyRecord:[],
				storeUserIdMap: new Map,
				jobManager: null,
				
				// 浮动按钮
				fab:{
					title: 'uni-fab',
					directionStr: '垂直',
					horizontal: 'left',
					vertical: 'bottom',
					direction: 'horizontal',
					pattern: {
						color: '#7A7E83',
						backgroundColor: '#fff',
						selectedColor: '#007AFF',
						buttonColor: '#007AFF',
						iconColor: '#fff'
					},
					is_color_type: false,
				},
				deviceInfo:{},
				
				// 轮播图配置对象
				swiperConfig: {
					indicatorDots: true,    // 是否显示指示点
					autoplay: true,         // 是否自动播放
					interval: 6000,         // 自动播放间隔（毫秒）
					duration: 3000          // 滑动动画时长（毫秒）
				},
			};
		},
		onLoad() {
		},
		onUnload() {
			// 避免泄露，结束卸载监听
			uni.$off('acceptAddress');
		},
		// onPullDownRefresh() {
		// 	console.log("触发了 onPullDownRefresh()")
		// 	this.initData();
		// 	// this.getBanner();	// 获取，标题展示数据
		// 	this.getList();		// 获取，内容列表数据
		// 	uni.stopPullDownRefresh();
		// },
		// onReachBottom() {
		// 	console.log("触发 onReachBottom()")
		// 	this.getList();		// 获取，内容列表数据
		// },
		mounted(){
			// this.$forceUpdate();
			const _this = this
			uni.getStorage({
				key: JOB_TOKEN,
				success: async function(resp){
					_this.userToken = resp.data
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
					// if(!_this.userToken) uni.removeStorage({key: JOB_TOKEN});
					// await _this.fetchDeviceInfo();
					// _this.deviceInfo = await _this.fetchAllInfo();
				},
				fail:function(){
					// const res = uni.getSystemInfoSync();
					// _this.userToken.userId = res.deviceId
					// uni.setStorage({ key:JOB_TOKEN, data: _this.userToken });
					_this.writeTempUserId();
				},
				complete() {
					_this.getLocalFromStore();	// 读取位置信息
					_this.getStoreList();		// 我的收藏
					_this.getList();			// 获取，内容列表数据
					_this.getBanner();			// 获取，标题展示数据
				}
			});
			
			this.adpid = this.$adpid;
			
			// 监听全局事件（获取选择的地址）
			uni.$on('acceptAddress', (data) => {
				// console.log("返回地区1："+JSON.stringify(data));
				this.location = {
					text		: data.title,
					address 	: data.title,
					latitude 	: data.location.lat,	// 纬度
					longitude 	: data.location.lng,	// 经度
					province 	: data.province,
					city 		: data.city,
					district 	: data.district
				}
				this.reload = true;
				this.initGetFontSize();
				this.getList();		// 获取，内容列表数据
			});
			this.initGetFontSize(); // 页面重新加载-恢复
			// 读取历史记录
			this.readHistoryRecord();
		},
		methods: {
			handlePullDownRefresh() {
			  console.log("触发了 handlePullDownRefresh()")
			  this.initData();
			  this.getBanner();	// 获取，标题展示数据
			  this.getList();		// 获取，内容列表数据
			  // 注意：这里不能直接调用uni.stopPullDownRefresh()，因为组件中无法停止页面事件，需要父页面停止
			  // 所以，我们通过emit事件通知父页面停止
			  this.$emit('stop-pull-down');
			},
			headTipColor(workStatus){
				if(workStatus==0) return '#62ed0d';		// 开放接单中
				if(workStatus==10) return '#ed1941';	// 工作中 #ff6043  #ffe600
				if(workStatus==20) return '#D3D3D3';	// 休假中 #deab8a  #D3D3D3
			},
			readHistoryRecord() {
				this.historyRecord = [];
				// 获取用户信息
				const _this = this
				uni.getStorage({
					key: JOB_OPT_HISTORY_RECORD,
					success: function(resp){
						_this.historyRecord = resp.data
						// console.log("缓存取值："+ JSON.stringify(_this.historyRecord));
					},
					fail:function(){
					}
				});
			},
			// 读取缓存的位置信息
			getLocalFromStore(){
				const _this = this
				uni.getStorage({
				  key: MAP_PICKER_POSITION,
				  success: function(res) {
					const rLocal = res.data
				    // console.log('获取到的数据为：', rLocal);
					_this.location.latitude	= rLocal.position?.latitude;
					_this.location.longitude= rLocal.position?.longitude;
					_this.location.text		= rLocal.position?.text;
					_this.location.address	= rLocal.position?.address;
					_this.searchlist 		= rLocal.searchlist;
				    // 在这里对获取到的数据进行处理
				  },
				  fail: function(err) {
				    console.error('job-list.getLocalFromStore()获取位置数据失败：', err);
				    // 在这里处理获取数据失败的情况
				  }
				});
				// const map_Picker_Position = uni.getStorageSync(MAP_PICKER_POSITION);
				// if(map_Picker_Position){
				// 	this.location.latitude	= map_Picker_Position.position?.latitude;
				// 	this.location.longitude	= map_Picker_Position.position?.longitude;
				// 	this.location.text		= map_Picker_Position.position?.text;
				// 	this.location.text		= map_Picker_Position.position?.address;
				// 	this.searchlist = map_Picker_Position.searchlist;
				// }
			},
			
			handleSearchChange(searchValue){
				this.searchValue = searchValue
				// console.log("搜索框输入："+ searchValue)
				this.initData();
				this.getList();
			},
			initData(){
				this.listData	= [];
				this.total 		= 0;
				this.offset 	= 0;
				this.status 	= 'more';
				this.pages 		= 0;		// 总页数
				this.currentPage= 1;		// 当前页码
				this.reload		= true;		// 重新加载数据
			},
			nextPage(){
				this.offset = (this.currentPage - 1) * PAGE_LIMIT;
			},
			midClick(){
				// console.log("点击了 导航栏 L 左侧……")
				uni.navigateTo({
				  url: "/pages/job/map/map"
				});
			},
			rightClick(){
				console.log("点击了 导航栏 R 右侧……")
			},
			// 获取，标题展示数据
			getBanner() {
				let data = {sysId: SYS_ID, showWhere: this.showWhereBanner, selfId: this.userToken.userId, token: this.userToken.token, level: 0};
				if(this.userToken?.level) data.level = this.userToken.level;	// 存在就覆盖
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/getBanner',
					data: JSON.stringify(data),
					method: 'POST',
					success: data => {
						// console.log("getBanner() 返回值："+JSON.stringify(data))
						if (data.statusCode == 200 && data.data.code == 0) {
							this.banners = data.data.data;
						}
						// uni.stopPullDownRefresh();
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
					}
				});
			},
			
			// 获取，内容列表数据
			async getList() {
				if(this.status == 'nomore') return;
				let data = {sysId: SYS_ID, selfId: this.userToken.userId, token: this.userToken.token, local: this.location, isFirstLoad: false, deviceId: this.userToken.deviceId}
				if(this.searchValue){
					data.likeAllSkills =  "%"+this.searchValue+"%"
				}
				data.distance = 500	// 默认，方圆1500公里内工作机会
				if (this.offset>0) {
					// 说明已有数据，目前处于上拉加载
					this.status = 'loading';
					data.offset = this.offset;				// 有序取数，下一批数据的指针
					data.time = new Date().getTime() + '';	// 添加请求时间戳，作用：防止 重复取数
					data.limit = PAGE_LIMIT;
				}
				
				/**
				 * 【首次请求】
				 * 		记录设备信息
				 **/ 
				if(this.isFirstLoad){
					data = await this.fetchDeviceInfo(data);
					data.isFirstLoad = true
					var equipment = JSON.stringify(data);
					// console.log("设备信息："+equipment)
					// console.log("位置信息："+JSON.stringify(this.locationInfo))
					// 已在前面处理过，不再重复截取
					// data.equipment = equipment.length>255?equipment.substring(0, 255):equipment;
				}
				
				console.log('Base URL:', this.apiBaseUrl)
				// console.log('user_list.userStream 请求参数：' + JSON.stringify(data))
				// console.log('step0--------');
				uni.request({
					// url: process.env.UNI_BASE_URL+'/api/job/userStream',  // 数据源的数据是 有序的   `${this.apiBaseUrl}/api/job/getBanner`
					url: `${this.apiBaseUrl}`,
					data: JSON.stringify(data),
					method: 'POST',
					success: result => {
						// console.log('user_list.userStream 返回值：' + JSON.stringify(result));
						// console.log('step1--------');
						if (result.statusCode == 200 && result.data.code == 0) {
						// console.log('step2--------');
							const respData = result.data.data.rows;
							let list = this.dataHandle(respData);
							if(list.length<1){
								// console.log('step3--------');
								this.reload = false;
								this.status = 'nomore';	// 没有更多
								return;
							}
							this.isFirstLoad = false;		// 已加载过
							// console.log('step4--------');
							this.listData = this.reload ? list : this.listData.concat(list);
							this.currentPage += 1;
							this.total = result.data.data.total
							this.pages = Math.ceil(this.total / PAGE_LIMIT);
							if(this.currentPage>this.pages) {
								// console.log('step5--------');
								this.status = 'nomore';	// 没有更多
								return;
							};
							// console.log('step6--------');
							this.reload = false;
							this.status = 'more';		// 上拉加载更多
							this.nextPage();
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
			async fetchDeviceInfo(data) {
			  try {
			    const res = await uni.getSystemInfo();
				// const {deviceBrand, deviceModel, deviceId, osName, osVersion, appVersion, appVersionCode, appLanguage, hostLanguage}  = uni.getSystemInfoSync();
				// const res = uni.getSystemInfoSync();
			    // console.log('📱 设备完整信息:', res);
				const response = await uni.request({
				    url: 'https://ipapi.co/json/', // 替换为实际的接口地址
				    method: 'GET',
					success: (result) => {
						// console.log('返回值:' + JSON.stringify(result));
					},
					fail: (result, code) => {
						console.log('fail:  https://ipapi.co/json/; error:' + JSON.stringify(result));
					}
				});
			    // console.log('同步取得ip信息:', JSON.stringify(response));
				
			    this.deviceInfo = {
					system:			res.system,
					deviceId:		res.deviceId,
					deviceModel:	res.deviceModel,
					deviceBrand:	res.deviceBrand,
					osName:			res.osName,
					osVersion: 		res.osVersion,
					appVersion:		res.appVersion,
					appVersionCode:	res.appVersionCode,
					appLanguage:	res.appLanguage,
					hostLanguage:	res.hostLanguage
				}
				data.ip = response?.data?.ip;
				let equipment = JSON.stringify(this.deviceInfo);
				equipment.length>255?equipment = equipment.substring(0, 255):equipment;
				data.equipment = equipment;
				data.deviceId = res.deviceId;
				this.deviceInfo.ip = data.ip;
			    // console.log('📱 设备信息获取成功:', data);
			    return data;
			  } catch (err) {
			    console.error('❌ 设备信息获取失败:', err);
			    throw err;
			  }
			},
			
			// 生成并记录临时用户ID
			async writeTempUserId(){
				const _this = this
				const res = await uni.getSystemInfo();
				// const res = uni.getSystemInfoSync();
				uni.request({
					url: process.env.UNI_BASE_URL+ '/api/job/checkTempUserIsExist',
					header: { 'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
					method: 'POST',
					data: {sysId: SYS_ID, deviceId: res.deviceId},
					success: result => {
						// console.log('checkTempUserIsExist 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							const respData = result.data;
							console.log("index.checkTempUserIsExist 返回值："+JSON.stringify(respData))
							if(respData.code == 0) {
								_this.userToken.userId = respData.data
								_this.userToken.deviceId = res.deviceId
								uni.setStorage({ key:JOB_TOKEN, data: _this.userToken });
								return;
							}
						}else{
							
							uni.showToast({ title: '需要先登录！', icon: 'none', duration:3000 });
							setTimeout(() => {
								// 延迟跳转
							  uni.navigateTo({ url: `/pages/job/index` });
							}, 3000); // 1000毫秒等于1秒
							
							// const url = '/pages/job/index';
							// uni.navigateTo({ url });
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
						const url = '/pages/job/index';
						uni.navigateTo({ url });
					}
				});
			},
			
			goDetail(e) {
				console.log("点击了“表头”…… 工作可以是自由的！")
				// let detail = {
				// 	author_name: 	e.author_name,
				// 	cover: 			e.cover,
				// 	id: 			e.id,
				// 	post_id: 		e.post_id,
				// 	published_at: 	e.published_at,
				// 	title: 			e.title
				// };
				// uni.navigateTo({
				// 	url: '../list2detail-detail/list2detail-detail?detailDate=' + encodeURIComponent(JSON.stringify(detail))
				// });
			},
			dataHandle(items) {
				var newItems = [];
				var _this = this
				let uIndex = null;
				items.forEach((e, index) => {
					// if(e.userId == this.userToken?.userId) {
					// 	console.log("当前用户index:", index, ";userId:" + e.userId)
					// 	uIndex = index;
					// }
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
					e.age 			= _this.calculateAge(e.birth);
					// e.tools 		= _this.truncateString(e.tools, 20);
					// e.introduction 	= _this.truncateString(e.introduction, 45);
					e.isStore 		= this.storeUserIdMap.get(e.userId)?true:false
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
			aderror(e) {
				console.log("aderror: " + JSON.stringify(e.detail));
			},
			onFontSizeChange(scale) {
				// this.fontSizeScale = e.detail.value;
				this.fontSizeScale = scale;
				const scaleValue = this.fontSizeScale / 100;
				this.fontScale = scaleValue
				// console.log("字体大小设置为：" + this.fontSizeScale)
				this.addressShowLen(scale)
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
			// 打电话 => 发信息
			makePhoneCall: function (receiverId) {
				if(!this.userToken?.userId){
					uni.showToast({ title: '先登录，才能有效联系对方！', icon: 'none' });
					return;
				}
				
				uni.navigateTo({
					url:`/pages/job/online/message?senderId=${this.userToken.userId}&receiverId=${receiverId}`
				})
				return;
				
				uni.showModal({
					title: '提示',
					content: '不允许骚扰对方，本次通话会被记录，可能会录音，若被举报，会降低本人的信誉值，请正常开展！',
					confirmText: '同意',
					cancelText: '退出',
					success: (res) => {
						if (res.confirm) {
							let data = {sysId: SYS_ID, selfId: this.userToken.userId, token: this.userToken.token, receiverId: receiverId, userId: receiverId}
							
							uni.request({
								url: process.env.UNI_BASE_URL+'/api/job/userMobile',  // 获取手机号
								data: JSON.stringify(data),
								method: 'POST',
								success: result => {
									// console.log('userMobile 返回值' + JSON.stringify(result));
									if (result.statusCode == 200 && result.data.code == 0) {
										const respData = result.data.data;
										uni.makePhoneCall({
											phoneNumber: respData,
											success: () => {
												// data.username = _this.username;
												uni.request({
													url: process.env.UNI_BASE_URL+'/api/job/recordCallMobile',  // 数据源的数据是 有序的
													data: JSON.stringify(data),
													method: 'POST',
													success: result => {
														console.log("完成记录。")
													},
												});
												console.log("成功拨打电话:"+respData)
											}
										});
									}
								},
								fail: (result, code) => {
									console.log('fail' + JSON.stringify(result));
								},
								complete: (result) =>{
									// console.log('result' + JSON.stringify(result));
								},
							});
						}
					}
				});
				
				
				
			},
			
			toDetail(obj){
				// console.log("跳转："+obj.userId)
				const url = `/pages/job/user/user_detail?detailId=`+ obj.userId
				// 记录操作
				// this.writeHistoryRecord('浏览', obj.username, obj.headImgPath, url);
				
				if(!this.jobManager) this.jobManager = new JobStoreManager({sysId: SYS_ID, historyRecordKey: JOB_OPT_HISTORY_RECORD, maxHistoryLength: JOB_OPT_HISTORY_RECORD_LEN})
				this.jobManager.writeHistoryRecord('浏览', obj.username, obj.headImgPath, url)
				uni.navigateTo({
					url: url
				});
			},
			
			handleSwitchChange(e){
				if(!this.userToken || !this.userToken?.userId){
					uni.showToast({ title: '先登录，才能有效收藏！', icon: 'none' });
					return;
				}
				// console.log("用户:", JSON.stringify(e.switchObj), "改变值:", e.data);
				const obj = e.switchObj ;
				const isStore = e.data ;
				// this.storeOpt(e.switchObj, e.data);
				if(!this.jobManager) this.jobManager = new JobStoreManager({sysId: SYS_ID, historyRecordKey: JOB_OPT_HISTORY_RECORD, maxHistoryLength: JOB_OPT_HISTORY_RECORD_LEN})
				obj.storeType = 0;// storeType类型：0-收藏；1-点赞；2-分享
				obj.opt = '收藏'
				obj.isPlus = isStore
				this.jobManager.storeOpt(obj, this.userToken)
			},
			// 我的收藏
			async getStoreList(){
				var store = {sysId: SYS_ID, selfId: this.userToken.userId, token: this.userToken.token, enabled: 0}
				// console.log("取值："+JSON.stringify(store))
				try{
					const result = await uni.request({
						url: process.env.UNI_BASE_URL + '/api/job/storeUserIdList',
						header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
						method: 'POST',
						data: store
					});
					// console.log("result", JSON.stringify(result))
					let _this = this
					if(result.statusCode == 200 && result.data.code == 0){
						const storeIds = result.data.data;
						if(storeIds != null && storeIds.length > 0){
							storeIds.forEach((value, index) => {
							  _this.storeUserIdMap.set(value, true); // 或 map.set(value, index) 反向映射
							});
						}
					}
				}catch(error){
					
				}
			},
			
			handleStoreList(){
				if(this.storeUserIdMap.size<1) return;
				if(this.listData.length>0){
					this.listData.forEach(e => {
						e.isStore = this.storeUserIdMap.get(e.userId)?true:false
					});
				}
			},
			
			actionsClick(text, worker) {
				uni.showToast({
					title: text+ JSON.stringify(worker),
					icon: 'none'
				})
			},
	
			stringShowLen(showString, isHead=true){
				// console.log("输入值："+ showString)
				var len = scaleTitleMap[this.fontSizeScale]
				// console.log("地址显示字数"+ len)
				if(showString.length < len+1) return showString;
				if (typeof showString == 'string') {
					showString = isHead ? '…' + showString.slice(-len-1) : showString.slice(0, len)+'…'
				}
				// console.log("输出值："+ showString)
				return showString;
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
			initGetFontSize(){
				// console.log("从内存读取，字体设置数据："+ JOB_USER_FONT_SET)
				var _this = this
				uni.getStorage({
					key: JOB_USER_FONT_SET,
					success: function(resp){
						// console.log("key:", JOB_USER_FONT_SET, "返回内存原值：", JSON.stringify(resp))
						_this.fontSizeScale = resp.data
						_this.onFontSizeChange(_this.fontSizeScale); // 初始化设置一次
						// console.log("初始从缓存中取值，设置字体比例：" + _this.fontSizeScale)
					},
					fail:function(){
						// console.log("首次存储，未取得 key:"+JOB_USER_FONT_SET);
					}
				});
			},
			longPressCopyText(val){
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
			fabClick(){
				// uni.showToast({
				// 	title:'点击了按钮',
				// 	icon:'none',
				// 	position:'center'
				// });
				let _this = this
				uni.showModal({
				    title: '建议、意见、想法',
					height: 2000,
				    content: '',
				    editable: true,
				    confirmText: '反馈',
				    cancelText: '取消',
				    success: function (res) {
				        if (res.confirm) {
				            // console.log('用户输入的内容：', res.content);
							if(!res.content) return;
							_this.sendMessage(res.content)
							uni.showToast({
								title:'非常感谢！祝好！(*￣︶￣*)',
								icon:'success',
								position:'center'
							});
				        } else if (res.cancel) {
							uni.showToast({
								title:'期待您的反馈！！(*￣︶￣*)',
								icon:'success',
								position:'center'
							});
				        }
				    }
				});
			},
			sendMessage(content){
				var params = {
					sysId: SYS_ID, 
					callPhone: this.userToken?.userId,
					subject: 'job 反馈',
					suggestType: 3,		// 类型(1-咨询;2-投诉;3-建议(默认);4-举报;5-求助;6-意见;7-表扬)
					email: 'wangqingbo0829@163.com',
					content: content
				}
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/save/suggest',  // 数据源的数据是 有序的
					data: JSON.stringify(params),
					// data: params,
					method: 'POST',
					// header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						// console.log('suggest 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
				
			},
			trigger(){
				// console.log("点击了 trigger()")
			},
			handleTitleStyle(baseFontSize=16) {
				var fontSize = baseFontSize * (this.fontSizeScale / 100);
				return 'font-weight: bold; fontSize: '+fontSize+'px; font-size: '+fontSize+'px;';
			},
			
			handleFontSize(baseFontSize=16) {
				var fontSize = baseFontSize * (this.fontSizeScale / 100);
				return 'fontSize: '+fontSize+'px; font-size: '+fontSize+'px;';
			},
			getMore(){
				console.log("跳转至:", this.banners[0].noticeUrl)
				if(!this.banners[0].noticeUrl) return;
				uni.navigateTo({
					url: '/pages/job/user/'+this.banners[0].noticeUrl
				});
			},
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
		/**
		 * 当 searchInput 配置 disabled 为 true 时触发
		 */
		onNavigationBarSearchInputClicked(e) {
			console.log('输入变更：'+ e)
			uni.navigateTo({
				url: '/pages/job/user/history_record'
			});
		},
		/**
		 *  点击导航栏 buttons 时触发
		 */
		onNavigationBarButtonTap() {
			uni.showModal({
				title: '提示',
				content: '用户点击了功能按钮，这里仅做展示。',
				success: res => {
					if (res.confirm) {
						console.log('用户点击了确定');
					}
				}
			});
		}
	};
</script>

<style lang="scss">
	@import url('@/common/css/uni.css');
	
	/* 固定定位 + 层级控制 */
	.fixed-notice {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  z-index: 999999; /* 确保高于 l-navbar */
	}
	
	.banner {
		height: 360rpx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		min-height: 54rpx;
		overflow: hidden;
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;
		width: 90%;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 84rpx;
		color: white;
		z-index: 11;
	}

	.uni-media-list-logo {
		width: 180rpx;
		height: 140rpx;
	}

	.uni-media-list-body {
		height: auto;
		justify-content: space-around;
	}

	.uni-media-list-text-top {
		height: 74rpx;
		font-size: 28rpx;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	
	/* .uni-card .uni-card--shadow .uni-card--border{
		margin: 5px 10px 5px 10px;
	} */
	/* .uni-card {
		margin: 5px 10px 5px 10px;
	} */
	/* .container {
		display: flex;
		flex-direction: column;
		gap: 5px;
	} */
	
	/* 卡片 */
	.card-actions {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 45px;
		border-top: 1px #eee solid;
	}
	
	.card-actions-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.card-actions-item-text {
		font-size: 12px;
		color: #666;
		margin-left: 5px;
	}
	
	.uni-ellipsis {
		white-space: normal !important;
	}
	
	.headImg{
		width: 50px;
		height: 50px;
	}
	
	/* uni-card {
		padding: 0px;
		::v-deep .uni-card__content{
			padding: 0px;
		}
	} */
	
	::v-deep .uni-card__content{
		padding: 0px !important;
	} 
	
	// 反馈输入框
	.uni-modal__textarea{
		height: 150px;
	}
	
	.uni-list:after {
	  left: unset !important;
	}
	
	.box{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 0px; /* 保持原有的margin-top */
	}
</style>