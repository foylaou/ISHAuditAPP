"use client"
import {useState, useEffect, useRef} from "react";
import {animate} from "framer-motion";
import * as Icons from "lucide-react";
import {LucideIcon} from "lucide-react";

export default function NumberAnime({
                                        Icon = "ChartNoAxesColumn",
                                        Title = "示範用組建",
                                        start_number = 0,
                                        value,
                                        onChange,
                                        className = "text-base-content text-2xl font-bold"
                                    }: {
    Icon?: string;
    Title?: string;
    className?: string;
    start_number?: number;
    value: number;
    onChange?: (value: number) => void;
}) {
    const [num, setNum] = useState(start_number);
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [difference, setDifference] = useState<number>(0);
    const [arrowRotation, setArrowRotation] = useState(0);
    const nodeRef = useRef<HTMLPreElement>(null);
    const isFirstRender = useRef(true);

    // 修正：使用兩個獨立的 useEffect 來處理差異計算和動畫
    useEffect(() => {
        // 如果是第一次渲染，只設置 prevValue 並跳過
        if (isFirstRender.current) {
            setPrevValue(value);
            isFirstRender.current = false;
            return;
        }

        // 只有在有前一個值時才計算差異
        if (prevValue !== null) {
            const diff = value - prevValue;
            setDifference(diff);

            // 根據差異設置箭頭旋轉
            if (diff > 0) {
                // 從水平旋轉到指向上
                animate(90, 0, {
                    duration: 0.5,
                    ease: "backOut",
                    onUpdate: (latest) => {
                        setArrowRotation(latest);
                    }
                });
            } else if (diff < 0) {
                // 從水平旋轉到指向下
                animate(-90, 0, {
                    duration: 0.5,
                    ease: "backOut",
                    onUpdate: (latest) => {
                        setArrowRotation(latest + 180);
                    }
                });
            }
        }

        // 更新前一個值以供下次比較
        setPrevValue(value);
    }, [value]);

    // Determine difference status
    const getDifferenceStatus = () => {
        if (difference > 0) return "badge-success text-success-content";
        if (difference < 0) return "badge-error text-error-content";
        return "badge-info";
    };

    const differenceStatus = getDifferenceStatus();

    // 解析並獲取對應的 Lucide React 圖示
    let IconComponent: LucideIcon;
    try {
        IconComponent = (Icons as unknown as Record<string, LucideIcon>)[Icon] || Icons.ChartNoAxesColumn;
    } catch (error) {
        IconComponent = Icons.ChartNoAxesColumn;
        console.error(error);
    }

    // 處理數字動畫
    useEffect(() => {
        const controls = animate(num, value, {
            duration: 2,
            ease: "circOut",
            onUpdate: (latest: number) => {
                const rounded = Math.round(latest);
                setNum(rounded);
                if (nodeRef.current) {
                    nodeRef.current.textContent = rounded.toString();
                }
                if (onChange) {
                    onChange(rounded);
                }
            }
        });

        return () => controls.stop();
    }, [value, onChange, num]);

    // 檢查差異值是否顯著（避免非常小的浮點數差異）
    const hasMeaningfulDifference = Math.abs(difference) > 0.01;

    return (
        <div className="bg-base-100 text-base-content p-4 rounded-lg shadow-md hover:shadow-lg transition-all w-1/4">
            <div className="grid grid-cols-3 items-start">
                {/* Left column: Icon */}
                <div className="text-primary flex justify-start">
                    <IconComponent size={48} className="text-primary"/>
                </div>

                {/* Middle column: Difference indicator (aligned to top) */}
                <div className="flex pt-1">
                    {prevValue !== null && hasMeaningfulDifference ? (
                        <div className={`badge badge-${differenceStatus} flex items-center gap-1`}>
                            <div className="transition-transform duration-500 ease-out" style={{ transform: `rotate(${arrowRotation}deg)` }}>
                                <Icons.ArrowUp size={14} />
                            </div>
                            {Math.abs(difference)}
                        </div>
                    ) : (
                        <div className="badge badge-ghost opacity-0">0</div>
                    )}
                </div>

                {/* Right column: Number and Title */}
                <div className="flex flex-col ml-3">
                    {/* Big number */}
                    <pre id="number-anime" className={`text-4xl mr-1 ${className}`} ref={nodeRef}>{num}</pre>

                    {/* Title below number */}
                    <div className="text-sm text-neutral-content">{Title}</div>
                </div>
            </div>
        </div>
    )
}
