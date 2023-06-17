<template>
	<view class="example">
		<view class="title">数据操作 单选</view>
		
		<v-table :columns="columnsCheckBox" :list="data" selection="single"  @on-selection-change="onSelectionChange"></v-table>
		
		<view class="table_box">
			
			<!-- 头部内容 【-->
			<view class="div-table div-table-head">
				<view class="thead">
					<view class="tr">
						<view class="td selection" v-if="selection=='mulit'" :style='{width:selectionTdWidth,height:thTdHeight+"px"}'>
							<view :class="['td_wrap']" :style='{width:selectionTdWidth,height:thTdHeight+"px"}'>
								<checkbox-group @change="checkboxChangeAll">
									<checkbox value="all" color="#999" :checked="switchAllCheckBox" style="transform:scale(0.7)" />
								</checkbox-group>
							</view>
						</view>
						<view class="td" :style='{width:countHeadColspanWidth(item,index),height:thTdHeight+"px"}' v-for="(item,index) in columns" :key="item.key">
							<view class="td_wrap" :style='{width:countHeadColspanWidth(item,index,true),height:thTdHeight+"px"}'>{{item.title}}</view>
						</view>
					</view>
				</view>
			</view> <!-- 头部内容 】-->
			
			<template>
				<view class="table_tbody_box" :style='{height:talbeBodyHeight}'>
					<view class="div-table div-table-body">
						<checkbox-group @change="checkboxChange">
							<template v-for="(item,index) in columns">
								<template class="td selection" >"
									{{item[index].key}}
								 </template>
							</template>
						 </checkbox-group>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	// import vTable from "@/components/table.vue"
	
	export default{
		// components: {
		// 	vTable
		// },
		data(){
			return {
				columnsCheckBox: [{
						title: 'Name',
						key: 'name'
					},
					{
						title: 'Age',
						key: 'age'
					},
					{
						title: 'Address',
						key: 'address'
					}
				],
				columns: [{
						name: 'John Brown',
						age: 18,
						address: 'New York No. 1 Lake Park',
						id: "1",
						$checked:true
						
					},
					{
						name: 'Jim Green',
						age: 25,
						address: 'London No. 1 Lake Park',
						id: "2",
						$disabled:true
					},
					{
						name: 'Joe Black',
						age: 30,
						address: 'Sydney No. 1 Lake Park',
						id: "3"
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						id: "4"
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						id: "5"
					},
				
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						id: "6"
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						id: "7"
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						id: "8"
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						id: "9"
					}
				],
			}
		},
		methods:{
			onSelectionChange(obj){
				console.log("对比前后，选中的变化")
				console.log(obj)
			},
			/*
			* 单选行
			* */
			selectRow(item, index) {
				if (item.$disabled) {
					return;
				}
				//非单选方式
				if(this.selection!="single"){
					return;
				}
				this.checkBoxList = this.checkBoxList.map((sitem, sindex) => {
					if (index === sindex) {
						sitem.$checked = true
					} else {
						sitem.$checked = false;
					}
					return sitem;
				});
				if (this.selection) {
					this.$emit("on-selection-change", {
						old: this.singleSelect,
						new: {
							index,
							item
						}
					})
				}
				this.singleSelect = {
					index,
					item
				};

			}
		}
		
	}
</script>

<style lang="scss">
	@import "@/common/style/table.scss";
</style>
