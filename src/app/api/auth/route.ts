import { NextResponse } from "next/server";

// 定義 UserData 型別
interface UserData {
  email: string;
  password: string;
}

// 處理 POST 請求
export async function POST(request: Request) {
  // 模擬的使用者數據
  const user_db = [
    { id: 1, email: "s225002731@gmail.com", password: "t0955787053S", name: "San Francisco" },
    { id: 2, email: "av2288444@yahoo.com.tw", password: "123456", name: "Francisco" },
    { id: 3, email: "s0955787053@gmail.com", password: "123456", name: "San" },
  ];

  try {
    // 解析 request 的 JSON 主體資料
    const userData: UserData = await request.json();
    console.log("Received data:", userData);
    // 驗證用戶資料是否存在
    const user = user_db.find(
      (u) => u.email === userData.email && u.password === userData.password
    );

    if (user) {
      // 回傳成功的用戶資料（不包含密碼）
      return NextResponse.json(
        { success: true, username: user.name},
        { status: 200 }
      );
    } else {
      // 驗證失敗
      return NextResponse.json(

        { success: false, message: "帳號或密碼錯誤" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json(
      { success: false, message: "資料錯誤" },
      { status: 400 }
    );
  }
}
