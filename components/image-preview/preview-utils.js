// 处理双指缩放
export const handleTouchStart = (e, state) => {
  if (e.touches.length === 2) {
    state.isScaling = true;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    state.initialDistance = Math.sqrt(
      Math.pow(touch1.clientX - touch2.clientX, 2) +
      Math.pow(touch1.clientY - touch2.clientY, 2)
    );
    state.initialScale = state.scale;
  }
};

export const handleTouchMove = (e, state) => {
  if (state.isScaling && e.touches.length === 2) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentDistance = Math.sqrt(
      Math.pow(touch1.clientX - touch2.clientX, 2) +
      Math.pow(touch1.clientY - touch2.clientY, 2)
    );
    
    const newScale = state.initialScale * (currentDistance / state.initialDistance);
    state.scale = Math.max(0.5, Math.min(newScale, 5)); // 限制缩放范围0.5-5倍
  }
  
  // 拖拽处理
  if (!state.isScaling && state.scale > 1) {
    if (state.isDragging) {
      const deltaX = e.touches[0].clientX - state.lastX;
      const deltaY = e.touches[0].clientY - state.lastY;
      
      state.offsetX += deltaX;
      state.offsetY += deltaY;
      
      // 限制拖拽范围
      const maxOffset = (state.scale - 1) * 100;
      state.offsetX = Math.max(-maxOffset, Math.min(maxOffset, state.offsetX));
      state.offsetY = Math.max(-maxOffset, Math.min(maxOffset, state.offsetY));
    }
    
    state.lastX = e.touches[0].clientX;
    state.lastY = e.touches[0].clientY;
    state.isDragging = true;
  }
};

export const handleTouchEnd = (state) => {
  state.isScaling = false;
  state.isDragging = false;
};

// 重置状态
export const resetState = (state) => {
  state.scale = 1;
  state.offsetX = 0;
  state.offsetY = 0;
  state.isScaling = false;
  state.isDragging = false;
};