<template>
	<jobList ref="jobListRef" @stop-pull-down="stopPullDown" :api-base-url="apiBaseUrl" :show-where-banner="showWhereBanner" ></jobList>
</template>

<script>
	import jobList from '@/components/job-list/job-list.vue';
	
	export default {
        components: { jobList },
		data() {
			return {
				apiBaseUrl: process.env.UNI_BASE_URL + '/api/job/searchStore', // 传入API基础URL
				showWhereBanner: 1,	// 列工：0；我的收藏：1
			};
		},
		onUnload() {
			// 避免泄露，结束卸载监听
			uni.$off('acceptAddress');
		},
		onPullDownRefresh() {
			// console.log("父页面下拉刷新");
			// 调用子组件的刷新方法
			if (this.$refs.jobListRef) {
				this.$refs.jobListRef.handlePullDownRefresh();
			}
		},
		onReachBottom() {
			// console.log("父页面上拉触底");
			if (this.$refs.jobListRef) {
				this.$refs.jobListRef.getList();
			}
		},
		methods: {
			stopPullDown() {
				uni.stopPullDownRefresh();
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
				url: '/pages/job/user/history_record'
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
	
</style>
