'use client';

// 公司信息
const companyInfo = {
  name: "株式会社アセットプランニング・ジャパン",
  postalCode: "〒105-0001",
  address: "東京都港区虎ノ門2-10-4 オークラプレステージタワー15F",
  registration: "関東財務局長（金商）第3248号",
  association: "一般社団法人日本投資顧問業協会",
  contact: "support@asset-planning.jp",
  phone: "03-6550-8820",
  hours: "平日 9:00-18:00"
};

// 风险警告
const riskWarning = `投資・金融商品には価格変動リスクがあり、元本割れの可能性があります。本セミナーは投資助言・勧誘を目的とするものではありません。最終的な投資判断はご自身の責任において行ってください。`;

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 风险警告 */}
        <div className="mb-6 p-4 border border-amber-500/30 bg-amber-500/5 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {riskWarning}
            </p>
          </div>
        </div>

        {/* 运营者信息 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-3">運営会社情報</h3>
            <div className="space-y-1 text-xs">
              <p><span className="text-slate-400">会社名：</span>{companyInfo.name}</p>
              <p><span className="text-slate-400">所在地：</span>{companyInfo.postalCode}</p>
              <p className="ml-12">{companyInfo.address}</p>
              <p><span className="text-slate-400">登録：</span>{companyInfo.registration}</p>
              <p><span className="text-slate-400">加入協会：</span>{companyInfo.association}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-3">お問い合わせ</h3>
            <div className="space-y-1 text-xs">
              <p><span className="text-slate-400">Email：</span>{companyInfo.contact}</p>
              <p><span className="text-slate-400">電話：</span>{companyInfo.phone}</p>
              <p><span className="text-slate-400">受付時間：</span>{companyInfo.hours}</p>
            </div>
          </div>
        </div>

        {/* 法律链接 */}
        <div className="border-t border-slate-700 pt-6 mb-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs">
            <a href="/privacy" className="text-slate-400 hover:text-slate-200 transition-colors">
              プライバシーポリシー
            </a>
            <a href="/legal" className="text-slate-400 hover:text-slate-200 transition-colors">
              特定商取引法に基づく表記
            </a>
            <a href="/contact" className="text-slate-400 hover:text-slate-200 transition-colors">
              お問い合わせ
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-slate-500">
          <p>&copy; 2025 {companyInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
