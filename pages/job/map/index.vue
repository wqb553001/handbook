<template>
  <view class="main-wrap">
    <view class="top-map">
      <!-- 地图 -->
      <map
        :style="{ width: '100%', height: 'calc(100vh - 660rpx)' }"
        id="map"
        :longitude="longitude"
        :latitude="latitude"
        :show-location="true"
        @regionchange="regionchange"
        @tap="tapMap"
      >
        <cover-image
          class="img-back"
          src="/static/icons/location.png"
          @click="clickcontrol(firstLat, firstLng, 'origin')"
        ></cover-image>
      </map>
      <!-- 中心位置标记点 -->
      <image src="/static/icons/location.png" class="marker_icon" />
    </view>
    <!-- 底部地点列表 -->
    <view class="bottom-wrap">
      <!-- 搜索栏 -->
      <view class="search-wrap">
        <u--input placeholder="搜索地点" prefixIcon="search"></u--input>
      </view>
      <!-- 加载效果 -->
      <view v-if="listLoading" class="icon-loading">
        <u-loading-icon
          :show="listLoading"
          mode="circle"
          size="46"
        ></u-loading-icon>
      </view>
      <!-- 位置列表 -->
      <view v-else class="container">
        <scroll-view scroll-y="true" class="scroll-y">
          <view
            v-for="(item, index) in addressList"
            :key="index"
            class="container-item"
            @click="selectedItem(item)"
          >
            <view class="container-left">
              <view>{{ item.title }}</view>
              <view class="info">{{ item.address }}</view>
            </view>
            <u-icon
              v-if="clickItem === item.id"
              name="checkmark"
              color="#06A88B"
              size="26"
            ></u-icon>
          </view>
        </scroll-view>
        <view class="btn-footer">
          <u-button text="确认选点" color="#48A48B" @click="selectedBtn">
          </u-button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import QQMapWX from "@/common/js/map/qqmap-wx-jssdk.min.js";
