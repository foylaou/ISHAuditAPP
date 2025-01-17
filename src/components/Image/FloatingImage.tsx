// components/FloatingImage.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface FloatingImageProps {
  src: string;
  alt: string;
}

export default function FloatingImage({ src, alt }: FloatingImageProps) {
  return (
    <div className="relative w-full h-64 sm:h-96">
      <motion.div
        className="relative w-full h-full"
        animate={{
          y: [0, -20, 0] // 上下移動 20px
        }}
        transition={{
          duration: 4, // 動畫持續時間
          ease: "easeInOut", // 緩動函數
          repeat: Infinity, // 無限重複
          repeatType: "reverse" // 來回移動
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          priority
        />
      </motion.div>
    </div>
  );
}

// 在 MaintenancePage 中的使用方式:
/*
import FloatingImage from '@/components/FloatingImage';

// ...

<FloatingImage
  src="/maintenance1.svg"
  alt={statusInfo.title}
/>
*/
