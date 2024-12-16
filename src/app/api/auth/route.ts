import { NextResponse } from "next/server";

interface UserData {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const user_db = [
    { id: 1, email: "s225002731@gmail.com", password: "t0955787053S", name: "San Francisco" },
    { id: 2, email: "av2288444@yahoo.com.tw", password: "123456", name: "Francisco" },
    { id: 3, email: "s0955787053@gmail.com", password: "123456", name: "San" },
  ];

  function sleep() {
    return new Promise(resolve => setTimeout(resolve, 2000)); // 改為 2 秒以便測試
  }

  try {
    // 加上 await 來確保真的等待
    await sleep();

    const userData: UserData = await request.json();
    console.log("Received data:", userData);

    const user = user_db.find(
      (u) => u.email === userData.email && u.password === userData.password
    );

    if (user) {
      return NextResponse.json(
        { success: true, username: user.name },
        { status: 200 }
      );
    } else {
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
