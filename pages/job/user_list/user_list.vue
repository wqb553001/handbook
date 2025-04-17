<template>
	<view class="container">
		<l-navbar title="首页" leftColor="#ffffff" titleColor="#ffffff" iconColor="#ffffff" :search="true"
			:showRight="false" :leftText="truncateString(location.text)" centerMargin="200px" leftWidth="300px"
			background="linear-gradient(180deg, #ff6043 51%, rgba(255, 96, 67, 0) 99%)" :border="false"
			@leftClick="leftClick" :debounce-delay="500" @change="handleSearchChange" placeholderText="请输入关键词"
			>
		</l-navbar>
		<view class="banner" @click="goDetail(banner)">
			<image class="banner-img" :src="banner.cover"></image>
			<view class="banner-title">{{ banner.title }}</view>
		</view>
		<view class="uni-list">
			<!-- <block v-for="(worker, index) in listData" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="goDetail(worker)">
					<view class="uni-media-list">
						<view class="uni-media-list-body">
							<image :src="worker.headImgPath" class="headImg" />
							<view class="uni-media-list-text-top">{{ worker.allSkills }}</view>
							<view class="uni-media-list-text-top">{{ worker.introduction }}</view>
							<view class="uni-media-list-text-bottom">
								<text>姓名：{{ worker.username }}</text>
								<text>电话：{{ worker.mobile }}</text>
								<text>年龄：{{ worker.age }}</text>
							</view>
						</view>
					</view>
				</view>
				
				<uni-card :title="worker.allSkills" :sub-title="worker.username" :extra="worker.mobile" @click="onClick">
					<text class="uni-body">{{ worker.introduction }}</text>
				</uni-card>
			</block> -->

			<view style="margin: -10px;" v-for="(worker, index) in listData" :key="index">
				<uni-card style="padding:0px">
					<view class="uni-flex uni-row">
						<view class="uni-row" style="width:100%" >
							<view class="text" style="text-align: left; padding-top: 10rpx; ">
								{{ worker.allSkills }}
							</view>
							<view class="text" style="display: flex; padding-top: 10rpx;">
								<view class="text uni-flex" style="width: 200rpx; height: 200rpx;">
									<image :src="worker.headImgPath" style="width: 150rpx; height: 150rpx;"></image>
								</view>
								<view class="uni-row" style="flex: 1; padding-top: 10rpx; padding-left: 10rpx; ">
									<view class="uni-flex uni-column" style="min-height: 80rpx;" >
										{{ worker.introduction }}
									</view>
									
									<view class="uni-flex uni-row" style="justify-content: space-between; padding-top: 10rpx;">
										<view class="text" style="min-width: 160rpx;">
											{{ worker.tools || ' ' }}
										</view>
										
										<view class="text" style="color: #2E8B57; font-weight: bold;">
											{{ worker.address || ' ' }}
										</view>
									</view>
								</view>
							</view>
							
								
							<view class="uni-flex uni-row" style="-webkit-justify-content: space-between;justify-content: space-between;">
								<view class="text" >{{ worker.username +(worker.sex==0?' 先生':worker.sex==1?' 女士':'') }}</view>
								<view class="text" style="display: flex;" @click="makePhoneCall(worker.mobile)">电话联系
									<u-icon
										name="phone" 
										color="#D3D3D3" 
										size="36rpx" 
									/>
								</view>
								
							</view>
						</view>
					</view>
				</uni-card>
			</view>
			
		</view>
			
			<!-- <view style="margin: -10px;" v-for="(worker, index) in listData" :key="index">
				<uni-card >
					<view class="uni-media-list-body">
						<image :src="worker.headImgPath" class="headImg" />
						<view class="uni-media-list-text-top">{{ worker.allSkills }}</view>
						<view class="uni-media-list-text-top">{{ worker.introduction }}</view>
						<view class="uni-media-list-text-top">{{ worker.sex==0?'男':worker.sex==0?'女':'' }}</view>
						<view class="uni-media-list-text-bottom">
							<text>{{ worker.username +(worker.sex==0?'先生':worker.sex==0?'女士':'') }}</text>
							<text>{{ worker.mobile }}</text>
							<text>年龄：{{ worker.age }}</text>
						</view>
					</view>
				</uni-card>
			</view> -->
		
		
		<!-- #ifdef APP-PLUS -->
		<view class="ad-view" v-if="(index > 0 && (index+1) % 10 == 0)">
			<ad :adpid="adpid" @error="aderror"></ad>
		</view>
		<!-- #endif -->
		
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
	</view>
