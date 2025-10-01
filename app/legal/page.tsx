import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | 資産運用セミナー",
  description: "特定商取引法に基づく事業者情報",
};

export default function LegalPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* 返回首页链接 */}
          <Link 
            href="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
          >
            <span className="mr-2">←</span>
            トップページに戻る
          </Link>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            特定商取引法に基づく表記
          </h1>
          
          <p className="text-sm text-slate-500 mb-8">最終更新日：2025年9月30日</p>

          {/* 事業者情報 */}
          <div className="space-y-6">
            {/* 販売業者 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                販売業者
              </h2>
              <p className="text-slate-600">株式会社アセットプランニング・ジャパン</p>
            </div>

            {/* 運営責任者 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                運営責任者
              </h2>
              <p className="text-slate-600">代表取締役社長 高橋 健一</p>
            </div>

            {/* 所在地 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                所在地
              </h2>
              <p className="text-slate-600">〒105-0001</p>
              <p className="text-slate-600">東京都港区虎ノ門2-10-4 オークラプレステージタワー15F</p>
            </div>

            {/* 電話番号 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                電話番号
              </h2>
              <p className="text-slate-600">03-6550-8820</p>
              <p className="text-sm text-slate-500 mt-1">受付時間：平日 9:00-18:00（土日祝日を除く）</p>
            </div>

            {/* メールアドレス */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                メールアドレス
              </h2>
              <p className="text-slate-600">support@asset-planning.jp</p>
            </div>

            {/* 運営統括責任者 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                運営統括責任者
              </h2>
              <p className="text-slate-600">田中 美咲</p>
            </div>

            {/* 追加手数料等の追加料金 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                追加手数料等の追加料金
              </h2>
              <p className="text-slate-600">インターネット接続料金、通信料金等はお客様のご負担となります。</p>
            </div>

            {/* 商品・サービスの内容 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                商品・サービスの内容
              </h2>
              <p className="text-slate-600 mb-3">
                資産運用に関するオンラインセミナーの提供
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                <li>無料セミナー：資産運用の基礎知識に関する情報提供</li>
                <li>有料セミナー：詳細な投資戦略に関する専門的な情報提供</li>
              </ul>
            </div>

            {/* 販売価格 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                販売価格
              </h2>
              <p className="text-slate-600 mb-2">各セミナーページに記載の金額とします。</p>
              <p className="text-slate-600">表示価格は全て税込価格です。</p>
            </div>

            {/* 支払方法 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                支払方法
              </h2>
              <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                <li>クレジットカード決済（Visa、MasterCard、JCB、American Express）</li>
                <li>銀行振込</li>
                <li>コンビニ決済</li>
              </ul>
            </div>

            {/* 支払時期 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                支払時期
              </h2>
              <p className="text-slate-600">
                各支払方法に応じて、お申し込み時に定める時期にお支払いいただきます。
              </p>
            </div>

            {/* 商品の引渡時期 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                サービスの提供時期
              </h2>
              <p className="text-slate-600">
                お申し込み完了後、セミナー開催日に参加URLをメールにてお送りいたします。
              </p>
            </div>

            {/* 返品・交換・キャンセル等 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                返品・交換・キャンセル等
              </h2>
              <p className="text-slate-600 mb-3">
                サービスの性質上、以下の場合を除き、原則として返金・キャンセルはお受けできません。
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>当社の都合によりセミナーが中止となった場合：全額返金いたします</li>
                <li>開催日の7日前までのキャンセル：全額返金いたします（振込手数料を除く）</li>
                <li>開催日の3日前までのキャンセル：50%を返金いたします</li>
                <li>開催日の3日前以降のキャンセル：返金はいたしかねます</li>
              </ul>
            </div>

            {/* 不良品の取扱条件 */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                不良品の取扱条件
              </h2>
              <p className="text-slate-600">
                当社のシステムトラブル等により、サービスが正常に提供できなかった場合は、全額返金または振替対応をいたします。開催後7日以内にお問い合わせください。
              </p>
            </div>

            {/* 免責事項 */}
            <div className="pb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                免責事項
              </h2>
              <p className="text-slate-600 mb-3">
                当社のセミナーは、投資助言・勧誘を目的とするものではありません。
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>投資に関する最終決定はお客様ご自身の判断でなさるようお願いいたします</li>
                <li>投資にはリスクが伴い、元本割れの可能性があります</li>
                <li>当社は、セミナー内容に基づいて行われた投資判断の結果について、一切の責任を負いません</li>
              </ul>
            </div>
          </div>

          {/* 返回链接 */}
          <div className="mt-12 pt-6 border-t border-slate-200">
            <Link 
              href="/" 
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span className="mr-2">←</span>
              トップページに戻る
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
