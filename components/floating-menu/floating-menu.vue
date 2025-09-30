<template>
  <view class="fab-wrapper" :style="wrapperStyle">
    <view
      v-for="(item, idx) in menuItems"
      :key="item.key || idx"
      class="fab-menu-item"
      :style="menuItemStyle(idx)"
      @click="onMenuClick(item, idx)"
      v-show="showMenu"
    >
      <!-- <text :class="['fab-menu-icon', item.icon]">{{ item.iconText }}</text> -->
      <text class="fab-menu-label" :style="item.menuBtnStyle?item.menuBtnStyle:menuBtnStyle">{{ item.label }}</text>
    </view>
    <view class="fab-btn" :style="btnStyle" @click="toggleMenu">
      <text :class="['fab-icon', icon]">{{ iconText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FloatingMenu',
  props: {
    icon: {
      type: String,
      default: '＋'
    },
    showText: {
      type: String,
      default: '^'
    },
    hiddenText: {
      type: String,
      default: '>'
    },
    color: {
      type: String,
      default: '#007dff'
    },
    position: {
      type: String,
      default: 'right-bottom' // right-bottom, left-bottom, right-top, left-top
    },
    menuItems: {
      type: Array,
      default: () => []
    },
    menuDirection: {
      type: String,
      default: 'up' // up, down, left, right
    },
    size: {
      type: String,
      default: '96rpx'
    },
    shadow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showMenu: false,
	  iconText:'>',
	  menuBtnStyle: 'font-size: 33rpx; text-align: center;',
    };
  },
  computed: {
    wrapperStyle() {//  zIndex: 9999
      let style = {
        position: 'fixed',
        zIndex: 9999
      };
      if (this.position.includes('bottom')) style.bottom = '60rpx';
      if (this.position.includes('top')) 	style.top = '60rpx';
      if (this.position.includes('right')) 	style.right = '40rpx';
      if (this.position.includes('left')) 	style.left = '40rpx';
      return style;
    },
    btnStyle() {
      return {
        width: this.size,
        height: this.size,
        background: this.color,
        borderRadius: '50%',
        boxShadow: this.shadow ? '0 8rpx 32rpx rgba(0,125,255,0.18)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '48rpx',
        transition: 'background 0.2s'
      };
    }
  },
  methods: {
    toggleMenu() {
    // toggleMenu(item, idx) {
      this.showMenu = !this.showMenu;
	  // this.showMenu=this.showMenu?false:true;
	  console.log("弹出按钮："+this.showMenu)
	  this.iconText = this.hiddenText
	  // console.log("item:"+JSON.stringify(item)+"；idx:"+idx)
	  // if(this.showMenu) this.$emit('select', { item, idx });
    },
    menuItemStyle(idx) {
      const gap = 120;
      let style = {
        position: 'absolute',
        opacity: this.showMenu ? 1 : 0,
        transition: 'all 0.3s',
        zIndex: 9998,
        // 修改定位点为容器中心（即按钮中心）
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
      };
      // 计算变换
      let transform = `translate(-50%, -50%)`;
      if (this.showMenu) {
        if (this.menuDirection === 'up') {
          transform += ` translateY(-${(idx + 1) * gap}rpx)`;
        } else if (this.menuDirection === 'down') {
          transform += ` translateY(${(idx + 1) * gap}rpx)`;
        } else if (this.menuDirection === 'left') {
          transform += ` translateX(-${(idx + 1) * gap}rpx)`;
        } else if (this.menuDirection === 'right') {
          transform += ` translateX(${(idx + 1) * gap}rpx)`;
        }
      }
      style.transform = transform;
    
      style.width = this.size;
      style.height = this.size;
      style.background = this.color;
      style.borderRadius = '50%';
      style.display = 'flex';
      style.alignItems = 'center';
      style.justifyContent = 'center';
      style.color = '#fff';
      style.fontSize = '40rpx';
      return style;
    },
    onMenuClick(item, idx) {
	  console.log("点击菜单："+this.showMenu)
	  this.iconText = this.showText
	  // console.log("item:"+JSON.stringify(item)+"；idx:"+idx)
      // this.showMenu = false;
      // this.showMenu = !this.showMenu;
	  if(this.showMenu) this.$emit('select', { item, idx });
	  this.showMenu = true;
    }
  }
};
</script>

<style scoped>
.fab-wrapper {
  /* 通过js动态设置fixed位置 */
  position: fixed;
  z-index: 99999 !important; /* 增加优先级 */
}
.fab-btn {
  z-index: 99998 !important;
  box-shadow: 0 8rpx 32rpx rgba(0,125,255,0.18) !important;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}
.fab-btn:active {
  background: #005bb5;
}
.fab-icon {
  font-size: 33rpx;
  color: #fff;
  text-align: center;
}
.fab-menu-item {
  z-index: 99999 !important;
  box-shadow: 0 8rpx 32rpx rgba(0,125,255,0.12);
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
  position: absolute;
}
/* .fab-menu-label {
  display: none;
} */


/* 提示文本样式 */
.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  white-space: nowrap;
  z-index: 100000;
  pointer-events: none;
}

.tooltip::after {
  content: '';
  position: absolute;
  border: 6rpx solid transparent;
}

/* 根据方向调整箭头位置 */
.fab-wrapper[style*="right"] .tooltip::after {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: rgba(0, 0, 0, 0.8);
}

.fab-wrapper[style*="left"] .tooltip::after {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: rgba(0, 0, 0, 0.8);
}

</style>
