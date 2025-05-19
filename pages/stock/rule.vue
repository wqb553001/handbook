<template>
	<view class="container">
		<view>
			<uni-card title="人生劝勉" :isFull="true" sub-title="投资有风险" extra="today 你笑了么 (*￣︶￣) !!">
				<text>投资什么？都不抵投资健康！（开发者邮箱：wangqingbo0829@163.com）</text>
			</uni-card>
			<uni-card :is-shadow="false" is-full>
				<text class="uni-h6">人生最赚的生活方式：是悠闲！</text>
			</uni-card>
		</view>
		
		<uni-section title="习惯设置" type="line" style="background-color: #eee;">
		  <uni-forms border>
			<uni-forms-item label="字体颜色:" labelWidth="82px" id="colorRadio" >
				<!-- <input type="radio" name="selectedColor" v-model="selectedColorValue" value="1" >红涨绿跌</input>
				<input type="radio" name="selectedColor" v-model="selectedColorValue" value="2" >红跌绿涨</input>
				<input type="radio" name="selectedColor" v-model="selectedColorValue" value="0" >不设置</input> -->
				<radio-group @change="radioColorChange" class="value checked" style="font-size: 13px;">
					<label class="radio">
						<radio style="zoom: 0.8;" value="1" :checked="selectedColorValue == '1'" />红涨绿跌
					</label>                      
					<label class="radio">         
					    <radio style="zoom: 0.8;" value="2" :checked="selectedColorValue == '2'" />红跌绿涨
					</label>                      
					<label class="radio">         
					    <radio style="zoom: 0.8;" value="0" :checked="selectedColorValue == '0'" />不区分
					</label>
				</radio-group>
			</uni-forms-item>
		  </uni-forms>
		</uni-section>
		
		<uni-section title="试算" type="line" style="background-color: #eee;"> 
			<uni-group :style="{ display: 'none' }">
				<uni-card :is-shadow="false" is-full>
					<text class="uni-h2">服务到期，请联系管理员！</text>
				</uni-card>
				<uni-card :is-shadow="false" is-full>
					<text class="uni-h6">联系方式：wangqingbo0829@163.com</text>
				</uni-card>
				<uni-card :is-shadow="false" is-full>
					<button @click="change" class="popup-success warn-text" style="padding-left:0.5rem; width: 100%;height: 2rem;" size="default" type="primary" >刷新</button>
				</uni-card>
			</uni-group>
			
			<uni-group title="投资信息:" :style="{ display: stock_display }">
				<view>
				  <uni-forms border>
					<uni-forms-item label="做多做空:" labelWidth="82px">
						<uni-data-select @change="selectUpOrDownChange" v-model="selectUpOrDownValue" :localdata="selectUpOrDownRange" :clear="false" ></uni-data-select>
					</uni-forms-item>
				  </uni-forms>
				  <uni-forms border>
					 <uni-forms-item label="区间界限:" labelWidth="82px">
						<uni-easyinput @change="inputeExpectEndChange" v-model="expectEnd" :inputBorder="true" placeholder="预期收益区间界限(%)" type="number"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				  
				  <uni-forms border>
					 <uni-forms-item :label="benifitRatio+':'" labelWidth="82px">
						<uni-easyinput @change="inputUpRatioChange" v-model="upRatio" :inputBorder="true" :placeholder="benifitRatio+'(%)'" type="number"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				  <uni-forms border>
					 <uni-forms-item :label="lossRatio+':'" labelWidth="82px">
						<uni-easyinput @change="inputDownRatioChange" v-model="downRatio" :inputBorder="true" :placeholder="lossRatio+'(%)'" type="number"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				
				  <uni-forms border>
					<uni-forms-item label="投入占比:" labelWidth="82px">
						<uni-easyinput @change="inputadviseInvestRatioChange" v-model="adviseInvestRatio" :inputBorder="true" placeholder="建议投入资金占比(%)" type="number"></uni-easyinput>
					</uni-forms-item>
				  </uni-forms>
				</view>
			</uni-group>
			
			<view>
				<uni-group title="设置规则" >
					<view class="warp">
						<view class="box">
							<t-table @change="change">
								<t-tr>
									<t-th>区间界限（%）	</t-th>
									<t-th>{{benifitRatio+'(%)'	}}	</t-th>
									<t-th>{{lossRatio+'(%)'		}}	</t-th>
									<t-th>投入占比（%）		</t-th>
									<t-th>操作				</t-th>
								</t-tr>
								<t-tr v-for="(item, index) in tableRuleShowData" :key="index+1">
									<t-td>{{ item.expectEnd  		}}</t-td>
									<t-td>
										<span :style="fontColor.up">{{ benifitFlag 	+ item.upRatio}}</span>
									</t-td>
									<t-td>
										<span :style="fontColor.down" >{{lossFlag + item.downRatio}}</span>
									</t-td>
									<t-td>{{ item.adviseInvestRatio  }}</t-td>
									<t-td style="text-align: center;">
										<view class="uni-group">
											<button @tap="addOrUpdateOne(item, 'addOne')" class="uni-button" size="mini" type="primary" v-if="isNewExpectEnd">新收</button>
											<button @tap="addOrUpdateOne(item, 'updateOne')" class="uni-button" size="mini" type="warn" v-if="isNewExpectEnd==false" id="reClick">更新</button>
										</view>
									</t-td>
								</t-tr>
							</t-table>
						</view>
					</view>
				</uni-group>
			</view>
		</uni-section>
		
		<uni-section title="展示" type="line" style="background-color: #eee;">
			<uni-group title="做多规则:" style="background-color: #FCDAD5;">
				<uni-table border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th style="width: 60px;">序号					</uni-th>
						<uni-th style="min-width: 60px;">预期收益值（%）		</uni-th>
						<uni-th style="min-width: 80px;">建议出手收益值（%）	</uni-th>
						<uni-th style="min-width: 30px;">投入占比（%）			</uni-th>
						<uni-th style="min-width: 80px;">更新时间				</uni-th>
						<uni-th style="min-width: 30px;">区间上限（%）			</uni-th>
						<uni-th style="min-width: 80px;">操作					</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableUpRuleData" :key="index+1" >
						<uni-td style="padding: 0px 4px;">{{ index + 1    			}}</uni-td>
						<uni-td style="padding: 0px 4px;">{{ item.expectValue 		}}</uni-td>
						<uni-td style="padding: 0px 4px;">
							<span :style="fontColor.up">＋{{ item.upRatio}}</span><span style="font-size: 25px; font-weight: bold;">|</span><span :style="fontColor.down" >－{{item.downRatio}}</span>
						</uni-td>
						<uni-td style="padding: 0px 4px;">{{ item.adviseInvestRatio 	}}</uni-td>
						<uni-td style="padding: 0px 4px;">{{ item.updateTime 			}}</uni-td>
						<uni-td style="padding: 0px 4px;">{{ item.expectEnd 			}}</uni-td>
						<uni-td style="padding: 0px 4px;">
							<view class="uni-group">
								<button @tap="editOne(item, index, 1)" class="uni-button" size="mini" type="primary">改</button>
								<button @tap="delOne(item, 'inStorageUpRuleDataList', 'tableUpRuleData', 1)" class="uni-button" size="mini" type="warn">删</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
			</uni-group>
			
			<uni-group title="做空规则:(绝大多数,不会为负数,因此做空利率最大为100%)" style="background-color: #C9E4D6;">
				<uni-table border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th style="width: 60px;">序号					</uni-th>
						<uni-th style="min-width: 60px;">预期收益值（%）		</uni-th>
						<uni-th style="min-width: 80px;">建议出手收益值（%）	</uni-th>
						<uni-th style="min-width: 30px;">投入占比（%）			</uni-th>
						<uni-th style="min-width: 80px;">更新时间				</uni-th>
						<uni-th style="min-width: 30px;">区间上限（%）			</uni-th>
						<uni-th style="min-width: 80px;">操作					</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableDownRuleData" :key="index+1">
						<uni-td style="padding: 0px 4px;">{{ index + 1    			}}</uni-td>
						<uni-td style="padding: 0px 4px;">{{ item.expectValue 		}}</uni-td>
						<uni-td style="padding: 0px 4px;">
							<span :style="fontColor.up">－{{ item.upRatio}}</span><span style="font-size: 25px; font-weight: bold;">|</span><span :style="fontColor.down" >＋{{item.downRatio}}</span>
						</uni-td>
						<uni-td style="padding: 0px 4px;">{{ item.adviseInvestRatio 	}}</uni-td>
						<uni-td style="padding: 0px 4px;">{{ item.updateTime 			}}</uni-td>
						<uni-td style="padding: 0px 4px;">{{ item.expectEnd 			}}</uni-td>
						<uni-td style="padding: 0px 4px;">
							<view class="uni-group">
								<button @tap="editOne(item, index, 2)" class="uni-button" size="mini" type="primary">改</button>
								<button @tap="delOne(item, 'inStorageDownRuleDataList', 'tableDownRuleData', 2)" class="uni-button" iconCls="icon-edit" size="mini" type="warn">删</button>
							</view>
						</uni-td>
					</uni-tr>
				  </uni-table>					
			</uni-group>
		</uni-section>
			
		<uni-group title="做多规则:" >
			<uni-table border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th style="width: 60px; " align="center">编号					</uni-th>
					<uni-th style="min-width: 60px; " align="center" >预期收益值（%）		</uni-th>
					<uni-th style="min-width: 80px;" align="center">建议出手收益值（%）	</uni-th>
					<uni-th style="min-width: 30px;" align="center">投入占比</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableUpRuleData" :key="index+1">
					<uni-td style="padding: 0px 4px; text-align: center;">{{ index + 1    			}}</uni-td>
					<uni-td style="padding: 0px 4px; text-align: center;">{{ item.expectValue 		}}</uni-td>
					<uni-td style="padding: 0px 4px; text-align: center;">
						<span :style="fontColor.up">＋{{ item.upRatio}}</span><span style="font-size: 25px; font-weight: bold;">|</span><span :style="fontColor.down" >－{{item.downRatio}}</span>
					</uni-td>
					<uni-td style="padding: 0px 4px; text-align: center;">{{ item.adviseInvestRatio 	}}</uni-td>
				</uni-tr>
			</uni-table>					
		</uni-group>
		<uni-group title="做空规则:" >
			<uni-table border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th style="width: 60px;" align="center">编号					</uni-th>
					<uni-th style="min-width: 60px; " align="center">预期收益值（%）		</uni-th>
					<uni-th style="min-width: 80px; " align="center">建议出手收益值（%）	</uni-th>
					<uni-th style="min-width: 30px; " align="center">投入占比</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableDownRuleData" :key="index+1">
					<uni-td style="padding: 0px 4px; text-align: center;">{{ index + 1    			}}</uni-td>
					<uni-td style="padding: 0px 4px; text-align: center;">{{ item.expectValue 		}}</uni-td>
					<uni-td style="padding: 0px 4px; text-align: center;">
						<span :style="fontColor.up">-{{ item.upRatio}}</span><span style="font-size: 25px; font-weight: bold;">|</span><span :style="fontColor.down">+{{item.downRatio}}</span>
					</uni-td>
					<uni-td style="padding: 0px 4px; text-align: center;">{{ item.adviseInvestRatio 	}}</uni-td>
				</uni-tr>
			</uni-table>					
		</uni-group>
		
	</view>

	<view>
		<!-- 输入框示例 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" title="输入授权码" 
				placeholder="授权码" @confirm="authorizeConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
	<view>
		<!-- 提示信息弹窗 -->
		<uni-popup ref="message" type="message">
			<uni-popup-message :type="msgType" :message="messageText" :duration="duration"></uni-popup-message>
		</uni-popup>
	</view>
	
