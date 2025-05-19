<template>
	<view class="page">
		<view class="list-item" v-for="(item,index) in listData" :key="index" @click="connect(item)">
			<view class="avatar">
				<text class="round" v-if="item.read"></text>
				<image :src="item.headImgPath" mode="widthFix"></image>
			</view>
			<view class="content">
				<view class="title">
					<text class="name">{{ item.username }}</text>
					<text class="time">{{ item.updateTime }}</text>
				</view>
				<view class="txt">{{ item.content }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const SYS_ID = 2025040301;
	const JOB_TOKEN = 'JOB_TOKEN';
	const PAGE_LIMIT = 20
	
	export default {
		onLoad() {
			const _this = this
			uni.getStorage({
				key: JOB_TOKEN,
				success: function(resp){
					_this.userToken = resp.data
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
					_this.getRelationList();
				},
				fail:function(){
				}
			});
		},
		mounted() {
			// this.getRelationList();
		},
		data() {
			return {
				users: [
					{avatar: 'https://ww1.sinaimg.cn/mw690/a1a9fb72gy1hl1cd1znplj20j60j6n0h.jpg', name: '云端遗梦录', read: 1},
					{avatar: 'https://wx1.sinaimg.cn/mw690/006zUvE2gy1hlzne8puvvj30p40p4mz0.jpg', name: '我要月亮奔我而来', read: 1},
					{avatar: 'https://k.sinaimg.cn/n/sinakd20121/96/w2048h2048/20240118/9708-e48f9d9226e0a45ec9610b2eb3906a87.jpg/w700d1q75cms.jpg', name: '星河暗恋记', read: 1},
					{avatar: 'https://ww1.sinaimg.cn/mw690/a1a9fb72gy1hl1cd1znplj20j60j6n0h.jpg', name: '月野氿桃', read: 1},
					{avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fa6808c4d-deac-4102-8fcb-0164b258ffe5%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1708585730&t=fb863f2b64845d0ae49091187f15f452', name: '星星跌入梦境', read: 1},
					{avatar: 'https://img1.baidu.com/it/u=4103620966,1336257185&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', name: '桃奈叶子', read: 0},
					{avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F0738d0c4-60bf-477f-a5b9-b78abf994cc9%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1708585786&t=656a85368566a4b0d2e9f64a6bb3d915', name: '知更鸟的死因', read: 0},
					{avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F8075fa62-cf88-420a-88f7-9a4a4d714bb0%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1708585798&t=057782a24ac68de6a2671084fb40140a', name: '放鹤归舟', read: 0},
					{avatar: 'https://img0.baidu.com/it/u=3975753653,825915219&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', name: '春日樱亭', read: 0},
					{avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F034f80eb-432d-4e10-b5d8-c2327334c61b%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1708585807&t=398154a5d365a390dc5ee294c87cb018', name: '宇宙热恋期', read: 0},
					{avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F4d69987e-5419-463c-890c-61f819bf4d22%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1708585819&t=21d504545be19a98f39f593ce59df064', name: '今夜星潮暗涌', read: 0},
					{avatar: 'https://img1.baidu.com/it/u=4103620966,1336257185&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', name: '桃奈叶子', read: 0},
					{avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F0738d0c4-60bf-477f-a5b9-b78abf994cc9%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1708585786&t=656a85368566a4b0d2e9f64a6bb3d915', name: '知更鸟的死因', read: 0},
					{avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F8075fa62-cf88-420a-88f7-9a4a4d714bb0%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1708585798&t=057782a24ac68de6a2671084fb40140a', name: '放鹤归舟', read: 0},
					{avatar: 'https://img0.baidu.com/it/u=3975753653,825915219&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', name: '春日樱亭', read: 0},
					{avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F034f80eb-432d-4e10-b5d8-c2327334c61b%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1708585807&t=398154a5d365a390dc5ee294c87cb018', name: '宇宙热恋期', read: 0},
					{avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F4d69987e-5419-463c-890c-61f819bf4d22%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1708585819&t=21d504545be19a98f39f593ce59df064', name: '今夜星潮暗涌', read: 0},
				],
				
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
			};
		},
		methods: {
			connect(item) {
				uni.navigateTo({
					url:`/pages/job/online/message?senderId=${item.senderId}&receiverId=${item.receiverId}`
				})
			},
			initData(){
				this.listData 	= [];
				this.last_id 	= '';
				this.status		= 'more'
			},
			getRelationList(){
				if(this.status == 'nomore') return;
				let data = {sysId: SYS_ID, selfId: this.userToken.userId, token: this.userToken.token}
				if (this.last_id) {
					// 说明已有数据，目前处于上拉加载
					this.status = 'loading';
					data.minId = this.last_id;				// 有序取数，下一批数据的指针
					data.time = new Date().getTime() + '';	// 添加请求时间戳，作用：防止 重复取数
					data.limit = PAGE_LIMIT;
				}
				console.log('Base URL:', process.env.UNI_BASE_URL)
				// console.log('请求参数：' + JSON.stringify(data))
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/listRelation',  // 数据源的数据是 有序的
					data: JSON.stringify(data),
					method: 'POST',
					success: result => {
						// console.log('userStream 返回值' + JSON.stringify(result));
						if (result.statusCode == 200 && result.data.code == 0) {
							const respData = result.data.data.rows;
							if(respData.length<1){
								this.reload = false;
								this.status = 'nomore';	// 没有更多
								return;
							}
							let list = this.dataHandle(respData);
							this.listData = this.reload ? list : this.listData.concat(list);
							if(respData.length<PAGE_LIMIT) {
								this.reload = false;
								this.status = 'nomore';	// 没有更多
								return;
							};
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
			dataHandle(items){
				items.forEach(e => {
					e.updateTime = e.updateTime
					return e;
				});
				return items;
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding: 0 32rpx;
		color: #333;
	}
	.list-item {
		display: flex;
		padding: 30rpx 0;
		border-bottom: 1px solid #f7f8f9;
		.avatar {
			width: 90rpx;
			height: 90rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
			position: relative;
			.round {
				position: absolute;
				width: 14rpx;
				height: 14rpx;
				border-radius: 50%;
				background: #ef5656;
				top: -4rpx;
				right: -4rpx;
				z-index: 1;
			}
			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}
		.content {
			flex: 1;
			.title {
				display: flex;
				justify-content: space-between;
				.name {
					font-weight: bold;
				}
				.time {
					color: #999;
					font-size: 24rpx;
				}
			}
			.txt {
				margin-top: 10rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				text-align: left;
				color: #999;
				font-size: 26rpx;
			}
		}
	}
</style>