</template>

<script>
	import { dateUtils } from  '../../../common/js/util.js';
	
	
	const keyStr = "jobInfoMap"
	export default {
		data() {
			return {
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
					text: "四方河宜家尚城",
					address: "四方河宜家尚城",
					latitude: "",
					longitude: "",
					province: "",
					city: "贵阳市",
					district: "南明区"
				},
				searchValue:"",
			};
		},
		onLoad() {
			this.adpid = this.$adpid;
			this.getBanner();	// 获取，标题展示数据
			this.getList();		// 获取，内容列表数据
			var _this = this
			// 监听全局事件（获取选择的地址）
			uni.$on('acceptAddress', (data) => {
				var str = data.title;
				if (typeof str == 'string') {
					str = str.length > 10 ? '…' + str.slice(-9) : str
				}
				console.log("返回地区1："+JSON.stringify(data)+"; 截取结果：" + str);
				this.location = {
					text		: str,
					address 	: data.title,
					latitude 	: data.location.lat,	// 纬度
					longitude 	: data.location.lng,	// 经度
					province 	: data.province,
					city 		: data.city,
					district 	: data.district
				}
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
		methods: {
			handleSearchChange(searchValue){
				this.searchValue=searchValue
				console.log("搜索框输入："+ searchValue)
				this.initData();
				this.getList();
				// this.getList("%"+searchValue+"%")
			},
			initData(){
				this.listData = [];
				this.last_id = '';
			},
			leftClick(){
				console.log("点击了 导航栏 L 左侧……")
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
				var data = {
					// sort: 'user_id',
					// order: 'ASC',
					likeAllSkills: "%"+this.searchValue+"%"
				};
				if (this.last_id) {
					// 说明已有数据，目前处于上拉加载
					this.status = 'loading';
					data.minId = this.last_id;				// 有序取数，下一批数据的指针
					data.time = new Date().getTime() + '';	// 添加请求时间戳，作用：防止 重复取数
					data.limit = 10;
				}
				uni.request({
					url: 'http://localhost:18281/api/job/userStream',  // 数据源的数据是 有序的
					// url: 'http://xny.world:18281/api/job/userStream',  // 数据源的数据是 有序的
					data: JSON.stringify(data),
					method: 'POST',
					success: result => {
						console.log('userStream 返回值' + JSON.stringify(result));
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
					}
				});
			},
			goDetail: function(e) {
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
			dataHandle: function(items) {
				var newItems = [];
				var _this = this
				items.forEach(e => {
					newItems.push({
						userId: 		e.userId,
						username:		e.username,
						mobile:			e.mobile,
						sex: 			e.sex,
						headImgPath:	e.headImgPath,
						allSkills: 		_this.truncateString(JSON.parse(e.skills).map(obj => {var val = Object.values(obj); return "其他"==val?"":val}).join(",") + e.otherSkills, 20), // 去除 “其他” 字样
						age: 			_this.calculateAge(e.birth),
						// address: 		e.province+e.city+e.district+e.address,
						address: 		e.district+e.address,
						tools:			_this.truncateString(e.tools, 20),
						introduction: 	_this.truncateString(e.introduction, 45)
					});
				});
				return newItems;
			},
			
			truncateString(str, length = 45, defaultValue = ' ') {
				if (!str || str.length === 0) {
					return defaultValue;
				}
				
				str = String(str).trim();
				if (str.length > length) {
					return str.slice(0, length) + '…';
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
		
			onClick(phoneno) {
				console.log(phoneno)
				uni.makePhoneCall({
					phoneNumber: phoneno,
					success: () => {
						console.log("成功拨打电话")
					}
				})
			},
			
			actionsClick(text, worker) {
				uni.showToast({
					title: text+ JSON.stringify(worker),
					icon: 'none'
				})
			}
		},
		computed:{
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
	
	
	// /* 搜索栏 */
	// .custom-navbar {
	//   background-color: #007AFF;
	//   padding: 10rpx 20rpx;
	// }
	// .search-box {
	//   background-color: #fff;
	//   border-radius: 6px;
	//   height: 60rpx;
	//   display: flex;
	//   align-items: center;
	//   padding: 0 20rpx;
	// }
	// .placeholder {
	//   color: #999;
	//   margin-left: 10rpx;
	// }

</style>
