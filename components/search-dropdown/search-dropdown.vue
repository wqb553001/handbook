<template>
  <view class="dropdown">
    <view class="dropdown-input" @click="toggleMenu">
      <input style="font-size: 38rpx;"
        v-model="searchKeyword"
        :placeholder="placeholder"
        @input="onInput"
        @focus="openMenu"
        class="input"
        :disabled="disabled"
      />
	  <span :class="['icon', {'open': showMenu}]">▼</span>
    </view>
    <view v-if="showMenu" class="dropdown-menu-container" >
	  <scroll-view 
	          class="dropdown-menu"
			  ref="scrollContainer"
	          scroll-y="true"
	          :lower-threshold="200"
	          @scrolltolower="loadMore"
	          @scroll="onScroll"
			  :scroll-into-view="scrollToKey"
	        >
	  <view v-if="options.length === 0" class="empty">
		  {{ searchKeyword ? '无匹配项' : '暂无数据' }}
	  </view>
	  <template v-else>
		<view
			v-for="(item, index) in options"
			:key="item.id"
			:class="['dropdown-item', { selected: item.id === innerValue, 'target-item': item.id === targetItemKey }]"
			@click="selectItem(item)"
			:data-index="index"
			:id="'item-' + item.id"
		>
			<span v-html="highlight(item.name, searchKeyword)"></span>
		</view>
		<view v-if="!hasMore && options.length > 0" class="no-more-data">{{noMoreData}}</view>
	  </template>
	  </scroll-view>
    </view>
  </view>
</template>

