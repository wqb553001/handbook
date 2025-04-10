<template>
	<view class="container">
		<view class="banner" @click="goDetail(banner)">
			<image class="banner-img" :src="banner.cover"></image>
			<view class="banner-title">{{ banner.title }}</view>
		</view>
		<view class="uni-list">
			<block v-for="(worker, index) in listData" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @click="goDetail(worker)">
					<view class="uni-media-list">
						<!-- <image class="uni-media-list-logo" src="https://img.36krcdn.com/20200410/v2_9c3331af67e64994aa97a27fffb1a380_img_png?x-oss-process=image/resize,m_mfit,w_520,h_300/crop,w_520,h_300,g_center"></image> -->
						<!-- <image class="uni-media-list-logo" :src="banner.cover"></image> -->
						<!-- <image class="uni-media-list-logo" src="#"></image> -->
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">{{ worker.skillSelecteds.map(skill => skill.text).join(",") + worker.otherSkills }}</view>
							<view class="uni-media-list-text-top">{{ worker.introduction }}</view>
							<view class="uni-media-list-text-bottom">
								<text>姓名：{{ worker.name }}</text>
								<text>电话：{{ worker.phoneno }}</text>
								<text>年龄：{{ calculateAge(worker.birthYearMonth) }}</text>
							</view>
						</view>
					</view>
				</view>
				
				<uni-card :title="worker.skillSelecteds.map(skill => skill.text).join(',') + worker.otherSkills" :sub-title="worker.name" :extra="worker.phoneno" @click="onClick">
					<text class="uni-body">{{ worker.introduction }}</text>
				</uni-card>
				
				<!-- #ifdef APP-PLUS -->
				<view class="ad-view" v-if="(index > 0 && (index+1) % 10 == 0)">
					<ad :adpid="adpid" @error="aderror"></ad>
				</view>
				<!-- #endif -->
			</block>
			<!-- <li v-for="(worker, index) in listData" :key="index"> -->
				<!-- <uni-card class="uni-card-item" style="margin: 5px 10px 5px 10px;" v-for="(worker, index) in listData" :key="index" :title="worker.skillSelecteds.map(skill => skill.text).join(',') + worker.otherSkills" :sub-title="worker.name" :extra="worker.phoneno" @click="onClick">
					<text class="uni-body">{{ worker.introduction }}</text>
				</uni-card> -->
			<!-- </li> -->
			<view style="margin: -10px;" v-for="(worker, index) in listData" :key="index">
				<uni-card :title="worker.skillSelecteds.map(skill => skill.text).join(',') + worker.otherSkills" :sub-title="worker.name" :extra="worker.phoneno" @click="onClick">
					<text class="uni-body">{{ worker.introduction }}</text>
				</uni-card>
			</view>
			<view style="margin: -10px;" v-for="(worker, index) in listData" :key="index">
				<uni-card :title="worker.skillSelecteds.map(skill => skill.text).join(',') + worker.otherSkills" :sub-title="worker.name" :extra="worker.phoneno" @click="onClick">
					<text class="uni-body">{{ worker.introduction }}</text>
				</uni-card>
			</view>
			<view style="margin: -10px;" v-for="(worker, index) in listData" :key="index">
				<uni-card :title="worker.skillSelecteds.map(skill => skill.text).join(',') + worker.otherSkills" :sub-title="worker.name" :extra="worker.phoneno">
					<text class="uni-body">{{ worker.introduction }}</text>
					<!-- <view slot="actions" class="card-actions no-border">
						<view class="card-actions-item" @click="actionsClick('分享', worker)">
							<uni-icons type="redo" size="18" color="#999"></uni-icons>
							<text class="card-actions-item-text">分享</text>
						</view>
						<view class="card-actions-item" @click="actionsClick('点赞', worker)">
							<uni-icons type="heart" size="18" color="#999"></uni-icons>
							<text class="card-actions-item-text">点赞</text>
						</view>
						<view class="card-actions-item" @click="actionsClick('评论', worker)">
							<uni-icons type="chatbubble" size="18" color="#999"></uni-icons>
							<text class="card-actions-item-text">评论</text>
						</view>
					</view> -->
				</uni-card>
			</view>
			<view style="margin: -10px;" v-for="(worker, index) in listData" :key="index">
				<uni-card >
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{ worker.skillSelecteds.map(skill => skill.text).join(",") + worker.otherSkills }}</view>
						<view class="uni-media-list-text-top">{{ worker.introduction }}</view>
						<view class="uni-media-list-text-top">{{ worker.sex==0?'男':worker.sex==0?'女':'' }}</view>
						<view class="uni-media-list-text-bottom">
							<text>{{ worker.name +(worker.sex==0?'先生':worker.sex==0?'女士':'') }}</text>
							<!-- <text>{{ worker.sex==0?'男':worker.sex==0?'女':'' }}</text> -->
							<text>{{ worker.phoneno }}</text>
							<text>年龄：{{ calculateAge(worker.birthYearMonth) }}</text>
						</view>
					</view>
				</uni-card>
			</view>
		</view>
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
				last_id: '',
				reload: false,
				status: 'more',
				adpid: '',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				}
			};
		},
		onLoad() {
			this.adpid = this.$adpid;
			this.getBanner();	// 获取，标题展示数据
			// this.getList();		// 获取，内容列表数据
			this.getList1();		// 获取，内容列表数据
		},
		onPullDownRefresh() {
			this.reload = true;
			this.last_id = '';
			this.getBanner();	// 获取，标题展示数据
			// this.getList();		// 获取，内容列表数据
			this.getList1();		// 获取，内容列表数据
		},
		onReachBottom() {
			this.status = 'more';
			// this.getList();		// 获取，内容列表数据
			
			this.getList1();		// 获取，内容列表数据
		},
		methods: {
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
					column: 'id,post_id,title,author_name,cover,published_at' //需要的字段名
				};
				if (this.last_id) {
					// 说明已有数据，目前处于上拉加载
					this.status = 'loading';
					data.minId = this.last_id;				// 有序取数，下一批数据的指针
					data.time = new Date().getTime() + '';	// 添加请求时间戳，作用：防止 重复取数
					data.pageSize = 10;
				}
				uni.request({
					url: 'https://unidemo.dcloud.net.cn/api/news',  // 数据源的数据是 有序的
					data: data,
					success: data => {
						if (data.statusCode == 200) {
							let list = this.setTime(data.data);
							this.listData = this.reload ? list : this.listData.concat(list);
							this.last_id = list[list.length - 1].id;
							this.reload = false;
						}
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
					}
				});
			},
			getList1() {
				this.getStoreByKey();
			},
			getStoreByKey(){
				var _this = this
				uni.getStorage({
					key: keyStr,
					success: function(resp){
						console.log("key:", keyStr, "返回值：", JSON.stringify(resp.data))
						// 更新对象 的指定属性，或追加属性
						// _this.$set(_this, table_tag_key, resp.data);
						_this.listData = resp.data;
					},
					fail:function(){
						console.log("未取得 key:", keyStr);
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
			
			calculateAge(yearMonth){
			  // 将出生日期字符串转换为Date对象
			  const birthDateObj = new Date(yearMonth+'-01');
			  
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
			
		}
	};
</script>

<style>
	/* @import '../../../common/css/uni.css'; */
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
	
</style>
