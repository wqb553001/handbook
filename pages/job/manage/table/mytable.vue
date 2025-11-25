<template>
	<view v-if="tableData.length != 0" class="">
		<kingTable
			v-if="!isTwoHead"
			:tableData="tableData"
			:tableHeadL="tableHeadL"
			:tableHeadR="tableHeadR"
			:tableHeadLKey="tableHeadLKey"
			:tableHeadRKey="tableHeadRKey"
			@getCellVal="getCellVal"
		></kingTable>
		<kingTwoHead
			v-if="isTwoHead"
			:tableData="tableData"
			:tableHeadL="tableHeadL"
			:tableHeadR="tableHeadR"
			:tableHeadLKey="tableHeadLKey"
			:tableHeadRKey="tableHeadRKey"
			@getCellVal="getCellVal"
		></kingTwoHead>
	</view>
</template>
<script>
// 单个表头
import kingTable from '@/components/kingTable/kingTable.vue';
// 两个表头
import kingTwoHead from '@/components/kingTwoHead/kingTwoHead.vue';
export default {
	components: {
		kingTable,
		kingTwoHead
	},
	data() {
		return {
			// 是否两个表头
			isTwoHead: Boolean,
			// 主表数据（后端返回来）
			tableData: [],
			// 左侧表头
			tableHeadL: ['姓名', '年龄', '颜色', '地区'],
			// 右侧表头
			tableHeadR: [
				'出生地',
				'居住地',
				'高度',
				'宽度',
				'重量',
				'热度',
				'出生地',
				'居住地',
				'高度',
				'宽度',
				'重量',
				'热度',
				'出生地',
				'居住地',
				'高度',
				'宽度',
				'重量',
				'热度'
			],
			// 自定义左侧表头对应的字段（长度一定要跟表头的长度想对应）
			tableHeadLKey: ['name', 'age', 'color', 'region'],
			// 自定义右侧表头对应的字段（长度一定要跟表头的长度想对应）
			tableHeadRKey: [
				'born',
				'address',
				'height',
				'width',
				'weight',
				'hot',
				'born',
				'address',
				'height',
				'width',
				'weight',
				'hot',
				'born',
				'address',
				'height',
				'width',
				'weight',
				'hot'
			]
		};
	},
	onLoad(options) {
		if (options.val == 'default') {
			this.isTwoHead = false;
		} else {
			this.isTwoHead = true;
		}
		let list = [];
		for (var i = 0; i < 30; i++) {
			list[i] = {
				name: `国王${i}`,
				age: `${i}岁`,
				color: `颜色${i}`,
				region: `东莞${i}`,
				born: `广州${i}`,
				address: `深圳${i}`,
				height: `17${i}cm`,
				width: `5${i}米`,
				weight: `6${i}kg`,
				hot: `太热了${i}`
			};
		}
		this.tableData = list;
	},
	methods: {
		// 点击单元格获取的值
		getCellVal(e) {
			console.log(e);
			uni.showToast({
				title: e,
				icon: 'none'
			});
		}
	}
};
</script>

<style lang="scss"></style>
