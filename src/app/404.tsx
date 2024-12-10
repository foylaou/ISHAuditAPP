import Image from "next/image";

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - 找不到頁面</h1>
      <p>抱歉，您訪問的頁面不存在。</p>
        <Image
            src="/404.svg"
            alt="404 - 找不到頁面"
            width={500}
            height={500}
        ></Image>
      <a href="/public" style={{ color: '#0070f3', textDecoration: 'underline' }}>
        回到首頁
      </a>
    </div>
  );
}
