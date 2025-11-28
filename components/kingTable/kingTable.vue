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
							<block v-for="(item, index) in tableData" :key="index">
								<view v-if="item1 === 'opt'" @tap.stop
									:style="{ backgroundColor: isIndex == index ? tableClickCol : '',
										fontSize: getScaledFontSize(),
										width: getColumnWidth('right', index1)
									}" class="tableColmn opt-column">
									<view @click="toggleSwipe(item, index)" class="swipe-content">
										权限变更
									</view>
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
		<view v-if="showPopupLevel" class="popup-mask" @tap="closePopupLevel">
			<view class="popup-content" @tap.stop>
			  <view class="popup-header">
				<text class="popup-title">{{ popupTitleLevel }}</text>
				<text class="popup-close" @tap="closePopupLevel">×</text>
			  </view>
			  
			  <!-- 多选选项区域 -->
			  <view class="popup-body popup-level-body">
				<scroll-view 
				  class="dropdown-menu popup-level-menu"
				  scroll-y="true"
				  :lower-threshold="200"
				>
				  <template>
					<view
					  v-for="(item, index) in levelSettingOptions"
					  :key="item.value"
					  :class="['dropdown-item', 'level-item', { 
						selected: isLevelSelected(item.value) 
					  }]"
					  @click="toggleLevelSelection(item)"
					>
					  <!-- 多选复选框 -->
					  <view class="checkbox-wrapper">
						<view :class="['checkbox', { checked: isLevelSelected(item.value) }]">
						  <text v-if="isLevelSelected(item.value)" class="checkmark">✓</text>
						</view>
					  </view>
					  
					  <!-- 权限文本 -->
					  <view class="level-text">
						<!-- <text class="level-name" v-html="highlight(item.text, searchKeywordLevel)"></text> -->
						<text v-if="item.desc" class="level-desc">{{ item.desc }}</text>
						<text v-else class="level-desc">{{ item.text }}</text>
					  </view>
					</view>
					
				  </template>
				</scroll-view>
			  </view>
			  
			  <!-- 底部按钮 -->
			  <view class="popup-footer popup-level-footer">
				<button class="popup-btn popup-btn-cancel" @tap="cancelLevelSelection">取消</button>
				<button class="popup-btn popup-btn-confirm" @tap="confirmLevelSelection">确定</button>
			  </view>
			</view>
		</view>
		
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
			showPopupLevel: false,
			popupTitleLevel: '权限变更',
			popupContentLevel: '',
			
			// 选中的行索引
			selectedRows: [],
			// 按钮收缩
			isOpened: 'none',
			currentSwipeIndex: -1,
			
			// 权限多选相关数据
			currentLevelIndex: -1,
			currentLevelId: 0,
			selectedLevels: [], // 存储选中的权限值数组
			preLevel: 0,
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
		exclusiveGroups: {
			type: [Array],
			default() {
				return [[]];
			}
		},
		levelSettingOptions: {
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
	mounted() {
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
		// 打开权限选择弹窗
		openLevelPopup() {
		  this.showPopupLevel = true;
		  // 初始化选中状态
		  this.updateLevelSelectionFromValue();
		},
		
		// 关闭弹窗
		closePopupLevel() {
		  this.showPopupLevel = false;
		},
		
		// 取消选择
		cancelLevelSelection() {
		  this.closePopupLevel();
		  // 可以在这里重置选择状态
		  this.selectedLevels = [];
		},
		
		// 确认选择
		confirmLevelSelection() {
		  // 计算最终的level值（位运算或）
		  let sumLevel = this.selectedLevels.reduce((sum, level) => sum | level, 0);
		  if(this.preLevel == sumLevel){
			  uni.showToast({
			      title: '未做任何修改！',
			      icon: 'none'
			  });
			this.closePopupLevel();
			return;
		  }
		  // 假设互斥分组为 [1,2,4,8] 和 [16,32]（根据你的需求调整）
		  // const exclusiveGroups = [
			 //  [2, 4], // 第一个互斥分组
			 //  [16, 32] // 第二个互斥分组，如果有的话
		  // ];// 如果处理后的权限和原选中的权限不同，说明有互斥被处理了，我们可以提示用户
		  // console.log("假设互斥分组为："+JSON.stringify(this.exclusiveGroups))
		  const processedLevels = this.resolveExclusiveLevels(this.selectedLevels, this.exclusiveGroups);
		  // console.log("修改前："+JSON.stringify(this.selectedLevels))
		  // console.log("修改后："+JSON.stringify(processedLevels))
		  
		   if (processedLevels.length != this.selectedLevels.length) {
		  	 // console.log("提示用户，例如：‘由于权限互斥，已自动为您调整选中权限。’")
		     // 提示用户，例如："由于权限互斥，已自动为您调整选中权限。"
		     uni.showToast({
				title: '已完成修改！  由于权限互斥，已自动为您调整选中权限。',
				icon: 'none',
				mask: true,
				duration: 3000
		     });
		   }else{
			   uni.showToast({
			       title: '已完成修改！',
			       icon: 'success'
			   });
		   }
		  this.selectedLevels = processedLevels;
		  sumLevel = this.selectedLevels.reduce((sum, level) => sum | level, 0);
		  // 触发事件
		  this.$emit('level-change-confirm', {
			level: sumLevel,
			selectedLevels: this.selectedLevels,
			userId: this.currentLevelId,
			levelText: this.getLevelText(sumLevel)
		  });

		  this.closePopupLevel();
		},
		
		// 切换权限选择状态
		toggleLevelSelection(item) {
		  const levelValue = item.value;
		  const index = this.selectedLevels.indexOf(levelValue);
		  
		  if (index > -1) {
			// 如果已选中，则移除
			this.selectedLevels.splice(index, 1);
		  } else {
			// 如果未选中，则添加
			this.selectedLevels.push(levelValue);
		  }
		},
		
		// 检查权限是否被选中
		isLevelSelected(levelValue) {
		  return this.selectedLevels.includes(levelValue);
		},
		
		// 从level值解析选中的权限
		updateLevelSelectionFromValue() {
		  // 假设 this.currentLevel 是当前的权限值
		  if (this.currentLevel) {
			this.selectedLevels = [];
			this.levelSettingOptions.forEach(item => {
			  if ((this.currentLevel & item.value) === item.value) {
				this.selectedLevels.push(item.value);
			  }
			});
		  }
		},
		// // 高亮搜索文本
		// highlight(label, keyword) {
		//   if (!keyword) return label;
		//   const reg = new RegExp(`(${this.escapeRegExp(keyword)})`, 'ig');
		//   return label.replace(reg, '<span style="color: #007aff; font-weight: bold;">$1</span>');
		// },
		
		// // 转义正则表达式特殊字符
		// escapeRegExp(string) {
		//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		// },
		
		// 根据level值获取权限文本
		getLevelText(level) {
		  if (!level) return '';
		  const permissions = [];
		  this.levelSettingOptions.forEach(item => {
			if ((level & item.value) === item.value) {
			  permissions.push(item.text);
			}
		  });
		  return permissions.join(', ');
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
		            permissions.push(item.value);
		        }
		    });
		    
		    return returnType === 'string' ? permissions.join(separator) : permissions;
		},
		// 以前的
		toggleSwipe(item, index) {
			this.preLevel = item.levelValue
			this.selectedLevels = this.parseLevel(item.levelValue, this.levelSettingOptions, { returnType: 'array' })
			// console.log("选中值："+ JSON.stringify(this.selectedLevels))
			this.currentLevelIndex = index;
			this.currentLevelId = item.userId
			// console.log("选中对象："+JSON.stringify(item))
			this.openLevelPopup();
			// console.log("this.levelSettingOptions:" + this.levelSettingOptions)
			// console.log("this.levelSettingOptionsJSON:" + JSON.stringify(this.levelSettingOptions))
			// console.log("toggleSwipe(index, e) 的 this.currentSwipeIndex:"+this.currentSwipeIndex+"; index:"+index)
		},
		// 互斥分组取最大值
		resolveExclusiveLevels(selectedLevels, exclusiveGroups) {
			// 创建副本，避免修改原数组
			let result = [...selectedLevels];
			
			exclusiveGroups.forEach(group => {
			  // 找出当前分组与result的交集
			  const intersection = result.filter(level => group.includes(level));
			  if (intersection.length > 1) {
				// 找到交集的最大值
				const maxInGroup = Math.max(...intersection);
				// 将交集中除最大值外的其他权限从result中移除
				result = result.filter(level => !group.includes(level) || level === maxInGroup);
			  }
			});
			
			return result;
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
		// 关闭弹框
		closePopupLevel() {
			this.showPopupLevel = false;
			this.popupTitleLevel = '权限变更';
			this.popupContentLevel = '';
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
		// 确保内容不换行
		white-space: nowrap;      /* 不换行 */
		overflow: hidden;         /* 隐藏溢出 */
		text-overflow: ellipsis;  /* 显示省略号 */
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
		padding: 30rpx 30rpx 30rpx 240rpx;
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
		color: green;
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
	
	
	/* 搜索区域 */
	.popup-search-container {
	  padding: 24rpx 32rpx 0;
	}
	
	.popup-search-input {
	  margin-bottom: 0;
	}
	
	/* 弹窗主体 - 权限选择区域 */
	.popup-level-body {
	  flex: 1;
	  padding: 0;
	  min-height: 400rpx;
	  max-height: 600rpx;
	}
	
	.popup-level-menu {
	  height: 600rpx;
	  max-height: none;
	  border: none;
	  box-shadow: none;
	  border-radius: 0;
	}
	
	/* 权限选项样式 */
	.level-item {
	  display: flex;
	  align-items: flex-start;
	  padding: 24rpx 32rpx;
	  border-bottom: 1rpx solid #f5f5f5;
	}
	
	.level-item:last-child {
	  border-bottom: none;
	}
	
	.level-item.selected {
	  background-color: #f0f8ff;
	}
	
	/* 复选框样式 */
	.checkbox-wrapper {
	  margin-right: 20rpx;
	  margin-top: 4rpx;
	}
	
	.checkbox {
	  width: 36rpx;
	  height: 36rpx;
	  border: 2rpx solid #ddd;
	  border-radius: 6rpx;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  transition: all 0.3s;
	}
	
	.checkbox.checked {
	  background-color: #007aff;
	  border-color: #007aff;
	}
	
	.checkmark {
	  color: white;
	  font-size: 24rpx;
	  font-weight: bold;
	}
	
	/* 权限文本样式 */
	.level-text {
	  flex: 1;
	  display: flex;
	  flex-direction: column;
	}
	
	.level-name {
	  font-size: 32rpx;
	  color: #333;
	  line-height: 1.4;
	}
	
	.level-desc {
	  font-size: 24rpx;
	  color: #999;
	  margin-top: 8rpx;
	  line-height: 1.3;
	}
	
	/* 弹窗底部按钮 */
	.popup-level-footer {
	  display: flex;
	  justify-content: space-between;
	  padding: 24rpx 32rpx;
	  border-top: 1rpx solid #f0f0f0;
	  gap: 20rpx;
	}
	
	.popup-btn {
	  flex: 1;
	  padding: 20rpx;
	  border: none;
	  border-radius: 12rpx;
	  font-size: 32rpx;
	  cursor: pointer;
	  transition: all 0.3s;
	}
	
	.popup-btn-cancel {
	  background-color: #f5f5f5;
	  color: #333;
	}
	
	.popup-btn-cancel:active {
	  background-color: #e8e8e8;
	}
	
	.popup-btn-confirm {
	  background-color: #007aff;
	  color: white;
	}
	
	.popup-btn-confirm:active {
	  background-color: #0056cc;
	}
	
	/* 空状态和加载更多 */
	.empty, .no-more-data {
	  text-align: center;
	  padding: 60rpx 32rpx;
	  color: #999;
	  font-size: 28rpx;
	}
	
	/* 响应式调整 */
	@media (max-width: 750rpx) {
	  .popup-content {
	    width: 90%;
	    max-width: none;
	  }
	  
	  .popup-level-body {
	    max-height: 500rpx;
	  }
	}
	.checkbox-group {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 10px;
	}
	.checkbox-item {
		display: flex;
		align-items: center;
		background: #f5f7fa;
		padding: 6px 12px;
		border-radius: 4px;
		transition: all 0.3s;
		cursor: pointer;
	}
	.checkbox-item:hover {
		background: #e6f7ff;
		transform: translateY(-2px);
	}
	.checkbox-item input {
		margin-right: 6px;
		cursor: pointer;
	}
	.checkbox-item.selected {
		background: #007aff;
		color: white;
	}
</style>