export default {
  data() {
    return {
      addressList: [],
      clickItem: null,
      saveItem: "",
      styles: {},
      longitude: "", // 经度
      latitude: "", // 维度
      firstLng: "",
      firstLat: "",
      listLoading: true,
      changeType: "",
      scrollTimer: null,
    };
  },
  onLoad() {
    this.getUserLocation();
  },
  methods: {
    getUserLocation() {
      var that = this;
      // 获取经纬度
      uni.authorize({
        // APP H5不支持该方法
        scope: "scope.userLocation",
        success() {
          uni.getLocation({
            type: "gcj02",
            altitude: true, //高精度定位
            //定位成功，更新定位结果
            success: function (res) {
              that.latitude = res.latitude;
              that.longitude = res.longitude;
              that.firstLng = res.longitude;
              that.firstLat = res.latitude;
              that.formatLocation(that.latitude, that.longitude);
            },
          });
        },
      });
    },
    //左下角定位按钮的点击事件
    clickcontrol(lat, lng, type) {
      uni.createMapContext("map", this).moveToLocation({
        //moveToLocation将地图中心移动到当前定位点，需要配合map组件的show-location使用
        latitude: lat,
        longitude: lng,
      });
      if (type === "origin") {
        this.listLoading = true;
        this.formatLocation(lat, lng);
      }
    },
    // 地图区域发生改变
    regionchange(e) {
      //视野变化的方试:causedBy : "update" "drag"
      if (e.type === "end") {
        this.changeType = e.causedBy;
        this.getCenterLatLong();
      }
    },
    //点击地图
    tapMap(e) {
      const { detail } = e;
      const { latitude, longitude } = detail;
      let lat = Number(latitude.toFixed(6));
      let lng = Number(longitude.toFixed(6));
      this.listLoading = true;
      this.clickcontrol(lat, lng);
      this.formatLocation(lat, lng);
    },
    // 获取中心点位置
    getCenterLatLong() {
      if (this.changeType === "drag") {
        let that = this;
        let mapCtx = uni.createMapContext("map", this);
        mapCtx.getCenterLocation({
          success: (res) => {
            const latitude = res.latitude;
            const longitude = res.longitude;
            if (
              that.longitude - longitude < 0.000005 &&
              that.longitude - longitude > 0 &&
              latitude == that.latitude
            ) {
              // 对静态移动标点做限制防止偏移
              return;
            }
            if (that.scrollTimer) {
              // 设置节流，进一步限制高频触发
              clearTimeout(that.scrollTimer);
            }
            that.listLoading = true;
            that.scrollTimer = setTimeout(() => {
              that.latitude = latitude;
              that.longitude = longitude;
              that.formatLocation(res.latitude, res.longitude);
            }, 1500);
          },
          fail: (res) => {
            console.log("失败", res);
          },
        });
      }
    },
    // 转换地点
    formatLocation(latitude, longitude) {
      const that = this;
      const qqMapSdk = new QQMapWX({
        key: "申请的key", // 需填入申请的key
      });
      // 解析地址
      qqMapSdk.reverseGeocoder({
        location: {
          latitude,
          longitude,
        },
        get_poi: 1,
        poi_options: "policy=2;radius=10000",
        success: (res) => {
          const info = res.result;
          that.addressList = [...info.pois];
          that.clickItem = that.addressList[0].id;
          that.saveItem = that.addressList[0];
          that.listLoading = false;
        },
      });
    },
    // 点击选择的列表地址
    selectedItem(item) {
      this.clickItem = item.id;
      this.saveItem = item;
      this.clickcontrol(item.location.lat, item.location.lng);
    },
    // 确认选点
    selectedBtn() {
      const { location } = this.saveItem;
      uni.setStorageSync("selected_address", location);
      // 返回上一个页面
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>
<style>
page {
  background: #fff;
}
</style>
<style lang="scss" scoped>
.top-map {
  transform: scale(1);
  cover-image {
    display: inline-block;
    padding: 16rpx;
    border-radius: 10rpx;
    box-sizing: border-box;
    background-color: #fff;
  }
  .img-back {
    width: 80rpx;
    height: 80rpx;
    position: fixed;
    bottom: 46rpx;
    left: 30rpx;
  }
  .marker_icon {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -100rpx);
    width: 100rpx;
    height: 100rpx;
  }
}
.bottom-wrap {
  height: 660rpx;
  box-sizing: border-box;
  position: relative;
  .search-wrap {
    padding: 30rpx;
    box-sizing: border-box;
    ::v-deep .u-input {
      background: #f5f3f3;
    }
  }
  .icon-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .container {
    width: 100%;
    box-sizing: border-box;
    transform: scale(1);
    .scroll-y {
      height: 500rpx;
    }
    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2rpx solid #ccc;
      padding: 10rpx 40rpx;
    }
    &-left {
      width: 92%;
      view {
        word-break: break-all;
      }
      .info {
        color: #ccc;
        font-size: 30rpx;
        margin-top: 10rpx;
      }
    }
  }
  .btn-footer {
    width: 50%;
    margin: auto;
    left: 50%;
    transform: translate(-50%, 0);
    position: fixed;
    bottom: 40rpx;
  }
}
</style>

<!-- <template>
	<view class="container">
		<map class="map" :latitude="latitude" :longitude="longitude" :markers="markers" @regionchange="onRegionChange" />
		<view class="confirm-btn">
			<button type="primary" @click="confirmLocation">确认位置</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				latitude: 39.909,
				longitude: 116.397,
				markers: [{
					id: 1,
					latitude: 39.909,
					longitude: 116.397,
					title: '北京'
				}]
			}
		},
		methods: {
			onRegionChange(e) {
				if (e.type === 'end') {
					this.latitude = e.detail.latitude
					this.longitude = e.detail.longitude
				}
			},
			confirmLocation() {
				const pages = getCurrentPages()
				const prevPage = pages[pages.length - 2]
				prevPage.$vm.baseFormData.address = `纬度：${this.latitude} 经度：${this.longitude}`
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.map {
		width: 100%;
		height: 80vh;
	}
	.confirm-btn {
		position: fixed;
		bottom: 20px;
		width: 100%;
		padding: 0 20px;
	}
</style> -->