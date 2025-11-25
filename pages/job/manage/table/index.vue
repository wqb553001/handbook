<template>
	<view class="">
		<view class="">
			1、"正常表格"实线左右上下滑动
		</view>
		<button type="default"  @click="toMyTable('default')">正常左右上下滑动</button>
		<view class="">
			2、"固定两个表头"这个思路可以用来实线固定前三行
		</view>
		<button type="default"  @click="toMyTable('towHead')">固定两个表头</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: 'Hello'
		};
	},
	onLoad() {},
	methods: {
		toMyTable(val) {
			uni.navigateTo({
				url:`/pages/job/manage/table/mytable?val=${val}` 
			});
		}
	}
};
</script>

<style></style>
