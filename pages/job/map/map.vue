<template>
    <view style="height: 80vh;">
        <mapLocationPickerPolygons @selected="selected" :base_url="base_url" :qqmapsdkKey="qqmapsdkKey" :polygons="polygons"></mapLocationPickerPolygons>
    </view>
</template>

<script>
    import mapLocationPickerPolygons from '@/components/liupishui-pickerpolygons/liupishui-pickerpolygons.vue';

    export default {
        components: {
            mapLocationPickerPolygons
        },
		onLoad() {
		    // this.eventChannel = this.getOpenerEventChannel();
		},
        data() {
            return {
				// eventChannel: null,
                polygons:[],
                qqmapsdkKey:'5ILBZ-3MTE3-OU23S-OZ6QU-QTXDF-2WBR4' ,//必须，申请地址：https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview，小程序还需要在控制台（https://lbs.qq.com/dev/console/application/mine）添加小程序的appid
                // base_url:'http://job.xny.world/ws/',//小程序不需要配置此项;H5配置此项是为了跨域，地址为自己配置的代理服务器地址加路径'/ws/'(实际请求可能会出现双斜杠，如果报错，记得删除一个);
				// base_url:'https://apis.map.qq.com/ws/place/v1/suggestion',//小程序不需要配置此项;H5配置此项是为了跨域，地址为自己配置的代理服务器地址加路径'/ws/'(实际请求可能会出现双斜杠，如果报错，记得删除一个);
				base_url:'',//小程序不需要配置此项;H5配置此项是为了跨域，地址为自己配置的代理服务器地址加路径'/ws/'(实际请求可能会出现双斜杠，如果报错，记得删除一个);
            }
        },
        methods: {
            selected(data){
				// console.log("选取地址：" + JSON.stringify(data));
				// uni.showToast({title: "选取地址：" +JSON.stringify(data)})
				// 将 地址数据 传回主页
				uni.$emit('acceptAddress', data);
				uni.navigateBack(); // 返回上一页
            }
        }
    }
</script>

<style>

</style>