</template>

<script>
	import getdateTime from '@/common/getdateTime.js';
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import { Decimal } from 'decimal.js';
	import { formatMoney } from '@/common/js/util/formatMoney.js'
	
	export default {
		components: {
			tTable, tTh, tTr, tTd
		},
		data() {
			return {
				tableUpRuleData: []		// 做多·规则记录 收录
				,tableUpRuleDataInit: [
					//编号	|预期收益率（%）				|预期收益上限率			|建议出手收益率（%）			|正收益率%			|负收益率%			|投入资金比（%）					|投入资金额				
					{id: 0,	expectValue: '0~5', 		expectEnd: '5',			adviseValue: '+3	|-2', 	upRatio: '3',		downRatio: '2', 	adviseInvestRatio: '10', 		adviseInvestMoney: '1000' },
					{id: 1,	expectValue: '5~10', 		expectEnd: '10',		adviseValue: '+8	|-2', 	upRatio: '8',		downRatio: '2', 	adviseInvestRatio: '20', 		adviseInvestMoney: '2000' },
					{id: 2,	expectValue: '10~20', 		expectEnd: '20',		adviseValue: '+14	|-2', 	upRatio: '14',		downRatio: '2', 	adviseInvestRatio: '20', 		adviseInvestMoney: '2000' },
					{id: 3,	expectValue: '20~50', 		expectEnd: '50',		adviseValue: '+35	|-2', 	upRatio: '35',		downRatio: '2', 	adviseInvestRatio: '15', 		adviseInvestMoney: '1500' },
					{id: 4,	expectValue: '50~100', 		expectEnd: '100',		adviseValue: '+60	|-8', 	upRatio: '60',		downRatio: '8', 	adviseInvestRatio: '10', 		adviseInvestMoney: '1000' },
					{id: 5,	expectValue: '100~200', 	expectEnd: '200',		adviseValue: '+120	|-10', 	upRatio: '120',		downRatio: '10', 	adviseInvestRatio: '10', 		adviseInvestMoney: '1000' },
					{id: 6,	expectValue: '200~500',		expectEnd: '500',		adviseValue: '+200	|-50',	upRatio: '200',		downRatio: '50', 	adviseInvestRatio: '10',		adviseInvestMoney: '1000' },
					{id: 7,	expectValue: '500~100000',	expectEnd: '100000',	adviseValue: '+300	|-50',	upRatio: '300',		downRatio: '50', 	adviseInvestRatio: '5',			adviseInvestMoney: '500'  }
				]
				,tableDownRuleData: []	// 做空·规则记录 收录
				,tableDownRuleDataInit: [
					//编号	|预期收益率（%）				|预期收益上限率			|建议出手收益率（%）			|正收益率%			|负收益率%			|投入资金比（%）					|投入资金额				
					{id: 0,	expectValue: '0~5', 		expectEnd: '5',			adviseValue: '-3	|+2', 	upRatio: '3',		downRatio: '2', 	adviseInvestRatio: '10', 		adviseInvestMoney: '1000' },
					{id: 1,	expectValue: '5~10', 		expectEnd: '10',		adviseValue: '-8	|+2', 	upRatio: '8',		downRatio: '2', 	adviseInvestRatio: '20', 		adviseInvestMoney: '2000' },
					{id: 2,	expectValue: '10~20', 		expectEnd: '20',		adviseValue: '-14	|+2', 	upRatio: '14',		downRatio: '2', 	adviseInvestRatio: '20', 		adviseInvestMoney: '2000' },
					{id: 3,	expectValue: '20~50', 		expectEnd: '50',		adviseValue: '-35	|+2', 	upRatio: '35',		downRatio: '2', 	adviseInvestRatio: '15', 		adviseInvestMoney: '1500' },
					{id: 4,	expectValue: '50~100', 		expectEnd: '100',		adviseValue: '-60	|+8', 	upRatio: '60',		downRatio: '8', 	adviseInvestRatio: '10', 		adviseInvestMoney: '1000' },
				]
				,duration :	2000
				,type :	'center'
				,msgType :	'msgType'
				,messageText :	''
				,input:''					// 验证码
				,isNewExpectEnd: false		// 新【区间界限】标志
				,tableRuleShowData:[]		// 规则记录展示	
				,expectEnd:''				// 【区间界限】
				,upRatio:''					// 正收益率
				,downRatio:''				// 负收益率
				,adviseInvestRatio:''		// 投入占比
				,selectUpOrDownRange:[{value:1, text: '做多'},{value:2, text: '做空'}]
				,selectUpOrDownValue: 1
				,benifitRatio: '上涨收益'
				,lossRatio: '下跌损失'
				,benifitFlag: '↑+'
				,lossFlag: '↓-'
				,editing: {
					selectUpOrDownValue: -1,
					index: -1,
					expectEnd: 0
				}
				,selectedColorValue: '1'
				,fontColor: {
					up: 	"color: red; ",
					down: 	"color: green; "
				}
			};
		}
		,async created(){
			this.stock_display = '';
			// this.stock_display = 'none';
			
			// 表格数据加载 
			this.loadTableStockList('inStorageUpRuleDataList', 'tableUpRuleData', 1);
			this.loadTableStockList('inStorageDownRuleDataList', 'tableDownRuleData', 2);
		}
		,mounted(){
			// console.log("读取全局变量："+this.$store.state.fontColor) // 正确访问
		}
		,onReady() {},
		methods: {
			loadTableStockList(strKey, table_tag_key, up_down){
				const _this = this;
				uni.getStorage({
					key:strKey,
					success: function(resp){
						// console.log("返回值："+ JSON.stringify(resp.data))
						if(resp.data.length > 0){
							// 更新对象 的指定属性，或追加属性
							_this.$set(_this, table_tag_key, resp.data);
							return;
						}
						_this.initData(up_down, _this);
					},
					fail:function(){
						// console.log("未取得 key:"+strKey);
						_this.initData(up_down, _this);
					}
				});
			}
			,initData(up_down, _this){
				let keyStr = 'inStorageUpRuleDataList' 
				let tableKeyStr = 'tableUpRuleData' 
				let saveData = []
				if(up_down==1){
					_this.tableUpRuleData = _this.tableUpRuleDataInit
					saveData = _this.tableUpRuleDataInit
				}else{
					_this.tableDownRuleData = _this.tableDownRuleDataInit
					keyStr = 'inStorageDownRuleDataList'
					tableKeyStr = 'tableDownRuleData' 
					saveData = _this.tableDownRuleDataInit
				}
					
				// 单独存一份 股票代码
				uni.setStorage({
					key: keyStr,
					data:saveData				
				});
				
				saveData.forEach((item, index)=>{
					// 单独存一份 股票代码
					uni.setStorage({
						key: up_down + '_' +item.expectEnd,
						data:true				
					});
				})
				
			}
			,change(e) {
				// console.log(e.detail);
			}
			// 改选
			,selectUpOrDownChange(e) {
				if(this.selectUpOrDownValue==1){
					// 做多
					this.benifitRatio	= '上涨收益'
					this.lossRatio		= '下跌损失'
					this.benifitFlag	= '↑+'
					this.lossFlag		= '↓-'
				}else{
					// 做空
					this.benifitRatio	= '下跌收益'
					this.lossRatio		= '上涨损失'
					this.benifitFlag	= '↓-'
					this.lossFlag		= '↑+'
				}
				this.flushJudgeNew();
			}
			// 区间界限 变更
			,inputeExpectEndChange(e) {
				const upRatio_ = Math.abs(this.upRatio);
				const expectEnd_ = Math.abs(this.expectEnd);
				if(this.upRatio != '' && this.expectEnd != '' && upRatio_ > 0 && expectEnd_ > 0){
					if(parseFloat(upRatio_) > parseFloat(expectEnd_)){
						this.messageToggleTime('warn', '【'+this.benifitRatio+'】应该在【区间界限】范围内！', 5000);
						this.expectEnd = '';
						return;
					}
				}
				this.calculateInvestMoney();
			}
			// 收益率 变更
			,inputUpRatioChange(e) {
				const upRatio_ = Math.abs(this.upRatio);
				const expectEnd_ = Math.abs(this.expectEnd);
				if(this.upRatio != '' && this.expectEnd != '' && upRatio_ > 0 && expectEnd_ > 0){
					if(parseFloat(upRatio_) > parseFloat(expectEnd_)){
						this.messageToggleTime('warn', '【'+this.benifitRatio+'】应该在【区间界限】范围内！', 5000);
						this.upRatio = '';
						return;
					}
				}
				this.calculateInvestMoney();
			}
			// 损失率 变更
			,inputDownRatioChange(e) {
				this.calculateInvestMoney();
			}
			// 投入占比 变更
			,inputadviseInvestRatioChange(e) {
				this.calculateInvestMoney();
			}
			// 试算并展示
			,calculateInvestMoney(isSelect){
				if(!this.judgeImputEmpty()) return;
				var item = {
					expectEnd:	Math.abs(this.expectEnd), 
					upRatio:	Math.abs(this.upRatio), 
					downRatio:	Math.abs(this.downRatio), 
					adviseInvestRatio:	Math.abs(this.adviseInvestRatio),
				}
				
				var saveData = []
				/** 追加信息 */
				this.appendInfo(this, item);
				saveData.push(item)
				this.tableRuleShowData = saveData
				
				this.flushJudgeNew();
			}
			,checkInput(){
				if(this.upRatio !='' && this.expectEnd != ''){
					if(this.upRatio > this.expectEnd){
						this.messageToggleTime('warn', '【收益率】应该在【区间界限】范围内！', 5000);
						this.upRatio = '';
						return;
					}
				}
			}
			,flushJudgeNew(){
				var _this = this
				uni.getStorage({
					key: _this.selectUpOrDownValue + '_' +_this.expectEnd,
					success: function(resp){
						// console.log("instore Key:"+_this.selectUpOrDownValue + '_' +_this.expectEnd+"；返回值："+ JSON.stringify(resp.data))
						_this.isNewExpectEnd = false
					},
					fail:function(){
						// console.log("未取得 key:"+_this.expectEnd);
						_this.isNewExpectEnd = true
					}
				});
			}
			,judgeImputEmpty(){
				this.tableRuleShowData = []
				if(this.expectEnd == '' || this.expectEnd == '0'){
					return false;
				}
				if(this.upRatio == '' || this.upRatio == '0'){
					return false;
				}
				if(this.downRatio == '' || this.downRatio == '0'){
					return false;
				}
				if(this.adviseInvestRatio == '' || this.adviseInvestRatio == '0'){
					return false;
				}
				return true;
			}
			// 根据 股票编码 收录或更新 记录
			,addOrUpdateOne(item, addOrUpdate){
				/* 【过程】：
				1.补充操作信息；
				2.没有数据则直接添加；
				3.相同‘股票编码’确定替换或是取消更新；
				4.保存到内存中；
				5.展示到表格中
				*/
				if(this.expectEnd == ''){
					this.messageToggle('warn', '【区间界限】未填写！')
					return;
				}
				if(this.upRatio == ''){
					this.messageToggle('warn', '【正收益率】未填写！')
					return;
				}
				if(this.downRatio == ''){
					this.messageToggle('warn', '【负收益率】未填写！')
					return;
				}
				if(this.adviseInvestRatio == ''){
					this.messageToggle('warn', '【投入占比】未填写！')
					return;
				}
				/** 追加信息 */
				var itemJson = JSON.stringify(item);
				// console.log("点击"+addOrUpdate+"【内容】:"+ itemJson)
				if(addOrUpdate=='addOne'){
					// console.log("点击了添加")
					if(this.selectUpOrDownValue==1){// 看涨-做多
						this.saveData('inStorageUpRuleDataList', 'tableUpRuleData', item)
					}else{// 看跌-做空
						this.saveData('inStorageDownRuleDataList', 'tableDownRuleData', item)
					}
				}else{
					// console.log("点击了更新")
					if(this.selectUpOrDownValue==1){// 看涨-做多
						this.updateData('【做多规则】', 'inStorageUpRuleDataList', 'tableUpRuleData', this.selectUpOrDownValue, item, this)
					}else{// 看跌-做空
						this.updateData('【做空规则】', 'inStorageDownRuleDataList', 'tableDownRuleData', this.selectUpOrDownValue, item, this)
					}
				}
				
				this.isNewExpectEnd = false
				this.editing = {selectUpOrDownValue: -1, index: -1}  // 作用有二：1、恢复初始状态；2.避免后面的无限循环。
			}
			,appendInfo(_this, item){	/** 追加信息 */
				// 追加‘新增时间’
				// var timeStr = getdateTime.dateTimeStr('y-m-d h:i:s')
				var timeStr = getdateTime.dateTimeStr('y-m-d')
				_this.$set(item,"updateTime",timeStr)
			}
			,saveData(keyStr, table_tag_key, item){
				var saveData = []
				const _this = this
				_this.appendInfo(_this, item);
				uni.getStorage({
					key:keyStr,
					success: function(resp){
						var respData = resp.data;
						// console.log("old返回值："+ JSON.stringify(respData))
						if(Array.isArray(respData)){
							//遍历检查是否存在重复，存在则判断是否替换
							// console.log("遍历检查是否存在重复，存在则判断是否替换")
							var flag = false;
							respData.some((val,i)=>{
								if(item.expectEnd == val.expectEnd){
									// 存在重复
									flag = true;
									// console.log("存在重复……")
									// 此处，异步执行。暂时未找到办法解决，使其同步执行。
									// 弹窗选取
									uni.showModal({
										title: '提示',
										// 提示文字
										content: '该【区间界限】已存在,是否覆盖？',
										// 取消按钮的文字自定义
										cancelText: "取消",
										// 确认按钮的文字自定义
										confirmText: "替换",
										//删除字体的颜色
										confirmColor:'red',
										//取消字体的颜色
										cancelColor:'#000000',
										success: function(res) {
											if (res.confirm) {
												// 执行确认后的操作
												// 替换
												// console.log("替换："+item.expectEnd)
												// console.log("替换前："+ JSON.stringify(respData))
												respData.splice(i, 1, item);
												// console.log("替换后："+ JSON.stringify(respData))
												// 由于是异步执行，所以，只得补充冗余执行。待后续，解决了 同步执行问题，可省去下部内容
												saveData = respData
												// 排序 && 拼接【预期收益值】
												_this.reSortAndSave(keyStr, table_tag_key, saveData, _this);
											}else {
												// 执行取消后的操作
												// console.log("放弃替换，保持原数据："+item.expectEnd)
											}
										}
									});
									return true; // 退出循环
								}
							});
							
							// 添加新数据
							if(!flag){
								// 添加
								// console.log("添加："+item.expectEnd)
								respData.push(item);
							}
							saveData = respData
						}else{
							saveData.push(item)
						}
							
						// 排序 && 拼接【预期收益值】
						_this.reSortAndSave(keyStr, table_tag_key, saveData, _this);
						// console.log("new更新值："+ JSON.stringify(saveData))
					},
					fail:function(){
						saveData.push(item);
						// 排序 && 拼接【预期收益值】
						_this.reSortAndSave(keyStr, table_tag_key, saveData, _this);
						// console.log("首次，则新增！数据："+JSON.stringify(saveData))
					}
				});
				
				// 单独存一份 股票代码
				uni.setStorage({
					key: _this.selectUpOrDownValue + '_' +item.expectEnd,
					data:true				
				});
			}
			
			,updateData(ruleName, keyStr, table_tag_key, up_down, item, _this){
				var saveData = []
				var isRepeated = false;
				_this.appendInfo(_this, item);
				uni.getStorage({
					key:keyStr,
					success: function(resp){
						var respData = resp.data;
						// console.log("old返回值："+ JSON.stringify(respData))
						if(Array.isArray(respData)){
							var isFirst = true;
							respData.forEach((val, index)=>{
								if(val.expectEnd == item.expectEnd){
									isFirst = false;
									if(_this.editing.selectUpOrDownValue == _this.selectUpOrDownValue){
										// [做多做空]没换
										if(index == _this.editing.index){
											// 存在，则替换
											respData.splice(index, 1, item);
											saveData = respData
											_this.reSortAndSave(keyStr, table_tag_key, saveData, _this);
										}else{
											// 与现有 其他【区间界限】发生冲突
											isRepeated = true
										}
									}else{
										// [做多做空]换了
										// 弹窗选取
										uni.showModal({
											title: '提示',
											// 提示文字
											content: ruleName+'的该【区间界限】已存在,是否覆盖？',
											// 取消按钮的文字自定义
											cancelText: "取消",
											// 确认按钮的文字自定义
											confirmText: "替换",
											//删除字体的颜色
											confirmColor:'red',
											//取消字体的颜色
											cancelColor:'#000000',
											success: function(res) {
												if (res.confirm) {
													// 执行确认后的操作
													// 替换
													// console.log("替换："+item.expectEnd)
													// console.log("替换前："+ JSON.stringify(respData))
													respData.splice(index, 1, item);
													// console.log("替换后："+ JSON.stringify(respData))
													// 由于是异步执行，所以，只得补充冗余执行。待后续，解决了 同步执行问题，可省去下部内容
													// saveData = respData
													// 排序 && 拼接【预期收益值】
													_this.reSortAndSave(keyStr, table_tag_key, respData, _this);
													
													// 重载数据，重新渲染
													if(up_down==1){
														_this.loadTableStockList('inStorageUpRuleDataList', 'tableUpRuleData');
													}else{
														_this.loadTableStockList('inStorageDownRuleDataList', 'tableDownRuleData');
													}
													
												}else {
													// 执行取消后的操作
													// console.log("放弃替换，保持原数据："+item.expectEnd)
												}
									
											},
										});
										
									}
								}
							});
							if(isFirst){
								// 不存在，则新增
								respData.push(item)
								saveData = respData
							}
							saveData = respData
						}else{
							saveData.push(item)
						}
						// 排序 && 拼接【预期收益值】
						_this.reSortAndSave(keyStr, table_tag_key, respData, _this);
						// console.log("new更新值："+ JSON.stringify(saveData))
					},
					fail:function(){
						saveData.push(item);
						
						// 排序 && 拼接【预期收益值】
						_this.reSortAndSave(keyStr, table_tag_key, respData, _this);
						// console.log("首次，则新增！数据："+JSON.stringify(saveData))
					}
				});
				
				if(isRepeated){
					this.messageToggle('warn', '【区间界限】发生重复，请核对！')
					return;
				}
				
			}
			// 修改
			,editOne(item, index, upOrDown) {
				var dataStr = JSON.stringify(item);
				// console.log("点击编辑"+ dataStr)
				this.expectEnd = item.expectEnd
				this.upRatio = item.upRatio
				this.downRatio = item.downRatio
				this.adviseInvestRatio = item.adviseInvestRatio
				var saveData = []
				saveData.push(item)
				this.isNewExpectEnd = false
				this.tableRuleShowData = saveData
				this.selectUpOrDownValue = upOrDown
				this.editing = {
					selectUpOrDownValue: 	upOrDown,
					index: 					index,
					expectEnd:				item.expectEnd
				}
			}
			// 删除
			,delOne(item, keyStr, table_tag_key, upOrDown) {
				var dataStr = JSON.stringify(item);
				// console.log("点击删除"+ dataStr)
				const _this = this;
				// 弹窗选取
				uni.showModal({
					title: '提示',
					// 提示文字
					content: '确定要删除该区间界限信息？',
					// 取消按钮的文字自定义
					cancelText: "取消",
					// 确认按钮的文字自定义
					confirmText: "确定",
					//删除字体的颜色
					confirmColor:'red',
					//取消字体的颜色
					cancelColor:'#000000',
					success: function(res) {
						if (res.confirm) {
							uni.getStorage({
								key:keyStr,
								success: function(resp){
									var respData = resp.data;
									// console.log("old返回值："+ JSON.stringify(respData));
									if(Array.isArray(respData)){
										//遍历检查是否存在重复，存在则判断是否替换
										// console.log("遍历检查是否存在重复，存在则判断是否替换")
										var flag = false;
										respData.some((val,index)=>{
											if(item.expectEnd == val.expectEnd){
												respData.splice(index, 1);
												// 排序 && 拼接【预期收益值】
												_this.reSortAndSave(keyStr, table_tag_key, respData, _this);
												
												uni.removeStorage({
													key: _this.selectUpOrDownValue + '_' +item.expectEnd
												});
												return true;
											}
										})
									}
									
								},
								fail:function(){
									// console.log("未取得 key:"+keyStr);						
								}
							});
						}
					},
				});
				
				// 清空
				this.expectEnd = ''
				this.upRatio = ''
				this.downRatio = ''
				this.adviseInvestRatio = ''
				this.tableRuleShowData = []
			}
			// 排序 && 拼接【预期收益值】
			,reSortAndSave(keyStr, table_tag_key, saveData, _this){
				saveData.sort(function(a,b){
					return parseInt(a.expectEnd) - parseInt(b.expectEnd)		// 顺序
					// return parseInt(b.expectEnd) - parseInt(a.expectEnd);		// 逆序
				});
				
				saveData.forEach((item, index)=>{
					var start = 0;
					if(index!=0){
						start = saveData[index-1].expectEnd
					}
					var result = start + ' ~ ' + saveData[index].expectEnd
					_this.$set(item, 'expectValue', result);
				});
				
				uni.setStorage({
					key:keyStr,
					data:saveData				
				});
				// 刷新数据
				_this.$set(_this, table_tag_key, saveData);
			}
			// 信息提示（默认：2秒后退显）
			,messageToggle(type, messageText) {
				this.messageToggleTime(type, messageText, 2000)
			}
			// 信息提示（duration时间后退显）
			,messageToggleTime(type, messageText, duration) {
				this.duration = duration
				this.type = 'center'
				this.msgType = type
				this.messageText = messageText
				this.$refs.message.open()
			}
			
			,authorizeConfirm(val) {
				uni.showLoading({
					title: '3秒后会关闭'
				})
			
				setTimeout(() => {
					uni.hideLoading()
					// console.log(val)
					this.value = val
					// 关闭窗口后，恢复默认内容
					this.$refs.inputDialog.close()
					if(val == "admin"){
						this.removeStockFroStoragem()
					}
				}, 1)
			}
			,radioColorChange(e){
				this.selectedColorValue = e.detail.value
				if(this.selectedColorValue == '1'){  // 1-红涨绿跌
					// this.updateUpColor('color: red;') 		// 调用 action 更新 up
					// this.updateDownColor('color: green;') 	// 调用 action 更新 down
					// this.fontColor = {
					// 	up: 	"color: red; ",
					// 	down: 	"color: green; "
					// }
					
					uni.setStorage({
						key: 'fontColor',
						data: {up:"color: red;",down:"color: green;"}
					});
					this.freshFontColor();
					// this.setFontColor(fontColor)
					// this.updateFontColor({ up: 'color: red;', down: 'color: green;' });
				}else if(this.selectedColorValue == '2'){	// 2-红跌绿涨
					// this.updateUpColor('color: green;') // 调用 action 更新 up
					// this.updateDownColor('color: red;') // 调用 action 更新 down
					// this.fontColor = {
					// 	up: 	"color: green; ",
					// 	down: 	"color: red; "
					// }
					
					uni.setStorage({
						key: 'fontColor',
						data: {up:'color: green;', down:'color: red;'}
					});
					this.freshFontColor();
				}else if(this.selectedColorValue == '0'){	// 0-不区分
					// this.updateUpColor('color: unset;') // 调用 action 更新 up
					// this.updateDownColor('color: unset;') // 调用 action 更新 down
					// this.fontColor = {
					// 	up: 	"color: unset; ",
					// 	down: 	"color: unset; "
					// }
					
					uni.setStorage({
						key: 'fontColor',
						data: {up:'color: unset;', down:'color: unset;'}
					});
					this.freshFontColor();
				}
				// console.log("选中："+ this.selectedColorValue + "；颜色值："+ JSON.stringify(this.fontColor))
			}
			,freshFontColor(){
				var _this = this
				uni.getStorage({
					key: 'fontColor',
					success: function(resp){
						// console.log("key: fontColor; 返回值："+ JSON.stringify(resp))
						_this.fontColor = resp.data
					},
					fail:function(){
						// console.log("未取得 key:fontColor");
						_this.fontColor = {
							up: 	"color: red; ",
							down: 	"color: green; "
						}
					}
				});
			}
			
			
		},// methods
		
		
		
	}
</script>

<style lang="scss">	
	// group
	.group_display{
		display:''
	}
	.group_display_none{
		display:'none'
	}
	
	.success-text {
		color: #09bb07;
	}
	.popup-success {
		color: #fff;
		background-color: #e1f3d8;
	}
	.warn-text {
		color: #e6a23c;
	}
	
	// table
	.title {
		font-size: 32upx;
		color: #666;
	}
	.box {
		margin: 20upx;
	}

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
	
	.uni-table {
	  min-width: auto !important; /* 使用auto可能不是最佳选择，因为min-width通常不接受auto值 */
	  /* 或者设置为0或其他你想要的宽度 */
	  min-width: 0; 
	}
	
	// 习惯设置-颜色字体
	#colorRadio .uni-forms-item__label {
	  align-items: flex-start; /* 替换 align-items: top */
	  margin-left: 15px;
	}
	
</style>
