import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "参加高校",
  description: "防災地理部に参加している高校を紹介します。",
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
      <main className="main-content" id="main-content">
        <h1>参加高校</h1>
        <p className="page-lead">
          2025年度は、愛媛県と静岡県の高校を中心に活動しています。
          各校が自分たちの地域を調べ、互いの学びを持ち寄ります。
        </p>

        <dl className="school-list">
          {schools.map((school) => (
            <div key={school.name}>
              <dt>{school.name}</dt>
              <dd>{school.region}</dd>
            </div>
          ))}
        </dl>

        <p className="note">年度や活動回によって、参加校が異なる場合があります。過年度の参加校は各年度の活動記録に掲載しています。</p>
      </main>
      <SiteFooter />
    </>
  );
}
