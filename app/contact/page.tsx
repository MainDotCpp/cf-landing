import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "資産運用セミナーに関するお問い合わせはこちら。メール、電話でのご相談を受け付けております。受付時間：平日9:00-18:00（土日祝日を除く）",
  openGraph: {
    title: "お問い合わせ | 資産運用セミナー",
    description: "セミナーに関するご質問やご不明な点がございましたら、お気軽にお問い合わせください。",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
