<template>
	<view class="kingTable" style="margin-right: 10rpx;" @tap="currentSwipeIndex=-1"> <!--  :style="{ height: tableHeight }" -->
		<view class="kingFlex" v-if="tableData.length != 0">
			<!-- 左侧固定的主体部分 -->
			<view class="kingSticky kingLeftCon">
				<view class="kingFlex kingSticky" style="top: 0; z-index: 9;">
					<!-- 选择列 -->
					<view class="tableHead" v-if="showCheckbox" :style="{ width: checkboxColumnWidth + 'rpx' }">
						<view
							class="tableColmn"
							:style="{ 
								backgroundColor: tableHeadStyle.backgroundColor, 
								fontSize: getScaledFontSize(tableHeadStyle.fontSize), 
								fontWeight: tableHeadStyle.fontWeight
							}"
						>
							<checkbox-group @change="toggleSelectAll">
								<checkbox :checked="isAllSelected" />
							</checkbox-group>
						</view>
					</view>
					<view class="tableHead" v-for="(item, index) in tableHeadL" :key="index" >
						<view
							class="tableColmn"
							:style="{ backgroundColor: tableHeadStyle.backgroundColor, 
								fontSize: getScaledFontSize(tableHeadStyle.fontSize), 
								fontWeight: tableHeadStyle.fontWeight, 
								width: getColumnWidth('left', index) 
							}"
						>
							{{ item }}
						</view>
					</view>
				</view>
				<view class="kingFlex first">
					<!-- 选择列内容 -->
					<view v-if="showCheckbox" :style="{ width: checkboxColumnWidth + 'rpx' }">
						<block v-for="(item, index) in tableData" :key="index">
							<view class="tableColmn">
								<checkbox-group @change="(e) => toggleSelect(index, e.detail.value)">
									<checkbox :value="index.toString()" :checked="selectedRows.includes(index)" />
								</checkbox-group>
							</view>
						</block>
					</view>
					<!-- 遍历左侧的的表头 -->
					<block v-for="(item1, index1) in tableHeadLKey" :key="index1" >
						<view class="" >
							<block v-for="(item, index) in tableData" :key="index">
								<view @click="getIndex(item[item1], index)" 
									:style="{ backgroundColor: isIndex == index ? tableClickCol : '', 
										fontSize: getScaledFontSize(),
										width: getColumnWidth('left', index1)
									}" class="tableColmn">{{ item[item1] }}
								</view>
							</block>
						</view>
					</block>
				</view>
			</view>
			<!-- 右侧可左右滑动部分，结构跟左侧一模一样的，只是这样分开来弄可以解决左右滑动的问题，实现想不出其他方法了，求大佬改进 -->
			<view class="">
				<view class="kingFlex kingSticky" style="top: 0; z-index: 8;">
					<view class="tableHead" v-for="(item, index) in tableHeadR" :key="index" >
						<view
							class="tableColmn"
							:style="{ backgroundColor: tableHeadStyle.backgroundColor, 
								fontSize: getScaledFontSize(tableHeadStyle.fontSize), 
								fontWeight: tableHeadStyle.fontWeight,
								width: getColumnWidth('right', index) 
							}"
						>
							{{ item }}
						</view>
					</view>
				</view>
				<view class="kingFlex">
					<block v-for="(item1, index1) in tableHeadRKey" :key="index1">
						<view class="" >
							<uni-swipe-action ref="swipeAction">
							<block v-for="(item, index) in tableData" :key="index">
								<view v-if="item1 === 'opt'" @tap.stop
									:style="{ backgroundColor: isIndex == index ? tableClickCol : '',
										fontSize: getScaledFontSize(),
										width: getColumnWidth('right', index1)
									}" class="tableColmn opt-column">
									<!-- <button @click="toggleSwipe(index)" class="opt-btn upgrade-btn">权限变更</button> -->
									<!-- :show="currentSwipeIndex === index?'right':'none'" -->
									
										<uni-swipe-action-item
											:right-options="swipeOptions"
											:show="currentSwipeIndex === index?'right':'none'"
											@change="onSwipeChange($event, index)"
											@click="onSwipeClick($event, item, index)"
										>
										<view @click="toggleSwipe(index)" class="swipe-content">
											权限变更
										</view>
										</uni-swipe-action-item>
									
									
									<!-- <view class="opt-buttons-container">
										<button @click="upgrade(item, index)" class="opt-btn upgrade-btn">升级</button>
										<button @click="downgrade(item, index)" class="opt-btn downgrade-btn">降级</button>
									</view> -->
								</view>
								
								<view v-else  @tap="currentSwipeIndex=-1"
									@click="getIndex(item[item1], index)"
									@longpress="handleLongPress(item[item1], index1, index)"
									:style="{ backgroundColor: isIndex == index ? tableClickCol : '',
										fontSize: getScaledFontSize(),
										width: getColumnWidth('right', index1)
									}" class="tableColmn">{{ item[item1] }}
								</view>
							</block>
							</uni-swipe-action>
						</view>
					</block>
				</view>
			</view>
		</view>
		<!-- 长按弹框 -->
		<view v-if="showPopup" class="popup-mask" @tap="closePopup">
			<view class="popup-content" @tap.stop>
				<view class="popup-header">
					<text class="popup-title">{{ popupTitle }}</text>
					<text class="popup-close" @tap="closePopup">×</text>
				</view>
				<view class="popup-body">
					<text class="popup-text">{{ popupContent }}</text>
				</view>
				<view class="popup-footer">
					<button class="popup-btn" @tap="closePopup">确定</button>
				</view>
			</view>
		</view>
		
		<!-- 长按弹框 -->
