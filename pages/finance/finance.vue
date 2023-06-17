<template>
	<view>
		<view class="warp">
			<view class="box">
				<view class="title">默认效果</view>
				<t-table @change="change">
					<t-tr>
						<t-th>序号</t-th>
						<t-th>姓名</t-th>
						<t-th>年龄</t-th>
						<t-th>爱好</t-th>
					</t-tr>
					<t-tr v-for="item in tableList" :key="item.id">
						<t-td>{{ item.id + 1 }}</t-td>
						<t-td>{{ item.name }}</t-td>
						<t-td>{{ item.age }}</t-td>
						<t-td>{{ item.hobby }}</t-td>
					</t-tr>
				</t-table>
			</view>
			
		</view>
	</view>
	
	<view>		
		<uni-card title="基础卡片" :isFull="true" sub-title="副标题" extra="额外信息">
			<text>这是一个通栏卡片 ，通栏没有外边距，左右会贴合父元素。</text>
		</uni-card>
	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	
	export default {
		components: {
			tTable,
			,tTh
			,tTr
			,tTd
		},
		data() {
			return {
				tableList: [{
						id: 0,
						name: '张三',
						age: '19',
						hobby: '游泳'
					},
					{
						id: 1,
						name: '李四',
						age: '21',
						hobby: '绘画'
					},
					{
						id: 2,
						name: '王二',
						age: '29',
						hobby: '滑板'
					},
					{
						id: 3,
						name: '码字',
						age: '20',
						hobby: '蹦极'
					}
				],
				value: 'aaa',
				list: [{
					text: '点赞',
					color: 'blue',
					fontSize: 28
				}, {
					text: '分享'
				}, {
					text: '评论'
				}],
				show: true
			};
		},
		methods: {
			change(e) {
				console.log(e.detail);
			},
			edit(item) {
				uni.showToast({
					title: item.name,
					icon: 'none'
				});
			}
			,open(){
				this.$refs.calendar.open();
			}
			,confirm(e) {
				console.log(e);
			}
		}
	}
</script>

<style lang="scss">
	// @import "uview-ui/index.scss";
	
	.title {
		font-size: 32upx;
		color: #666;
	}
	.box {
		margin: 20upx;
	}

	button {
		font-size: 24upx;
	}
	
</style>
