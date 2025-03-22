import { useState, useEffect } from 'react';


interface WindowSize {
    width: number|undefined;
    height: number|undefined;
}
function useWindowSize() {
  // 初始化狀態為 undefined 避免 SSR 問題
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // 處理視窗大小變化的函數
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // 添加事件監聽器
    window.addEventListener("resize", handleResize);

    // 呼叫 handleResize 以設置初始大小
    handleResize();

    // 清理函數
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 空依賴陣列表示這個 effect 只在組件掛載時運行一次

  return windowSize;
}

export default useWindowSize;
