<template>
	<view>
		
		<uni-section title="卡片分组" type="line" height="1300 rpx;">
			
			<uni-group title="card 模式" mode="card" height="500 rpx;">
				<view> 分组内容 </view>
				<view>
				  <uni-section title="预期收益值" type="line">
				    <uni-data-select
				        v-model="value"
				        :localdata="range"
				        @change="change"
				        :clear="false"
				    ></uni-data-select>
				    </uni-section>
					<uni-section title="去除空格" subTitle="使用 trim 属性 ,可以控制返回内容的空格 " type="line" padding>
						<text class="uni-subtitle">输入内容：{{ '"'+value+'"' }}</text>
						<uni-easyinput class="uni-mt-5" trim="all" v-model="value" placeholder="请输入内容" @input="input"></uni-easyinput>
					</uni-section>
				</view>
				<view>
					<uni-table border stripe emptyText="暂无更多数据" >
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="center">日期</uni-th>
							<uni-th align="center">姓名</uni-th>
							<uni-th align="left">地址</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr>
							<uni-td>2020-10-20</uni-td>
							<uni-td>Jeson</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td>2020-10-21</uni-td>
							<uni-td>HanMeiMei</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td>2020-10-22</uni-td>
							<uni-td>LiLei</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td>2020-10-23</uni-td>
							<uni-td>Danner</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
					</uni-table>
				
				 </view>
			</uni-group>
		
			<uni-group mode="card">
				<view>分组1</view>
				<view>分组1</view>
				<view>分组1</view>
				<view>分组1</view>
			</uni-group>
		</uni-section>
		
		
		
		<uni-section title="卡片分组" type="line" height="1300 rpx;">
			
			<uni-group title="card 模式" mode="card" height="500 rpx;">
				<view> 分组内容 </view>
				<view>
				  <uni-section title="预期收益值" type="line">
				    <uni-data-select
				        v-model="value"
				        :localdata="range"
				        @change="change"
				        :clear="false"
				    ></uni-data-select>
				    </uni-section>
					<uni-section title="去除空格" subTitle="使用 trim 属性 ,可以控制返回内容的空格 " type="line" padding>
						<text class="uni-subtitle">输入内容：{{ '"'+value+'"' }}</text>
						<uni-easyinput class="uni-mt-5" trim="all" v-model="value" placeholder="请输入内容" @input="input"></uni-easyinput>
					</uni-section>
				</view>
				<view>
					<uni-table border stripe emptyText="暂无更多数据" >
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="center">日期</uni-th>
							<uni-th align="center">姓名</uni-th>
							<uni-th align="left">地址</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr>
							<uni-td>2020-10-20</uni-td>
							<uni-td>Jeson</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td>2020-10-21</uni-td>
							<uni-td>HanMeiMei</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td>2020-10-22</uni-td>
							<uni-td>LiLei</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td>2020-10-23</uni-td>
							<uni-td>Danner</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
					</uni-table>
				
				 </view>
			</uni-group>
		
			<uni-group mode="card">
				<view>分组1</view>
				<view>分组1</view>
				<view>分组1</view>
				<view>分组1</view>
			</uni-group>
		</uni-section>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">

</style>