<!-- 		<view v-if="showPopup" class="popup-mask" @tap="closePopup">
			<view class="popup-content" @tap.stop>
				<view class="popup-header">
					<text class="popup-title">{{ popupTitle }}</text>
					<text class="popup-close" @tap="closePopup">×</text>
				</view>
				<view class="popup-body">
					<text class="popup-text">{{ popupContent }}</text>
				</view>
				<view class="popup-footer">
					<button class="popup-btn" @tap="closePopup">确定</button>
				</view>
			</view>
		</view> -->
		
	</view>
</template>

<script>
// 引入 uni-swipe-action 组件
import uniSwipeAction 		from '@/uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem 	from '@/uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.vue';
/**
 * @Date: 2021-05-10
 * @author @拿菜刀砍电线
 * @Description:1、整体构思，左右两部分，可以左右滑动2、左右两部分里面又分上下两部分
 */
export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem
	},
	data() {
		return {
			// 表格高度，一定要给，横屏模式下需要给定高度才能固定表头上下滑动
			tableHeight: null,
			// 是否点击的那一行，为了点击变背景色
			isIndex: null,
			// 长按弹框相关数据 
			showPopup: false,
			popupTitle: '单元格内容',
			popupContent: '',
			// 选中的行索引
			selectedRows: [],
			// 按钮收缩
			isOpened: 'none',
			currentSwipeIndex: -1,
		};
	},
	props: {
		// 主表数据（后端返回来）
		tableData: {
			type: [Array, Boolean],
			default() {
				return [];
			}
		},
		// 左侧表头
		tableHeadL: {
			type: [Array],
			default() {
				return [];
			}
		},
		// 右侧表头
		tableHeadR: {
			type: [Array],
			default() {
				return [];
			}
		},
		// 自定义左侧表头对应的字段（长度一定要跟表头的长度想对应）
		tableHeadLKey: {
			type: [Array],
			default() {
				return [];
			}
		},
		// 自定义右侧表头对应的字段（长度一定要跟表头的长度想对应）
		tableHeadRKey: {
			type: [Array],
			default() {
				return [];
			}
		},
		tableHeadLWidth: {
		  type: Array,
		  default() {
		    return [];
		  }
		},
		tableHeadRWidth: {
		  type: Array,
		  default() {
		    return [];
		  }
		},
		// 默认列宽度，数字，单位rpx
		defaultColumnWidth: {
		  type: Number,
		  default: 50
		},
		// 字体缩放比例
		fontSizeScale: {
		  type: Number,
		  default: 1
		},
		// 表格内容默认字体大小（数字，单位rpx）
		tableContentFontSize: {
			type: Number,
			default: 24
		},
		// 表头的样式
		tableHeadStyle: {
			type: Object,
			default: function() {
				return {
					backgroundColor: 'gold',
					fontSize: '16px',
					fontWeight: '#5ECCBB'  // bold
				};
			}
		},
		// 点击每一行显示的颜色 #5ECCBB  green
		tableClickCol: {
			type: String,
			default: '#5ECCBB'
		},
		// 选中
		showCheckbox: {
			type: Boolean,
			default: false
		},
		checkboxColumnWidth: {
			type: Number,
			default: 50
		},
		// 默认选中的行索引数组
		defaultSelectedRows: {
			type: Array,
			default() {
				return [];
			}
		},
		// 支持长按弹框的右侧列索引数组
		longPressColumns: {
			type: [Array],
			default() {
				return [];
			}
		},
		swipeOptions: {
			type: [Array],
			default() {
				return [];
			}
		}
	},
	created() {
		uni.getSystemInfo({
			success: res => {
				// 给定表格的高度
				this.tableHeight = res.screenHeight - 60 + 'px';
				// console.log("屏幕 res.screenHeight："+res.screenHeight+"；表格高度："+this.tableHeight)
			}
		});
	},
	computed: {
		// 是否全选
		isAllSelected() {
			return this.tableData.length > 0 && this.selectedRows.length === this.tableData.length;
		},
		// isShow(index=-2){
		// 	const show = this.currentSwipeIndex === index?"right":"none";
		// 	console.log("计算展示项 isShow("+index+") ：" + show)
		// 	return show;
		// }
	},
	watch: {
		// 监听默认选中行变化
		defaultSelectedRows: {
			handler(newVal) {
				this.selectedRows = [...newVal];
			},
			immediate: true
		},
		// 监听表格数据变化，重置选中状态
		tableData: {
			handler(newVal) {
				// 如果表格数据变化，清空选中状态
				this.selectedRows = [];
				this.$emit('selection-change', {
					selectedRows: [],
					selectedData: []
				});
			},
			deep: true
		}
	},
	methods: {
		toggleSwipe(index) {
			// console.log("toggleSwipe(index, e) 的 e:"+e)
			console.log("toggleSwipe(index, e) 的 this.currentSwipeIndex:"+this.currentSwipeIndex+"; index:"+index)
			if (this.currentSwipeIndex === index) {
				this.currentSwipeIndex = -1;
			} else {
				this.currentSwipeIndex = index;
			}
			console.log("this.swipeOptions:" + this.swipeOptions)
			console.log("this.swipeOptionsJSON:" + JSON.stringify(this.swipeOptions))
			console.log("toggleSwipe(index, e) 的 this.currentSwipeIndex:"+this.currentSwipeIndex+"; index:"+index)
		},
		
		onSwipeChange(e, index) {
			console.log("e:"+e)
			console.log("e.show:"+e.show+";this.currentSwipeIndex:"+this.currentSwipeIndex+"; index:"+index)
			return
			// 当滑动菜单关闭时，e.show为false，如果当前索引是这一行，则重置为-1
			if (!e.show && this.currentSwipeIndex === index) {
				this.currentSwipeIndex = -1;
			}
		},
		
		onSwipeClick(e, item, index) {
			console.log("onSwipeClick("+e+", "+item+", "+index+")")
			this.isOpened = e
			// e 是选项对象
			this.$emit('swipe-action-click', {
				option: e,
				data: item,
				index: index
			});
			this.currentSwipeIndex = -1;
		},
		// 打开滑动操作
		openSwipeAction(index) {
			console.log("openSwipeAction("+index+")")
			// 关闭之前打开的项目
			if (this.currentOpenIndex !== -1 && this.currentOpenIndex !== index) {
				this.currentOpenIndex = index;
				console.log("打开："+index)
				// this.closeSwipeAction(this.currentOpenIndex);
			}else{
				console.log("关闭："+index)
				this.currentOpenIndex = -1
			}
			return
			// 打开当前项目
			this.$nextTick(() => {
				const swipeAction = this.$refs.swipeAction;
				// debugger
				if (swipeAction && swipeAction[index]) {
					swipeAction[index].open();
					this.currentOpenIndex = index;
				}
			});
		},
		
		// 关闭滑动操作
		closeSwipeAction(index) {
			const swipeAction = this.$refs.swipeAction;
			if (swipeAction && swipeAction[index]) {
				swipeAction[index].close();
				if (this.currentOpenIndex === index) {
					this.currentOpenIndex = -1;
				}
			}
		},
		
		// 滑动操作项点击事件
		onSwipeActionClick(e, item, index) {
			console.log('滑动操作点击:', e, item, index);
			
			// 关闭滑动操作
			this.closeSwipeAction(index);
			
			// 根据点击的选项 value 触发不同的事件
			const optionValue = e.content.value;
			
			// 触发权限变更事件，传递选项值、数据和索引
			this.$emit('permission-change', {
				action: optionValue,
				data: item,
				index: index
			});
			
			// 也可以根据不同的 value 触发不同的事件
			switch(optionValue) {
				case 'upgrade':
					this.$emit('upgrade', { data: item, index: index });
					break;
				case 'downgrade':
					this.$emit('downgrade', { data: item, index: index });
					break;
				// 可以添加更多的 case 来处理其他操作
				default:
					console.log('未知操作:', optionValue);
			}
		},
		setOpened(){
			if (this.isOpened === 'right') {
				this.isOpened = 'none';
				return;
			}
		},
		change(e){
			this.isOpened = e;
			console.log('返回：', e);
		},
		swipeChange(e, index) {
			console.log('返回：', e);
			console.log('当前索引：', index);
		},
		bindClick(e) {
			console.log(e);
			uni.showToast({
				title: `点击了${e.position === 'left' ? '左侧' : '右侧'} ${e.content.text}按钮`,
				icon: 'none'
			});
		},
		// 点击的时候，转换下标
		getIndex(cell, idx) {
			this.$emit('getCellVal',cell);
			this.isIndex = idx;
		},
		getColumnWidth(side, index) {
			const widthArray = side === 'left' ? this.tableHeadLWidth : this.tableHeadRWidth;
			// 获取基础宽度，如果没有设置，则使用默认列宽
			const baseWidth = widthArray[index] !== undefined ? widthArray[index] : this.defaultColumnWidth;
			// 计算实际宽度：基础宽度 * fontSizeScale，然后转换为rpx
			const width = `${baseWidth * this.fontSizeScale}rpx`;
			// console.log("getColumnWidth("+side+","+index+")宽度："+ width)
			return width;
		},
		// // 获取列宽度（将数字转换为rpx单位）
		// getColumnWidth(side, index) {
		// 	const widthArray = side === 'left' ? this.tableHeadLWidth : this.tableHeadRWidth;
		// 	const widthValue = widthArray[index] !== undefined ? widthArray[index] : this.defaultColumnWidth;
		// 	return `${widthValue}rpx`;
		// },
		
		// 获取缩放后的字体大小
		getScaledFontSize(baseFontSize) {
			if (baseFontSize) {
				// 如果传入的是带单位的字符串，如"16px"，则转换为数字并处理
				if (typeof baseFontSize === 'string') {
					const numValue = parseFloat(baseFontSize);
					const unit = baseFontSize.replace(numValue, '');
					// 如果是px单位，转换为rpx（通常1px ≈ 2rpx）
					if (unit === 'px') {
						const fontSize = `${numValue * 2 * this.fontSizeScale}rpx`;
						// console.log("getScaledFontSize("+baseFontSize+")计算结果："+fontSize)
						return fontSize;
					}
					// 如果是rpx单位，直接缩放
					if (unit === 'rpx') {
						const fontSize = `${numValue * this.fontSizeScale}rpx`;
						// console.log("getScaledFontSize("+baseFontSize+")计算结果："+fontSize)
						return fontSize;
					}
					// 其他单位，直接返回原值
					// console.log("getScaledFontSize("+baseFontSize+")计算结果："+baseFontSize)
					return baseFontSize;
				}
			}
			// 默认使用表格内容字体大小
			const fontSize = `${this.tableContentFontSize * this.fontSizeScale}rpx`;
			// console.log("getScaledFontSize("+baseFontSize+")计算结果："+fontSize)
			return fontSize;
		},
		
		// 处理长按事件
		handleLongPress(content, columnIndex, rowIndex) {
			// console.log("触发 handleLongPress("+content+", "+columnIndex+", "+rowIndex+")")
			// console.log("this.longPressColumns.includes(columnIndex): longPressColumns = " + JSON.stringify(this.longPressColumns))
			// 检查当前列是否在支持长按的列索引数组中
			if (this.longPressColumns.includes(columnIndex)) {
				// console.log("执行弹窗：columnIndex = " + columnIndex)
				this.popupTitle = this.tableHeadR[columnIndex];
				this.popupContent = content;
				this.showPopup = true;
				// 触发长按事件
				this.$emit('longpress', {
					content: content,
					columnIndex: columnIndex,
					rowIndex: rowIndex
				});
			}
		},
		// 关闭弹框
		closePopup() {
			this.showPopup = false;
			this.popupTitle = '单元格内容';
			this.popupContent = '';
		},
		// 选择行
		toggleSelect(index, value) {
			console.log("kingTable.toggleSelect() 选择行")
			// 多选模式
			const selectedIndex = this.selectedRows.indexOf(index);
			if (selectedIndex > -1) {
				// 取消选中
				this.selectedRows.splice(selectedIndex, 1);
			} else {
				// 选中
				this.selectedRows.push(index);
			}
			
			// 获取选中的数据
			const selectedData = this.selectedRows.map(idx => this.tableData[idx]);
			
			// 触发选择变化事件
			this.$emit('selection-change', {
				selectedRows: this.selectedRows,
				selectedData: selectedData
			});
		},
		// 全选/取消全选
		toggleSelectAll() {
			console.log("kingTable.toggleSelectAll() 全选/取消全选")
			if (this.isAllSelected) {
				// 取消全选
				this.selectedRows = [];
			} else {
				// 全选
				this.selectedRows = this.tableData.map((_, index) => index);
			}
			
			// 获取选中的数据
			const selectedData = this.selectedRows.map(idx => this.tableData[idx]);
			
			// 触发选择变化事件
			this.$emit('selection-change', {
				selectedRows: this.selectedRows,
				selectedData: selectedData
			});
		},
		
		// 清空选择
		clearSelection() {
			console.log("kingTable.clearSelection() 清空选择")
			this.selectedRows = [];
			this.$emit('selection-change', {
				selectedRows: [],
				selectedData: []
			});
		},
		
		// 获取选中数据
		getSelectedData() {
			console.log("kingTable.getSelectedData() 获取选中数据")
			return this.selectedRows.map(idx => this.tableData[idx]);
		},
		upgrade(item, index) {
		  this.$emit('upgrade', { data: item, index: index });
		},
		downgrade(item, index) {
		  this.$emit('downgrade', { data: item, index: index });
		}
	}
};
</script>

