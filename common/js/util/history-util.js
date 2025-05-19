// common/js/history-util.js

const JOB_HISTORY_RECORD = 'JOB_HISTORY_RECORD'; // 常量可在此统一管理

// 读取历史记录
export const readHistoryRecord = async () => {
  try {
    const { data } = await uni.getStorage({ key: JOB_HISTORY_RECORD });
    return data || [];
  } catch (error) {
    console.error('读取历史记录失败:', error);
    return [];
  }
};

// 写入历史记录
export const writeHistoryRecord = async (historyList, opt, obj, img) => {
  const newRecord = { 
    title: `${opt}了${obj}`, 
    time: new Date().toLocaleString(), 
    image: img 
  };
  
  const newHistoryList = [newRecord, ...historyList]; // 使用 unshift 效果
  
  try {
    await uni.setStorage({ key: JOB_HISTORY_RECORD, data: newHistoryList });
    return newHistoryList; // 返回更新后的数组
  } catch (error) {
    console.error('保存历史记录失败:', error);
    return historyList; // 失败时返回原数组
  }
};