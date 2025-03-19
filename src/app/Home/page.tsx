"use client"
import PieExample from "@/components/chart/Pie";
import BarExample from "@/components/chart/Bar";
import BoxPlotExample from "@/components/chart/BoxPlot";
import NumberAnime from "@/components/Number/NumberAnime";
import {useEffect, useState} from "react";

export default function Page() {
    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
    setIsLoaded(true)
    console.log("Page component mounted")
  }, [])
    if (!isLoaded) {
      return (<>

        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
          <div className="container mx-auto px-4 py-8">
            {/* 頁面標題骨架 */}
            <div className="mb-8 flex justify-center">
              <div className="skeleton h-10 w-60"></div>
            </div>

            {/* 主要功能區塊骨架 */}
            <div className="bg-base-200 text-base-content rounded-xl shadow-lg overflow-hidden mb-10 transition-all">
              <div className="border-b border-base-300 p-4">
                <div className="skeleton h-7 w-32"></div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 三個功能按鈕的骨架 */}
                  <div className="skeleton h-16 w-full"></div>
                  <div className="skeleton h-16 w-full"></div>
                  <div className="skeleton h-16 w-full"></div>
                </div>
              </div>
            </div>

            {/* 儀表板區塊骨架 */}
            <div className="bg-base-200 text-base-content rounded-xl mb-10 shadow-lg overflow-hidden transition-all">
              <div className="border-b border-base-300 p-4">
                <div className="skeleton h-7 w-32"></div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 三個圖表的骨架 */}
                  <div className="bg-base-100 p-4 rounded-lg shadow-md">
                    <div className="flex justify-center mb-2">
                      <div className="skeleton h-6 w-36"></div>
                    </div>
                    <div className="aspect-square">
                      <div className="skeleton w-full h-full rounded-lg"></div>
                    </div>
                  </div>

                  <div className="bg-base-100 p-4 rounded-lg shadow-md">
                    <div className="flex justify-center mb-2">
                      <div className="skeleton h-6 w-36"></div>
                    </div>
                    <div className="aspect-square">
                      <div className="skeleton w-full h-full rounded-lg"></div>
                    </div>
                  </div>

                  <div className="bg-base-100 p-4 rounded-lg shadow-md">
                    <div className="flex justify-center mb-2">
                      <div className="skeleton h-6 w-36"></div>
                    </div>
                    <div className="aspect-square">
                      <div className="skeleton w-full h-full rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 數字動畫區塊骨架 */}
            <div className="bg-base-200 text-base-content rounded-xl shadow-lg overflow-hidden transition-all">
              <div className="p-6 flex flex-col items-center">
                <div className="skeleton h-5 w-32 mb-3"></div>
                <div className="skeleton h-10 w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </>)
    }
  return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-primary mb-8 text-center">督導管理系統</h1>

          {/* 主要功能區塊 */}
          <div
              className="bg-base-200 text-base-content rounded-xl shadow-lg overflow-hidden mb-10 transition-all hover:shadow-xl">
            <div className="border-b border-base-300">
              <h2 className="text-xl font-semibold p-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                主要功能
              </h2>
            </div>

            <div className="p-6">
              <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    className="btn btn-primary btn-lg text-3xl transition-all hover:scale-105 flex items-center justify-center gap-2 h-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  查詢督導資料
                </button>

                <button
                    className="btn btn-secondary btn-lg text-3xl transition-all hover:scale-105 flex items-center justify-center gap-2 h-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  建立督導資料
                </button>

                <button
                    className="btn btn-neutral btn-lg text-3xl transition-all hover:scale-105 flex items-center justify-center gap-2 h-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  查看統計報告
                </button>
              </div>
            </div>
          </div>

          {/* 儀表板區塊 */}
          <div
              className="bg-base-200 text-base-content rounded-xl mb-10 shadow-lg overflow-hidden transition-all hover:shadow-xl">
          <div className="border-b border-base-300">
            <h2 className="text-xl font-semibold p-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              儀表板
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-base-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                <h3 className="text-lg font-medium mb-2 text-center">圓餅圖分析</h3>
                <div className="aspect-square">
                  <PieExample/>
                </div>
              </div>

              <div className="bg-base-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                <h3 className="text-lg font-medium mb-2 text-center">長條圖分析</h3>
                <div className="aspect-square">
                  <BarExample/>
                </div>
              </div>

              <div className="bg-base-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                <h3 className="text-lg font-medium mb-2 text-center">箱形圖分析</h3>
                <div className="aspect-square">
                  <BoxPlotExample/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
            className="bg-base-200 text-base-content rounded-xl  shadow-lg overflow-hidden transition-all hover:shadow-xl">
            <NumberAnime
                value={9000}
                className={"text-base-content"}
                Title="督導人次"
            />
          </div>

        </div>
      </div>
      );
      }
