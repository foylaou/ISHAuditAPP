'use client';
import {useEffect, useState} from "react";

// 定義資料的型別
interface Car {
  id: number;
  name: string;
}

export const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]); // 初始值設為空陣列


  useEffect(() => {
    // 呼叫 API 載入資料
    const loadCars = async () => {
      try {
        const response = await fetch("/api/cars");
        const data: Car[] = await response.json(); // 確保資料符合 Car[] 型別
        setCars(data); // 設定取得的資料
      } catch (error) {
        console.error("Error loading cars:", error);
      }
    };

    loadCars().then();
  }, []);

  // 如果資料尚未載入
  if (cars.length === 0) {
    return <div>Loading...</div>;
  }

  return (

    <div>
      <h1>Car List</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {car.id} - {car.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
