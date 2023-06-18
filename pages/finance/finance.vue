<template>
	<view class="container">
		
		<uni-card title="基础卡片" :isFull="true" sub-title="副标题" extra="额外信息">
			<text>这是一个通栏卡片 ，通栏没有外边距，左右会贴合父元素。</text>
		</uni-card>
		<uni-card :is-shadow="false" is-full>
			<text class="uni-h6">分组组件可用于将组件分组，添加间隔，以产生明显的区块。</text>
		</uni-card>
		<uni-section title="基础分组" type="line">
			<uni-group>
				<view class="warp">
					<view class="box">
						<view class="title">示例：10000$</view>
						<t-table @change="change">
							<t-tr>
								<t-th>编号				</t-th>
								<t-th>预期收益值（%）		</t-th>
								<t-th>建议出手收益值（%）	</t-th>
								<t-th>建议投入资金占比（%）	</t-th>
								<t-th>投入资金额			</t-th>
							</t-tr>
							<t-tr v-for="item in tableList" :key="item.id">
								<t-td>{{ item.id + 1 				}}</t-td>
								<t-td>{{ item.expect_value 			}}</t-td>
								<t-td>{{ item.advise_value 			}}</t-td>
								<t-td>{{ item.advise_invest_ratio 	}}</t-td>
								<t-td>{{ item.advise_invest_money 	}}</t-td>
							</t-tr>
						</t-table>
					</view>
					
				</view>
			</uni-group>
			<uni-group title="基本模式" margin-top="20">
				<view>
				  <uni-section title="是否可清除已选项" type="line">
				        <uni-data-select
				          v-model="value"
				          :localdata="range"
				          @change="change"
				          :clear="false"
				        ></uni-data-select>
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
		</uni-section>
		<uni-section title="卡片分组" type="line" height="1300 rpx;">
			

			<uni-group title="card 模式" mode="card" height="500 rpx;">
				<view> 分组内容 </view>
				<view>
				  <uni-section title="是否可清除已选项" type="line">
				        <uni-data-select
				          v-model="value"
				          :localdata="range"
				          @change="change"
				          :clear="false"
				        ></uni-data-select>
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
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	
	export default {
		components: {
			tTable
			,tTh
			,tTr
			,tTd
		},
		data() {
			return {
				tableList: [// 示例金额：10000$
					// 	编号	|预期收益值（%）			|建议出手收益值（%）			|投入资金占比（%）				|投入资金额				
					{id: 0, expect_value: '1~5', 		advise_value: '+3	|-2', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 1, expect_value: '5~10', 		advise_value: '+8	|-2', 	advise_invest_ratio: '20', 		advise_invest_money: '2000' },
					{id: 2, expect_value: '10~20', 		advise_value: '+14	|-2', 	advise_invest_ratio: '20', 		advise_invest_money: '2000' },
					{id: 3, expect_value: '20~50', 		advise_value: '+35	|-2', 	advise_invest_ratio: '15', 		advise_invest_money: '1500' },
					{id: 4, expect_value: '50~100', 	advise_value: '+60	|-8', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 5, expect_value: '100~200', 	advise_value: '+120	|-10', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 6,	expect_value: '200~500',	advise_value: '+200	|-50',	advise_invest_ratio: '10',		advise_invest_money: '1000'	},
					{id: 7,	expect_value: '>500',		advise_value: '+300	|-50',	advise_invest_ratio: '5',		advise_invest_money: '500'	}
				]
				,value: 0
				,range: [
					{ value: 0, text: "篮球" },
					{ value: 1, text: "足球" },
					{ value: 2, text: "游泳" },
				]
				,
			};
		},
		onReady() {

		},
		methods: {
			change(e) {
				console.log(e.detail);
			},
			edit(item) {
				uni.showToast({
					title: item.name,
					icon: 'none'
				});
			}
			,open(){
				this.$refs.calendar.open();
			}
			,confirm(e) {
				console.log(e);
			}
		}
	}
</script>

<style lang="scss">
	// @import "uview-ui/index.scss";
	// table
	.title {
		font-size: 32upx;
		color: #666;
	}
	.box {
		margin: 20upx;
	}

	button {
		font-size: 24upx;
	}
	// 未生效
	// table{table-layout:fixed;}
	// table tr td:first-child,table tr td:first-child{width:20rpx;}
	
	// group
	.uni-wrap {
		flex-direction: column;
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		/* #ifndef H5 */
		height: 100vh;
		/* #endif */
		flex: 1;
	}
	
	.scroll {
		flex-direction: column;
		flex: 1;
	}
	
	.example-body {
		padding: 0;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}
	
	// select
	.text {
	  font-size: 12px;
	  color: #666;
	  margin-top: 5px;
	}

	.uni-px-5 {
	  padding-left: 10px;
	  padding-right: 10px;
	}

	.uni-pb-5 {
	  padding-bottom: 10px;
	}
</style>
