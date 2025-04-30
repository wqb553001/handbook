<template>
	<view class="container">
<!-- 		<uni-card :is-shadow="false" is-full style="text-align: center; display: block;z-index: 9999; ">
			<text class="uni-h6" >无所事事，难获持久尊重；劳逸结合，过好健康人生</text>
		</uni-card> -->
		
		<l-navbar title="找用工" leftColor="#ffffff" titleColor="#ffffff" iconColor="#ffffff" :search="true"
			:showRight="false" :debounce-delay="500" centerMargin="200px" leftWidth="300px" :border="false" 
			background="linear-gradient(180deg, #ff6043 51%, rgba(255, 96, 67, 0) 99%)" placeholderText="请输入关键词"
			@leftClick="leftClick" @change="handleSearchChange" 
			:searchStyle="handleSearchStyle" :fontSize="scaledFontSize"
			:leftText="location.text" :leftTextFull="location.address" 
			>
		</l-navbar>
		
		<view class="slider-container" style="z-index: 9999;">
			<u-slider v-model="fontSizeScale"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9"
			 min="50" max="200" step="10" block-size="20" @changing="onFontSizeChange" show-value></u-slider>
		    <!-- <text style="text-align: center; display: block;">字体缩放比例：{{fontSizeScale}}%</text> -->
		</view>
		
		<view class="banner" @click="goDetail(banner)">
			<image class="banner-img" :src="banner.cover"></image>
			<view class="banner-title" :style="fontSet" >{{ banner.title }}</view>
		</view>
		
		<view class="uni-list">
			<view style="margin: -10px;" v-for="(worker, index) in listData" :key="index">
				<uni-card style="padding:0px" >
					<template v-slot:title>
						<uni-list>
							<uniListItem :titleStyle="handleTitleStyle(18)" :show-switch="true" :title="stringShowLen(worker.allSkills, false)"
							@switchChange="handleSwitchChange" :switchId="worker.userId" :switchChecked="worker.isStore" />
						</uni-list>
					</template>
					<view class="uni-flex uni-row">
						<view class="uni-row" style="width:100%" >
							<view class="text" style="display: flex; padding-top: 10rpx;">
								<view class="text uni-flex" style="width: 200rpx; height: 200rpx; padding-top: 10px;">
									<image :src="worker.headImgPath" style="width: 150rpx; height: 150rpx;"></image>
								</view>
								<view class="uni-row" style="flex: 1; padding-top: 10rpx; ">
									<view class="uni-flex uni-column" @click="toDetail(worker.userId)"
										style="min-height: 80rpx;  line-height:70rpx;" :style="fontSet">
										{{ worker.introduction }}
									</view>
									
									<view class="uni-flex uni-row" style="justify-content: space-between; padding-top: 10rpx;">
										<view class="text" style="min-width: 160rpx;  line-height:70rpx;" :style="fontSet">
											{{ worker.tools || ' ' }}
										</view>
										
										<view class="text" style="color: #2E8B57; font-weight: bold;  line-height:70rpx;" :style="fontSet" @longpress="longPressCopyText(worker.address)">
											{{ worker.address || ' ' }}
										</view>
									</view>
								</view>
							</view>
								
							<view class="uni-flex uni-row"  :style="fontSet" style="-webkit-justify-content: space-between;justify-content: space-between;  line-height:70rpx;">
								<view class="text" >{{ worker.username +(worker.sex==0?' 先生':worker.sex==1?' 女士':'') }}</view>
								<view style="margin-top: 10px;"><uni-rate :readonly="true" :max="10" :value="worker.multiScore" :size="13*fontScale"  /></view>
								<view class="text" style="display: flex;" @click="makePhoneCall(worker.mobile)">电话联系
									<u-icon name="phone" color="#D3D3D3" size="36rpx" />
								</view>
								
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
		<uni-fab ref="fab" :pattern="fab.pattern" :content="fab.content" :horizontal="fab.horizontal" :vertical="fab.vertical"
			:direction="fab.direction" @trigger="trigger" @fabClick="fabClick" />
		<!--加载更多、向下-->
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
	</view>
</template>

