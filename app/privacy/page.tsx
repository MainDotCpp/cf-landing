import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 資産運用セミナー",
  description: "個人情報保護方針について",
};

export default function PrivacyPage() {
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
            プライバシーポリシー
          </h1>
          
          <p className="text-sm text-slate-500 mb-8">最終更新日：2025年9月30日</p>

          {/* 前言 */}
          <p className="text-slate-600 leading-relaxed mb-6">
            株式会社アセットプランニング・ジャパン（以下「当社」といいます）は、お客様の個人情報の保護を重要な責務と考え、以下の方針に基づき個人情報の適切な取り扱いに努めます。
          </p>

          {/* 1. 個人情報の収集について */}
          <h2 className="text-xl font-semibold text-slate-700 mt-8 mb-3">
            1. 個人情報の収集について
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            当社は、以下の目的のために必要な範囲で個人情報を収集することがあります。
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6 ml-4">
            <li>セミナー・イベントの運営および参加者管理</li>
            <li>お客様からのお問い合わせへの対応</li>
            <li>サービスの提供および向上</li>
            <li>メールマガジン等の情報提供</li>
          </ul>

          {/* 2. 個人情報の利用目的 */}
          <h2 className="text-xl font-semibold text-slate-700 mt-8 mb-3">
            2. 個人情報の利用目的
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            当社は、収集した個人情報を以下の目的で利用いたします。
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6 ml-4">
            <li>セミナー・イベントの開催通知および関連情報の提供</li>
            <li>お客様からのお問い合わせに対する回答</li>
            <li>当社サービスに関する情報提供</li>
            <li>統計データの作成（個人を特定できない形式）</li>
          </ul>

          {/* 3. 個人情報の管理 */}
          <h2 className="text-xl font-semibold text-slate-700 mt-8 mb-3">
            3. 個人情報の管理
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            当社は、個人情報の漏洩、滅失、毀損等を防止するため、必要かつ適切な安全管理措置を講じます。また、個人情報を取り扱う従業員に対して、適切な監督を行います。
          </p>

          {/* 4. 第三者への提供 */}
          <h2 className="text-xl font-semibold text-slate-700 mt-8 mb-3">
            4. 第三者への提供
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            当社は、以下の場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6 ml-4">
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合</li>
            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
            <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
          </ul>

          {/* 5. Cookieの使用について */}
          <h2 className="text-xl font-semibold text-slate-700 mt-8 mb-3">
            5. Cookieの使用について
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            当社のウェブサイトでは、サービスの利便性向上のためCookieを使用することがあります。Cookieの使用を希望されない場合は、ブラウザの設定で無効にすることができますが、一部のサービスが利用できなくなる可能性があります。
          </p>

          {/* 6. 個人情報の開示・訂正・削除 */}
          <h2 className="text-xl font-semibold text-slate-700 mt-8 mb-3">
            6. 個人情報の開示・訂正・削除
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            お客様は、当社が保有する個人情報について、開示、訂正、利用停止、削除等を求めることができます。ご希望の場合は、下記のお問い合わせ窓口までご連絡ください。
          </p>

          {/* 7. お問い合わせ窓口 */}
          <h2 className="text-xl font-semibold text-slate-700 mt-8 mb-3">
            7. お問い合わせ窓口
          </h2>
          <div className="bg-slate-50 p-6 rounded-lg mb-8">
            <p className="text-slate-600 mb-2"><strong>株式会社アセットプランニング・ジャパン</strong></p>
            <p className="text-slate-600 mb-2">個人情報お問い合わせ窓口</p>
            <p className="text-slate-600 mb-2">〒105-0001</p>
            <p className="text-slate-600 mb-2">東京都港区虎ノ門2-10-4 オークラプレステージタワー15F</p>
            <p className="text-slate-600 mb-2">電話: 03-6550-8820</p>
            <p className="text-slate-600 mb-2">Email: support@asset-planning.jp</p>
            <p className="text-slate-600">受付時間: 平日 9:00-18:00</p>
          </div>

          {/* 8. プライバシーポリシーの変更 */}
          <h2 className="text-xl font-semibold text-slate-700 mt-8 mb-3">
            8. プライバシーポリシーの変更
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            当社は、法令の変更や事業内容の変更等に伴い、本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当ウェブサイトに掲載した時点で効力を生じるものとします。
          </p>

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