<style lang="scss" scoped>
	.kingTable {
		// 解决刘海屏的问题
		margin-left: var(--status-bar-height);
		// 一定要有，左右滑动的依据
		overflow-x: auto;
		// 改变边框的样式要修改此处
		border-left: 1px solid #000;
		.kingLeftCon {
			// z-index为了解决左右滑动能显示在上层
			z-index: 9;
			left: 0;
			background-color: #ffffff;
		}
	}
	.kingFlex {
		display: flex;
	}
	.kingSticky {
		position: sticky;
		position: -webkit-sticky;
	}
	.tableStyle {
	}
	.tableHead {
		// 改变边框的样式要修改此处
		border-top: 1px solid #000;
	}

	.tableColmn {
		// 改变边框的样式要修改此处
		border-right: 1px solid #000;
		border-bottom: 1px solid #000;
		// width: 50px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 10px;
		color: #333333;
		// // 确保内容不换行
		// white-space: nowrap;
		// overflow: hidden;
		// text-overflow: ellipsis;
	}

	/* 长按弹框样式 */
	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.popup-content {
		width: 600rpx;
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
		background-color: #f8f8f8;
	}

	.popup-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.popup-close {
		font-size: 40rpx;
		color: #999;
		line-height: 1;
	}

	.popup-body {
		padding: 40rpx 30rpx;
		min-height: 120rpx;
		display: flex;
		align-items: center;
	}

	.popup-text {
		font-size: 28rpx;
		color: #333;
		line-height: 1.5;
		word-break: break-all;
	}

	.popup-footer {
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #eee;
		display: flex;
		justify-content: flex-end;
	}

	.popup-btn {
		background-color: #007AFF;
		color: #fff;
		font-size: 28rpx;
		padding: 15rpx 40rpx;
		border-radius: 8rpx;
		border: none;
	}
	
	.opt-column {
		// display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		// height: 100%;
		// padding: 2rpx;
		// box-sizing: border-box;
		position: relative;
	}
	
	.swipe-content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.opt-btn {
		font-size: 25rpx;
		padding: 6rpx 12rpx;
		margin: 0;
		border-radius: 8rpx;
		white-space: nowrap;
		// height: 24px;
		// line-height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
	}
	
	.permission-btn {
		background-color: #007AFF;
		color: white;
	}
	
	// 确保滑动操作项样式正确
	::v-deep .uni-swipe-action {
		width: 100%;
		height: 100%;
	}
	
	::v-deep .uni-swipe-action-content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	::v-deep .uni-swipe-action-group {
		width: 100%;
	}
</style>
