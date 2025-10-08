'use client'

import { useEffect } from 'react'

export default function OctoberLandingPage() {
  // 设置页面标题
  useEffect(() => {
    document.title = '十月の投資チャンス | 今週の注目銘柄'
  }, [])

  // LINE添加好友函数
  const addLineFunc = () => {
    window.open('https://sdun.me/NHJDH5', '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">

        {/* 区块 1 - 主标题钩子 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            十月の第一波を
            <br className="sm:hidden" />
            つかみたい人へ
          </h1>
        </div>

        {/* 区块 2 - 副标题 */}
        <div className="text-center mb-6">
          <p className="text-xl sm:text-2xl text-gray-700 font-medium">
            もう手探りはやめましょう
          </p>
        </div>

        {/* 简单赚钱承诺 */}
        <div className="text-center mb-8">
          <p className="text-lg sm:text-xl text-[#06C755] font-bold">
            簡単に、すぐに、確実に
            <br />
            利益を手に入れる方法
          </p>
        </div>

        {/* 区块 3 - 价值主张 */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <p className="text-base sm:text-lg text-gray-800 mb-4 leading-relaxed">
            公開データと独自指標を今週のチャンスリストに凝縮しました
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded border-l-4 border-[#06C755]">
              <p className="text-sm sm:text-base font-semibold text-gray-800">ホットテーマ</p>
            </div>
            <div className="bg-white p-4 rounded border-l-4 border-[#06C755]">
              <p className="text-sm sm:text-base font-semibold text-gray-800">参入水準</p>
            </div>
            <div className="bg-white p-4 rounded border-l-4 border-[#06C755]">
              <p className="text-sm sm:text-base font-semibold text-gray-800">損切り目安</p>
            </div>
            <div className="bg-white p-4 rounded border-l-4 border-[#06C755]">
              <p className="text-sm sm:text-base font-semibold text-gray-800">心理の転換点</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-700 mt-4">
            を一度で理解できます
          </p>
          <p className="text-base sm:text-lg text-[#06C755] font-bold mt-4 text-center">
            そして今すぐ稼ぎ始められます
          </p>
        </div>

        {/* 收益承诺区块 */}
        <div className="bg-gradient-to-r from-[#06C755] to-[#00B900] p-6 rounded-lg mb-8 text-center">
          <p className="text-white text-4xl sm:text-5xl font-bold mb-2">週に160万円</p>
          <p className="text-white text-lg sm:text-xl">稼げるチャンスが</p>
          <p className="text-white text-lg sm:text-xl">ここにあります</p>
        </div>

        {/* 完全無料徽章 */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#E60012] text-white px-6 py-2 rounded-full font-bold text-lg">
            完全無料
          </div>
        </div>

        {/* 区块 4 - 主CTA按钮 */}
        <div className="mb-6">
          <button
            onClick={addLineFunc}
            className="w-full h-14 bg-[#06C755] hover:bg-[#00B900] text-white font-bold text-lg rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📱</span>
            <span>今すぐ友だち追加</span>
          </button>
        </div>

        {/* 区块 5 - 使用说明 */}
        <div className="bg-gray-50 p-5 rounded-lg mb-8 border-2 border-gray-200">
          <p className="text-center text-base sm:text-lg text-gray-800">
            トークで
            <span className="font-bold text-[#06C755] text-xl">「十月」</span>
            と送ってください
          </p>
        </div>

        {/* 区块 6 - 获得内容 */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
            すぐにお送りする内容
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-[#06C755] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <p className="text-base sm:text-lg text-gray-800 pt-1">今週のチャンス目録</p>
            </div>
            <div className="flex items-start gap-3 bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-[#06C755] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <p className="text-base sm:text-lg text-gray-800 pt-1">六十秒の音声振り返り</p>
            </div>
            <div className="flex items-start gap-3 bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-[#06C755] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <p className="text-base sm:text-lg text-gray-800 pt-1">実例の解説</p>
            </div>
          </div>
        </div>

        {/* 区块 7 - 线上交流说明 */}
        <div className="bg-gray-50 p-5 rounded-lg mb-8">
          <p className="text-sm sm:text-base text-gray-700 text-center leading-relaxed">
            追加後はオンラインで情報を共有し、
            <br className="sm:hidden" />
            市場の変化をリアルタイムでお知らせします
          </p>
        </div>

        {/* 区块 8 - 承诺说明 */}
        <div className="mb-8">
          <div className="flex justify-center gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-base sm:text-lg font-semibold text-gray-800">
                ✅ 簡単に
                <br />
                稼げる
              </p>
            </div>
            <div className="w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-base sm:text-lg font-semibold text-gray-800">
                ✅ すぐに
                <br />
                結果が出る
              </p>
            </div>
          </div>
        </div>

        {/* 区块 9 - 紧迫感强调 */}
        <div className="bg-[#E60012] p-6 rounded-lg mb-8">
          <p className="text-center text-lg sm:text-xl font-bold text-white leading-relaxed">
            今日始めた人だけが
            <br />
            明日の160万円を手にします
          </p>
        </div>

        {/* 区块 10 - 二次CTA */}
        <div className="mb-6">
          <p className="text-center text-base sm:text-lg text-gray-800 mb-4 font-medium">
            今すぐ追加して、迷いを確信に変えましょう
          </p>
          <button
            onClick={addLineFunc}
            className="w-full h-14 bg-[#06C755] hover:bg-[#00B900] text-white font-bold text-lg rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📱</span>
            <span>LINE友だち追加はこちら</span>
          </button>
        </div>

      </div>
    </main>
  )
}