<script>
	// 模拟uni.request
	const LOCAL_UNI = {
		request: function(options) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const { data } = options;
					const { page, pageSize, keyword } = data;
					
					let allCities = [
						{ value: 'bj', label: '北京北京北京北京北京北京北京北京北京北京北京北京北京北京' },
						{ value: 'sh', label: '上海上海上海上海上海上海上海上海' },
						{ value: 'gz', label: '广州广州广州广州广州广州广州广州广州广州广州广州广州' },
						{ value: 'sz', label: '深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳深圳' },
						{ value: 'cd', label: '成都成都成都成都成都成都成都成都成都成都成都' },
						{ value: 'wh', label: '武汉武汉武汉武汉武汉武汉武汉武汉武汉武汉' },
						{ value: 'hz', label: '杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州' },
						{ value: 'nj', label: '南京南京南京南京南京南京' },
						{ value: 'xa', label: '西安西安西安西安西安西安西安' },
						{ value: 'tj', label: '天津天津天津天津天津天津天津天津天津天津天津天津' },
						{ value: 'cq', label: '重庆' },
						{ value: 'su', label: '苏州' },
						{ value: 'qd', label: '青岛' },
						{ value: 'zz', label: '郑州' },
						{ value: 'cs', label: '长沙' },
						{ value: 'dg', label: '东莞' },
						{ value: 'sy', label: '沈阳' },
						{ value: 'jn', label: '济南' },
						{ value: 'dl', label: '大连' },
						{ value: 'xm', label: '厦门' },
						{ value: 'fs', label: '佛山' },
						{ value: 'wuxi', label: '无锡' },
						{ value: 'ningbo', label: '宁波' },
						{ value: 'hefei', label: '合肥' },
						{ value: 'fuzhou', label: '福州' },
						{ value: 'xiamen', label: '厦门' },
						{ value: 'nanchang', label: '南昌' },
						{ value: 'jinan', label: '济南' },
						{ value: 'zhengzhou', label: '郑州' },
						{ value: 'changsha', label: '长沙' },
						{ value: 'wuhan', label: '武汉' }
					];
					
					// 如果有搜索关键词，过滤数据
					if (keyword) {
						allCities = allCities.filter(city => 
							city.label.includes(keyword)
						);
					}
					
					// 计算分页
					const start = (page - 1) * pageSize;
					const end = start + pageSize;
					const result = allCities.slice(start, end);
					
					resolve({
						data: {
							code: 200,
							data: {
								list: result,
								total: allCities.length
							},
							message: "成功"
						}
					});
				}, 500);
			});
		}
	};
	
	export default {
		name:"SearchDropdown",
		props: {
		    api: 		{ type: String, required: false },
			apiParam:	{ type: Object, required: false },
			autoLoad: 	{ type: Boolean, default: false },
		    fromOptions:{ type: Array,  required: false },
		    value: 		{ type: [String, Number], default: '' },
		    placeholder:{ type: String, default: '请选择' },
		    noMoreData: { type: String, default: '没有更多数据了' },
		    pageSize: 	{ type: Number, default: 10 },
		    disabled: 	{ type: Boolean, default: false },	// 是否可以增删内容
		},
		mounted() {
			if(!this.autoLoad) return;
			// 初始加载数据
			console.log("this.autoLoad: "+this.autoLoad+"; this.fromOptions:"+JSON.stringify(this.fromOptions))
			this.loadData();
			this.updateDisplayText();
		},
		data() {
			return {
				searchKeyword: '',
				showMenu: false,
				options: this.fromOptions,
				loading: false,
				loadingMore: false,
				error: null,
				currentPage: 1,
				total: 0,
				innerValue: this.value,
				debounceTimer: null,
				scrollPosition: 0,		 // 用于记录滚动位置
				previousOptionsLength: 0,
                isProgrammaticScroll: false,
				targetItemKey:null,
				scrollToKey: '', 		// 用于滚动到指定元素
			};
		},
		computed: {
			hasMore() {
				return this.options.length < this.total;
			}
		},
		watch: {
			value(newVal) {
				this.innerValue = newVal;
				// this.updateDisplayText();
			},
			fromOptions(fromOptions) {
				this.options = fromOptions;
			},
			innerValue(newVal) {
				this.$emit('input', newVal);
			},
			options(newVal) {
			  if (this.innerValue) {
			    // this.updateDisplayText();
			  }
			},
		},
		methods: {
		    toggleMenu() {
			  // if (this.disabled) return;
		      this.showMenu = !this.showMenu;
			  if(this.fromOptions) return;
		      if (this.showMenu && this.options?.length === 0) {
				  this.loadData();
			  }
		    },
		    openMenu() {
			  // if (this.disabled) return;
			  this.showMenu = true;
			  if(this.fromOptions) return;
			  if (this.options.length === 0) {
				  this.loadData();
			  }
		    },
		    onInput(e) {
				this.showMenu = true;
				// 如果提供了 选项，就不再请求
				if(this.fromOptions) return;
				this.searchKeyword = e.target.value;
				// 防抖处理
				clearTimeout(this.debounceTimer);
				this.debounceTimer = setTimeout(() => {
					this.options = [];
					this.currentPage = 1;
					this.scrollPosition = 0;
					this.loadData();
				}, 500);
		    },
		    selectItem(item) {
			  this.innerValue = item.id;
			  this.showMenu = false;
			  this.searchKeyword = item.name;
		      this.$emit('input', item.name);// 更新v-model（职业名称）
			  this.$emit('change', item);
			  // this.$emit('update:value', item.value); // 触发 update:value 事件
		    },
		    highlight(label, keyword) {
			  // console.log("点击了 highlight(label)，this.search："+this.search+"；label："+label)
              if (!keyword) return label;
		      // if (!this.search) return label;
		      const reg = new RegExp(`(${keyword})`, 'ig');
		      return label.replace(reg, '<span style="font-weight: bold;">$1</span>');
		    },
			
			// 获取倒数项的key
			getLastItemKey() {
				if (this.options.length < 4) {
					// 如果选项少于2个，返回最后一个项的key
					// return this.options.length > 0 ? this.options[this.options.length - 1].value : null;
					this.anchorKey = this.options.length > 0 ? this.options[this.options.length - 1].value : null;
					return this.anchorKey;
				}
				
				// 返回倒数项的key
				// return this.options[this.options.length - 2].value;
				this.anchorKey = this.options[this.options.length - 4].value;
				return this.anchorKey;
			},
			updateDisplayText() {
				if (this.innerValue && this.options.length > 0) {
				    const selectedOption = this.options.find(option => option.id === this.innerValue);
				    if (selectedOption) {
				      this.displayText = selectedOption.name;
				      this.searchKeyword = selectedOption.name; // 设置输入框的显示值
				      // 滚动到选中项
				      this.scrollToKey = 'item-' + this.innerValue;
				      this.$nextTick(() => {
				        setTimeout(() => {
				          this.scrollToKey = '';
				        }, 500);
				      });
				    }
				  } else {
				    this.displayText = '';
				}
			},
			async loadData() {
				// console.log("加载数据…………")
				this.loading = true;
				this.error = null;
				
				try {
					var params = {
						// keyword: this.searchKeyword,
						// page: this.currentPage,
						// pageSize: this.pageSize
						// searchLike: '%'+this.searchKeyword+'%',
						offset: (this.currentPage-1) * this.pageSize,
						limit: this.pageSize
					};
					if(this.searchKeyword){
						params.searchLike = '%'+this.searchKeyword+'%'
					}
					if(this.apiParam){
						params = { ...params, ...this.apiParam };
					}
					// console.log("this.apiParam 参数："+JSON.stringify(this.apiParam))
					// console.log("/api/job/career/list 接口，请求参数："+JSON.stringify(params))
					
					const response = await new Promise((resolve, reject) => {
						uni.request({
							url: process.env.UNI_BASE_URL+this.api,
							data: params,
							method: 'POST', // 如果需要POST，请添加这一行
							success: (res) => resolve(res),
							fail: (err) => reject(err)
						});
					});
					// 检查响应状态
					if (response.statusCode == 200) {
						const respData = response.data.rows;
						if (this.currentPage === 1) {
							this.options = respData;
						} else {
							this.options.push(...respData);
						}
						this.$emit('options-update', this.options);
						this.total = response.data.total;
					} else {
						throw new Error(response.data.message || '请求失败');
					}
				} catch (err) {
					this.error = err.message || '加载数据失败';
				} finally {
					this.loading = false;
					this.loadingMore = false;
					
					if (this.currentPage > 1) {
						// 加载更多完成后，滚动到锚点位置
						if (this.anchorKey) {
							this.scrollToKey = 'item-' + this.anchorKey;
						}
						this.$nextTick(() => {
							setTimeout(() => {
								this.scrollToKey = '';
								this.anchorKey = null;
							}, 500);
						});
					}
				}
			},
			async loadMore() {
				if (this.loadingMore || !this.hasMore) return;
				// 记录锚点key
				this.getLastItemKey();
				this.loadingMore = true;
				this.currentPage += 1;
				await this.loadData();
			},
			onScroll(e) {
				// if(this.options?.length>0){
				// 	this.hasMore = false;
				// }
				// 添加滚动节流，防止频繁触发
				// console.log("添加滚动节流，防止频繁触发----------this.hasMore:"+this.hasMore+";this.loadingMore:"+this.loadingMore)
				const now = Date.now();
				if (now - this.lastScrollTime < 100) return;
				this.lastScrollTime = now;
				
				const { scrollTop, scrollHeight, clientHeight } = e.target;
				const distance = scrollHeight - scrollTop - clientHeight;
				// 滚动到底部时自动加载更多
				if (distance < 100 && this.hasMore && !this.loadingMore) {
					this.loadMore();
				}
			},
			getOptions() {
				return this.options;
			},
			
			// 设置选中的careerId
			setSelected(careerId) {
				this.innerValue = careerId;
				this.updateDisplayText();
				
				// 触发input事件更新v-model
				this.$emit('input', careerId);
				
				// 触发change事件
				const selectedOption = this.options.find(option => option.id === careerId);
				if (selectedOption) {
					this.$emit('change', selectedOption);
				}
				
				return true;
			},
			// 清除选择
			clearSelection() {
				this.innerValue = '';
				this.displayText = '';
				this.$emit('input', '');
				this.$emit('change', null);
			}
		},
	}