<script>
	import { dateUtils } from  '../../../common/js/util.js';
    import uniListItem from '@/components/uni-list-item/uni-list-item.vue';

	const SYS_ID = 2025040301;
	const JOB_TOKEN = 'JOB_TOKEN';
	const JOB_USER_FONT_SET = "jobUserFontSet";
	const keyStr = "jobInfoMap";
	const scaleAddressMap 	= {50:21, 60:17, 70:14, 80:12, 90:11, 100: 9,  110:8,  120:7,  130:6, 140:6, 150:5, 160:5, 170:4, 180:4, 190:4, 200:3}
	const scaleTitleMap 	= {50:25, 60:23, 70:20, 80:17, 90:15, 100: 12, 110:11, 120:10, 130:9, 140:8, 150:8, 160:8, 170:7, 180:7, 190:6, 200:6}
	export default {
        components: { uniListItem },
		data() {
			return {
				userId:0,
				userToken:{},
				// 字体缩放
				fontSet: '',
				fontScale: 1.0,
				fontSizeScale: 100, // 默认100%比例
				baseFontSize: 16,   // 基础字体大小（根据设计稿调整）
				
				banner: {},
				listData: [],
				last_id: '',	// 分页指针；上一页的最后一项的id
				reload: false,	// 上拉加载更多-false; 下拉刷新-true
				status: 'more', // 加载状态  more：上拉加载更多；loading：加载中；nomore：没有更多
				adpid: '',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				location:{
					text: "四方河路宜家尚城",  	// 显示地址
					address: "四方河路宜家尚城",	// 实际完整地址
					latitude: "",
					longitude: "",
					province: "",
					city: "贵阳市",
					district: "南明区"
				},
				searchValue:"",
				
				// 收藏
				storeUserIdMap: new Map,
				
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
					// content: [{
					// 		// iconPath: '/static/icons/steps.png',
					// 		selectedIconPath: '/static/icons/steps.png',
					// 		text: '想法、建议、问题、需求',
					// 		active: false
					// 	}
					// 	// ,
					// 	// {
					// 	// 	iconPath: '/static/home.png',
					// 	// 	selectedIconPath: '/static/home-active.png',
					// 	// 	text: '首页',
					// 	// 	active: false
					// 	// },
					// 	// {
					// 	// 	iconPath: '/static/star.png',
					// 	// 	selectedIconPath: '/static/star-active.png',
					// 	// 	text: '收藏',
					// 	// 	active: false
					// 	// }
					// ]
				}
			};
		},
		onLoad() {
			const _this = this
			uni.getStorage({
				key: JOB_TOKEN,
				success: function(resp){
					_this.userToken = resp.data
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
					_this.getStoreList();
					_this.getList();		// 获取，内容列表数据
				},
				fail:function(){
				}
			});
			
			this.adpid = this.$adpid;
			this.getBanner();	// 获取，标题展示数据
			
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
				this.initGetFontSize();
			});
		},
		onUnload() {
			// 避免泄露，结束卸载监听
			uni.$off('acceptAddress');
		},
		onPullDownRefresh() {
			this.reload = true;
			this.last_id = '';
			this.getBanner();	// 获取，标题展示数据
			this.getList();		// 获取，内容列表数据
		},
		onReachBottom() {
			this.status = 'more';
			this.getList();		// 获取，内容列表数据
		},
		mounted(){
			this.initGetFontSize(); // 页面重新加载-恢复
		},
		methods: {
			// setData(obj) {
			// 	Object.keys(obj).forEach((key) => {
			// 		this.$set(this.$data, key, obj[key])
			// 	})
			// },
			async onFontSizeChange(scale) {
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
				var _this = this
				// 字体大小存入缓存记忆
				uni.setStorage({key:JOB_USER_FONT_SET, data: _this.fontSizeScale});
			},
			handleSearchChange(searchValue){
				this.searchValue = searchValue
				// console.log("搜索框输入："+ searchValue)
				this.initData();
				this.getList();
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
			initData(){
				this.listData = [];
				this.last_id = '';
			},
			leftClick(){
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
				let data = {
					column: 'id,post_id,title,author_name,cover,published_at' //需要的字段名
				};
				uni.request({
					url: 'https://unidemo.dcloud.net.cn/api/banner/36kr',
					data: data,
					success: data => {
						uni.stopPullDownRefresh();
						if (data.statusCode == 200) {
							this.banner = data.data;
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
					}
				});
			},
			
			// 获取，内容列表数据
			getList() {
				let data = {sysId: SYS_ID, selfId: this.userToken.userId, token: this.userToken.token}
				if(this.searchValue){
					data.likeAllSkills =  "%"+this.searchValue+"%"
				}
				if (this.last_id) {
					// 说明已有数据，目前处于上拉加载
					this.status = 'loading';
					data.minId = this.last_id;				// 有序取数，下一批数据的指针
					data.time = new Date().getTime() + '';	// 添加请求时间戳，作用：防止 重复取数
					data.limit = 10;
				}
				console.log('Base URL:', process.env.UNI_BASE_URL)
				// console.log('请求参数：' + JSON.stringify(data))
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/userStream',  // 数据源的数据是 有序的
					data: JSON.stringify(data),
					method: 'POST',
					success: result => {
						// console.log('userStream 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							const respData = result.data.data.rows;
							if(respData.length==0) {
								this.reload = false;
								this.status = 'nomore';	// 没有更多
								return;
							};
							let list = this.dataHandle(respData);
							this.listData = this.reload ? list : this.listData.concat(list);
							this.last_id = list[list.length - 1].userId;
							this.reload = false;
							this.status = 'more';		// 上拉加载更多
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					},
					complete: (result) =>{
						// console.log('result' + JSON.stringify(result));
					}
				});
			},
			goDetail(e) {
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
				items.forEach(e => {
					let allSkills = e.skillsName;
					// if(e.skills) allSkills = JSON.parse(e.skills)
					//  .filter(obj =>!(Object.keys(obj).includes('-1')))
					//  .map(obj => Object.values(obj))
					//  .join(',');
					// console.log("allSkills:"+allSkills+";e.otherSkills:"+e.otherSkills)
					allSkills = (!allSkills)?e.otherSkills:(e.otherSkills!="")?(allSkills +'；'+ e.otherSkills):allSkills;
					
					// console.log("allSkills:"+allSkills)
					e.allSkills 	= _this.truncateString(allSkills, 20);
					e.age 			= _this.calculateAge(e.birth);
					e.tools 		= _this.truncateString(e.tools, 20);
					e.introduction 	= _this.truncateString(e.introduction, 45);
					e.isStore 		= this.storeUserIdMap.get(e.userId)?true:false
					return e;
				});
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
			
			calculateAge(birth){
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
			// 打电话
			makePhoneCall: function (phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
					success: () => {
						console.log("成功拨打电话:"+phone)
					}
				})
			},
			
			toDetail(userId){
				console.log("跳转："+userId)
				uni.navigateTo({
					url: '/pages/job/user_list/user_detail?detailId='+ userId
				});
			},
			
			onClick(phoneno) {
				console.log(phoneno)
				uni.makePhoneCall({
					phoneNumber: phoneno,
					success: () => {
						console.log("成功拨打电话")
					}
				})
			},
			
			handleSwitchChange(e){
				// console.log("用户ID:", e.switchId, "改变值:", e.data);
				this.storeOpt(e.switchId, e.data);
			},
			
			async storeOpt(userId, isStore=true){
				let opt = '收藏';
				let enabled = 0;
				if(!isStore) {
					enabled = 1;
					opt = '取消收藏';
				}
				var store = {sysId: SYS_ID, selfId: this.userToken.userId, token: this.userToken.token, userId: userId, enabled: enabled}
				const result = await uni.request({
					url: process.env.UNI_BASE_URL + '/api/job/storeOpt',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					method: 'POST',
					data: store
				});
				// console.log("result", JSON.stringify(result))
				if(result.data.code == 0){
					uni.showToast({ title: opt+'成功', icon: 'success' });
					// uni.navigateBack(); // 返回上一页
				}else{
					uni.showToast({ title: opt+'未成功，请后续重试！', icon: 'error' });
				}
			},
			
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
							_this.sendMessage(res.content)
							uni.showToast({
								title:'非常感谢！祝好！(*￣︶￣*)',
								icon:'success',
								position:'center'
							});
				        } else if (res.cancel) {
							uni.showToast({
								title:'期待您的反馈！！ (*￣︶￣*)',
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
					callPhone: this.userToken.userId,
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
				return 'color: #000000; fontSize: '+fontSize+'px; font-size: '+fontSize+'px;';
			}
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
				url: '/pages/job/user_list/history_record'
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
		max-height: 84rpx;
		overflow: hidden;
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;
		width: 90%;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 42rpx;
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
	
</style>
