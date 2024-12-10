import Image from "next/image";
import "../styles/card.css"


// 定義卡片的資料格式
interface Card {
  id: string;
  title: string;
  description: string;
  image: string;
  imageInfo: string;
}

// 定義 Card 組件的 Props 類型
interface CardProps {
  data: Card; // 接收一個 Card 物件
}

// 撰寫組件
export default function CardComponent(props: CardProps) {
  const { data } = props;

  return (
    <div className="card-container">
      <div className="card">
        {/* 圖片 */}
        <Image
          src={data.image}
          alt={data.imageInfo || "圖片說明"}
          width={300}
          height={200}
          className="card-image"
          priority // 提高圖片載入優先級
        />
        {/* 內容 */}
        <div className="card-content">
          <h3 className="card-title">{data.title}</h3>
          <p className="card-description">{data.description}</p>
        </div>
      </div>
    </div>
  );
}
