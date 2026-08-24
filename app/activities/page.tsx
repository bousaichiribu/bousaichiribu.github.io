import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "活動記録",
  description: "防災地理部の年度ごとの活動記録です。",
};

const archives = [
  { year: "2025", title: "東北復興視察と地域での学び", description: "東日本大震災の被災地を巡り、避難、復興計画、地域の合意形成について現地で学びました。", href: "/activities/2025", external: false },
  { year: "2024", title: "地域調査・東北視察・事前復興提案", description: "まちあるき、東北復興視察、大学生との演習、復興デザイン会議での発表までを行いました。", href: "https://www.bin.t.u-tokyo.ac.jp/bousai_24/", external: true },
  { year: "2023", title: "防災地理部 2023年度", description: "地域の地理を読み解き、災害シナリオと事前復興を考えた活動の記録です。", href: "https://www.bin.t.u-tokyo.ac.jp/bousai_23/", external: true },
  { year: "2022", title: "防災地理部 2022年度", description: "中高生と大学生、専門家がともに地域の未来を考えた活動の記録です。", href: "https://www.bin.t.u-tokyo.ac.jp/bousai_22/", external: true },
];

export default function ActivitiesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <header className="page-hero shell">
          <p className="eyebrow">Archive</p>
          <h1>年度ごとの活動記録</h1>
          <p className="lead">地域を歩き、復興の現場を訪ね、考えたことを提案する。各年度の活動と成果をまとめています。</p>
        </header>
        <section className="content-section shell" aria-label="年度別活動一覧">
          <div className="archive-list">
            {archives.map((archive) => (
              <article className="archive-card" key={archive.year}>
                <div className="archive-year">{archive.year}</div>
                <div>
                  <h2>{archive.title}</h2>
                  <p>{archive.description}</p>
                </div>
                {archive.external ? (
                  <a className="text-link" href={archive.href} target="_blank" rel="noreferrer">記録を見る <span aria-hidden="true">↗</span></a>
                ) : (
                  <Link className="text-link" href={archive.href}>記録を見る <span aria-hidden="true">→</span></Link>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
