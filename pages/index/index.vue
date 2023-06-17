<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<button class="u-reset-button">王庆波</button>
		<button class="u-reset-button">{{$t('index.language')}}</button>
		<button class="u-reset-button">{{$t('schema.bt.login')}}</button>


		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<uni-card title="基础卡片" :isFull="true" sub-title="副标题" extra="额外信息">
			<text>这是一个通栏卡片 ，通栏没有外边距，左右会贴合父元素。</text>
		</uni-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: ' Hello  QingBo ',
				list: [{
						text: '点赞',
						color: 'blue',
						fontSize: 28
					}, {
						text: '分享'
					}, {
						text: '评论'
					}],
				show: true,
				disabled: true
			}
		},
		onLoad() {
			
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		.u-reset-button{
			color: red;
		}
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}



</style>
