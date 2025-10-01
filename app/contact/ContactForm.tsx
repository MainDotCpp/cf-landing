'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";

export default function ContactForm() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('お問い合わせは以下のメールアドレスまでお願いいたします：\n\nsupport@asset-planning.jp\n\n受付時間：平日 9:00-18:00');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-slate-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
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
            お問い合わせ
          </h1>
          
          <p className="text-slate-600 leading-relaxed mb-8">
            セミナーに関するご質問やご不明な点がございましたら、お気軽にお問い合わせください。
          </p>

          {/* 联系信息 */}
          <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              📧 お問い合わせ先
            </h2>
            <div className="space-y-2 text-slate-700">
              <p><strong>メールアドレス：</strong>support@asset-planning.jp</p>
              <p><strong>電話番号：</strong>03-6550-8820</p>
              <p><strong>受付時間：</strong>平日 9:00-18:00（土日祝日を除く）</p>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              ※ お問い合わせへの回答には、2〜3営業日程度お時間をいただく場合がございます。
            </p>
          </div>

          {/* 联系表单 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              お問い合わせフォーム
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 名前 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="山田太郎"
                />
              </div>

              {/* 邮箱 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="example@email.com"
                />
              </div>

              {/* 电话（可选） */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  電話番号（任意）
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="03-1234-5678"
                />
              </div>

              {/* 问题类型 */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                  お問い合わせ種別 <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">選択してください</option>
                  <option value="seminar">セミナー内容について</option>
                  <option value="registration">参加登録について</option>
                  <option value="technical">技術的な問題</option>
                  <option value="other">その他</option>
                </select>
              </div>

              {/* 问题内容 */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  お問い合わせ内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="お問い合わせ内容をご記入ください"
                />
              </div>

              {/* 提交按钮 */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  送信する
                </button>
              </div>

              {/* 说明文字 */}
              <p className="text-xs text-slate-500 text-center">
                ※ 現在、フォーム送信機能は準備中です。<br />
                お急ぎの場合は、上記メールアドレスまで直接ご連絡ください。
              </p>
            </form>
          </div>

          {/* 注意事项 */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              ご注意事項
            </h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>• お問い合わせ内容によっては、回答にお時間をいただく場合がございます。</li>
              <li>• 土日祝日のお問い合わせは、翌営業日以降の対応となります。</li>
              <li>• 投資助言に関するご質問にはお答えできかねます。</li>
              <li>• いただいた個人情報は、お問い合わせ対応のみに使用いたします。</li>
            </ul>
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
