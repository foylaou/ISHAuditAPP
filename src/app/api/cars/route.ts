// API 路由: /api/cars
import { NextResponse } from "next/server";

export async function GET() {
  // 模擬的數據
  const cars = [
    { id: 1, name: "Tesla Model S" },
    { id: 2, name: "Ford F-150" },
    { id: 3, name: "Toyota Corolla" },
  ];

  return NextResponse.json(cars); // 回傳 JSON 數據
}

export async function POST(req: Request) {
  const body = await req.json(); // 獲取請求中的 JSON 數據
  console.log("Received data:", body);

  return NextResponse.json({ message: "新增成功", data: body }, { status: 201 });
}