</script>

<style scoped>
/* .dropdown {
  position: relative;
  width: 100%;
  margin-bottom: 24rpx;
}
.dropdown-input {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  border: 1rpx solid #eee;
  padding: 0 24rpx;
  height: 80rpx;
  font-size: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}
.input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 28rpx;
  outline: none;
}
.icon {
  margin-left: 12rpx;
  color: #bbb;
  font-size: 28rpx;
}
.dropdown-menu {
  position: absolute;
  left: 0; right: 0; top: 90rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08);
  z-index: 100;
  max-height: 400rpx;
  overflow-y: auto;
  animation: fadeIn 0.2s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10rpx); }
  to { opacity: 1; transform: translateY(0); }
}
.dropdown-item {
  padding: 22rpx 28rpx;
  font-size: 38rpx;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
}
.dropdown-item.selected {
  background: #e6f7ff;
  color: #007aff;
}
.dropdown-item:active {
  background: #f0faff;
}
.hl {
  color: #ff4d4f;
  font-weight: bold;
}
.empty {
  text-align: center;
  color: #bbb;
  padding: 32rpx 0;
  font-size: 26rpx;
} */

/* * {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
} */
/* body {
	font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
	padding: 20px;
	color: #333;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
} */

.dropdown {
	position: relative;
	width: 100%;
	margin-bottom: 24px;
}
.dropdown-input {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 12px;
	border: 1px solid #dcdfe6;
	padding: 0 20px;
	height: 50px;
	font-size: 16px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.05);
	transition: all 0.3s;
}
.dropdown-input:focus-within {
	border-color: #409eff;
	box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}
