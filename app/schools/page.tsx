import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "参加高校",
  description: "2025年度の防災地理部に参加する高校を紹介します。",
};

const schools = [
  { name: "宇和島東高校", region: "愛媛県宇和島市" },
  { name: "宇和島南高校", region: "愛媛県宇和島市" },
  { name: "大洲高校", region: "愛媛県大洲市" },
  { name: "大洲農業高校", region: "愛媛県大洲市" },
  { name: "南宇和高校", region: "愛媛県愛南町" },
  { name: "八幡浜高校", region: "愛媛県八幡浜市" },
  { name: "天竜高校", region: "静岡県浜松市" },
];

export default function SchoolsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <header className="page-hero shell">
          <p className="eyebrow">Schools</p>
          <h1>参加高校</h1>
          <p className="lead">それぞれの地域で暮らす高校生が、地元の地理と災害を見つめ、互いの学びを持ち寄ります。</p>
        </header>
        <section className="content-section shell" aria-label="2025年度参加高校一覧">
          <div className="schools-grid">
            {schools.map((school) => (
              <article className="school-card" key={school.name}>
                <p className="region">{school.region}</p>
                <h2>{school.name}</h2>
                <p>地域調査や視察、事前復興プランの検討を通して活動します。</p>
              </article>
            ))}
          </div>
          <p className="notice">掲載校は2025年度の中心的な参加校です。活動回によって参加校が異なる場合があります。</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
