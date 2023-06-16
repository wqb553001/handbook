<template>
		<scroll-view scroll-y="true" style="height: 630rpx;">
			<view v-for="work_flow in work_flows" style="margin: 50rpx;hebackground-color: #EFE3E1;">
				<text style="width:360rpx; display:flex; font-size:20px;margin-left: 20rpx;">{{work_flow.theme}}：</text>
				<view style="text-indent: 2em; background-color: #F8F9F9;">{{work_flow.content}}</view>
			</view>
		</scroll-view>

		<text style="margin-left:20rpx;">评论、吐槽：</text>
		<editor style="width: 90%;height: 2%;border:1px solid #EFE3E1;margin: 10rpx 20rpx 10rpx 20rpx;"></editor>
		<!-- <editor style="position:absolute;width: 90%;height: 100rpx;border:1px solid #EFE3E1;margin: 10rpx 30rpx 10rpx 20rpx;"></editor> -->
		<navigator url="../dialogue/dialogue.vue" v-if="1==1" open-type="navigate">
			<button >意见或建议</button>
		</navigator>
		
</template>

<script>
	export default {
		data() {
			return {
				method_name:'工作流程',
				work_flows:[
					{theme:'请示工作说方案',content:'不要让老板做问答题，而是要让老板做选择题。请示工作至少保证给老板两个方案，并表达自己的看法'},
					{theme:'汇报工作说结果',content:'不要告诉老板工作过程多艰辛，你多么不容易！老板不傻，否则做不到今天。举重若轻的人老板最喜欢，一定要把结果给老板，结果思维是第一思维。'},
					{theme:'总结工作说流程',content:'做工作总结要描述流程，不只是先后顺序逻辑清楚，还要找出流程中的关键点、失误点、反思点。'},
					{theme:'布置工作说标准',content:'工作有布置就有考核，考核就要建立工作标准，否则下属不知道如何做，做到什么程度才是最合适的。标准既确立了规范，又划定了工作的边界。'},
					{theme:'关心下级问过程',content:'关心下级就是关心细节，要注意聆听他们的问题，让其阐述越详细做好，明确让下级感动的点和面。'},
					{theme:'交接工作讲道德',content:'把工作中形成的经验教训毫不保留的交接给继任者，把完成的与未竟的工作分类逐一交接，不要设置障碍，使其迅速进入工作角色。'},
					{theme:'回忆工作说感受',content:'交流多说自己工作中的感悟，哪些是学到的，哪些是悟到的，哪些是反思的，哪些是努力的。'},
					{theme:'领导工作别瞎忙',content:'如果作为领导者的你很忙，不妨问问自己：我在忙什么？有多大价值？这件事别人会不会做？我为什么会这么忙？'}
				]
			};
		},
		methods:{
			
		},
		mounted(){
			uni.setNavigationBarTitle({
				title:this.method_name+" 详情",
				})
		},
		
	}
</script>

<style lang="scss">

</style>
