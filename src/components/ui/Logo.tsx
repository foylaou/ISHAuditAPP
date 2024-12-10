import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="https://sets.org.tw/" passHref> {/* 導航到首頁，或改為你想要的網址 */}
            <Image
                src="/logo.svg"
                alt="大型石化督導資料庫"
                width={300}  // 設定寬度
                height={70}
            />
        </Link>
    );
}