/* .input {
	flex: 1;
	border: none;
	background: transparent;
	font-size: 16px;
	outline: none;
	height: 100%;
	color: #333;
} */
.input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 28rpx;
  outline: none;
  height: 100%;
  color: #333;
}
/* .icon {
	margin-left: 10px;
	color: #bbb;
	font-size: 12px;
	transition: transform 0.3s;
} */
.icon {
  margin-left: 12rpx;
  color: #bbb;
  font-size: 28rpx;
  transition: transform 0.3s;
}
.icon.open {
	transform: rotate(180deg);
}
/* 外层容器 */
.dropdown-menu-container {
  position: absolute;
  left: 0; 
  right: 0; 
  top: 90rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  z-index: 100;
  /* max-height: 400rpx; */
  height: 200px;
  overflow: hidden;
  border: 1rpx solid #e4e7ed;
  animation: fadeIn 0.2s;
}
/* 滚动区域 */
.dropdown-menu {
/* 	position: absolute;
	left: 0; 
	right: 0; 
	top: 55px;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0,0,0,0.1);
	z-index: 100;
	max-height: 300px;
	overflow-y: auto;
	animation: fadeIn 0.2s;
	border: 1px solid #e4e7ed; */
	
	  height: 100%;
	  overflow-y: auto;
	  padding: 5px 0;
	  scroll-behavior: smooth; /* 添加平滑滚动效果 */
	  transition: scroll-top 0.5s ease;
	  background: #fff;
	  border-radius: 12rpx;
	  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08);
	  border: 1rpx solid #e4e7ed;
}
/* 自定义滚动条样式 */
.dropdown-menu::-webkit-scrollbar {
	width: 8px;
}
.dropdown-menu::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 4px;
}
.dropdown-menu::-webkit-scrollbar-thumb {
	background: #c1c1c1;
	border-radius: 4px;
}
.dropdown-menu::-webkit-scrollbar-thumb:hover {
	background: #a8a8a8;
}
@keyframes fadeIn {
	from { opacity: 0; transform: translateY(-10px); }
	to { opacity: 1; transform: translateY(0); }
}
.dropdown-item {
/* 	padding: 12px 16px;
	font-size: 16px;
	color: #333;
	cursor: pointer;
	transition: background 0.2s;
	border-bottom: 1px solid #f5f7fa; */
	
	
	  padding: 22rpx 28rpx;
	  font-size: 38rpx;
	  color: #333;
	  cursor: pointer;
	  transition: background 0.2s;
}
.dropdown-item:last-child {
	border-bottom: none;
}
.dropdown-item.selected {
	background: #e6f7ff;
	color: #007aff;
}
.dropdown-item:active {
  background: #f0faff;
}
.dropdown-item:hover {
	background: #f5f7fa;
}
.hl {
	color: #ff4d4f;
	font-weight: bold;
}
.empty {
	text-align: center;
	color: #bbb;
	padding: 20px 0;
	font-size: 14px;
}
.loading-more, .no-more-data {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 26rpx;
}
.loading {
	text-align: center;
	padding: 12px;
	color: #909399;
	font-size: 14px;
}
.loading i {
	margin-right: 6px;
	animation: spin 1s linear infinite;
}
@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
.load-more {
	text-align: center;
	padding: 12px;
	color: #409eff;
	font-size: 14px;
	cursor: pointer;
	transition: background 0.2s;
}
.load-more:hover {
	background: #f5f7fa;
}
.error {
	text-align: center;
	color: #f56c6c;
	padding: 12px;
	font-size: 14px;
}
.retry-btn {
	margin-top: 8px;
	padding: 6px 12px;
	background: #f56c6c;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 12px;
}
.result {
	margin-top: 20px;
	padding: 15px;
	background: #f9f9f9;
	border-radius: 8px;
	font-size: 16px;
	line-height: 1.6;
}
.result strong {
	color: #2c3e50;
}
.info-panel {
	background: #e7f3ff;
	border-left: 4px solid #1890ff;
	padding: 15px;
	margin: 20px 0;
	border-radius: 8px;
	font-size: 14px;
	line-height: 1.6;
}

</style>