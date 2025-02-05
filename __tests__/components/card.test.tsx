// 從 @testing-library/react 中匯入必要的函數，用於渲染和操作測試中的 DOM
import { render, screen } from '@testing-library/react';

// 匯入要測試的元件
import CardComponent from "@/components/Card";

// 使用 describe 來定義測試套件，描述測試目標
describe('CardComponent', () => {
  // 定義 mockProps，模擬傳遞給 CardComponent 的屬性
  const mockProps = {
    data: {
      id: '1', // 模擬的資料 ID
      title: '測試標題', // 測試的標題文字
      description: '測試描述', // 測試的描述文字
      image: '/file.svg', // 測試的圖片 URL
      imageInfo: '測試圖片' // 測試的圖片說明文字
    }
  };

  // 定義一個測試用例
  it('renders correctly', () => {
    // 渲染元件，將模擬屬性傳遞給元件
    render(<CardComponent {...mockProps} />);

    // 使用 screen.getByText 驗證特定文字是否正確渲染
    expect(screen.getByText('測試標題')).toBeInTheDocument(); // 檢查標題是否存在
    expect(screen.getByText('測試描述')).toBeInTheDocument(); // 檢查描述是否存在

    // 使用 screen.getByAltText 驗證圖片的 alt 屬性是否正確渲染
    expect(screen.getByAltText('測試圖片')).toBeInTheDocument(); // 檢查圖片是否存在
  });
});
