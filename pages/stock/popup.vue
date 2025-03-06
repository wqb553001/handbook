<template>
	<view  >
		<uni-section>
			<view >
				<button class="button popup-success" @click="messageToggle('success')"><text
						class="button-text success-text">成功</text></button>
			</view>
		</uni-section>


		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="duration"></uni-popup-message>
			</uni-popup>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'center',
				msgType: 'success',
				messageText: '这是一条成功提示',
				value: '',
				duration: 2000
			}
		},
		onReady() {},
		methods: {
			messageToggle(type) {
				this.msgType = type
				this.messageText = `这是一条${type}消息提示`
				this.$refs.message.open()
			}
		}
	}
</script>
<style lang="scss">
	
</style>
