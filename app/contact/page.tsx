import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "防災地理部へのお問い合わせと関連リンクです。",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="main-content" id="main-content">
        <h1>お問い合わせ</h1>
        <div className="contact-box">
          <p>活動への参加・見学、その他のお問い合わせは、下記までご連絡ください。</p>
          <p className="contact-person">松永隆宏<br />matsunaga [at] bin.t.u-tokyo.ac.jp</p>
        </div>

        <section className="related-links" aria-labelledby="related-links-heading">
          <h2 id="related-links-heading">関連リンク</h2>
          <ul>
            <li><a href="https://dss.bin.t.u-tokyo.ac.jp/alliance/" target="_blank" rel="noreferrer">復興デザイン会議 ↗</a></li>
            <li><a href="https://www.bin.t.u-tokyo.ac.jp/" target="_blank" rel="noreferrer">東京大学 羽藤研究室 ↗</a></li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
