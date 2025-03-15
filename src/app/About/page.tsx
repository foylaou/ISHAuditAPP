





export default function page(){
    return (
        <>
            <div className="container mx-auto px-4 py-8 text-base-content">
                <h1 className="text-3xl font-bold mb-6">關於我們</h1>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">石化督導資料庫系統</h2>

                    <div className="mb-6">
                        <h3 className="text-xl font-medium mb-2">系統宗旨</h3>
                        <p className="text-gray-700">
                            石化督導資料庫是一個專為追蹤和管理石化產業製程問題而設計的平台。本系統致力於促進製程安全改善，
                            提供一個集中化的平台，讓石化業者、中央及地方政府、專家委員能夠共同協作，
                            以提高產業安全標準和環保表現。
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-medium mb-2">系統功能</h3>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li>追蹤石化業者製程安全問題和改善進度</li>
                            <li>存檔並管理督導報告和相關文件</li>
                            <li>提供統計分析和趨勢報告</li>
                            <li>促進各方之間的溝通與協作</li>
                            <li>確保資料安全和隱私保護</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-medium mb-2">使用對象</h3>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li>石化產業業者</li>
                            <li>中央政府相關部門</li>
                            <li>地方政府環保與工安單位</li>
                            <li>專家委員會成員</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-medium mb-2">系統維護團隊</h3>
                        <p className="text-gray-700">
                            本系統由中華民國工業安全衛生協會負責開發和維護，若有任何問題或建議，
                            請透過「聯絡我們」頁面提出。
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
