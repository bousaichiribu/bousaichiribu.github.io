import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { getActivities } from "./lib/activities";

const schools = [
  "宇和島東高校",
  "宇和島南高校",
  "大洲高校",
  "大洲農業高校",
  "天竜高校",
  "南宇和高校",
  "八幡浜高校",
];

export default function Home() {
  const latest = getActivities()[0];

  return (
    <>
      <SiteHeader />
      <main className="main-content" id="main-content">
        <section className="intro" aria-labelledby="page-title">
          <h1 id="page-title">防災地理部</h1>
          <div className="bio-text">
            <p>
              地理学者ブローデルの『地中海』は、「まず初めに山地」という意外な文章で始まります。
              都市は、その土地の歴史や地理を背景に、人々の暮らしを支える経済、そして文化の豊かさによって形づくられています。
              私たちは、自分たちが暮らす地域のことをどれだけ知っているといえるでしょうか。
            </p>
            <p>
              災害は忘れた頃にやってきます。被災してから地域の課題に向き合うのではなく、
              「地域のよりよい理解」を下敷きにした「災害復興への備え」を考えることが、いま求められています。
            </p>
            <p>
              防災地理部では、地域で生きる私たち自身が、さまざまな世代の人々とともに地域を歩き、語りあい、問題を発見します。
              そして地図を囲んで線を引き、地域の復興と災害への備えを描くことに取り組みます。
            </p>
          </div>
          <p className="signature">防災地理部代表　羽藤英二（東京大学教授）</p>

          <div className="top-links" aria-label="主要ページ">
            <Link href="/about">活動の理念と進め方</Link>
            <Link href="/schools">参加高校の紹介</Link>
            <Link href="/activities">年度ごとの活動記録</Link>
          </div>

          <div className="photo-strip" aria-label="活動地域の風景">
            <figure className="photo-large">
              <img src="/images/home/coast-cliffs.jpg" alt="海岸沿いの断崖と海" />
            </figure>
            <div className="photo-small-column">
              <figure><img src="/images/home/coast-dawn.jpg" alt="海を望む林と空" /></figure>
              <figure><img src="/images/home/fishing-harbor.jpg" alt="山に囲まれた漁港" /></figure>
            </div>
          </div>
        </section>

        <section className="home-section" aria-labelledby="activity-outline">
          <h2 id="activity-outline">活動概要</h2>
          <p>
            中高生が大学生や専門家とともに、まちあるき、聞き取り、地図や資料の分析、被災地の視察を行います。
            その成果をもとに災害シナリオと事前復興計画を考え、地域や復興デザイン会議で発表します。
          </p>
          <p><Link className="text-link" href="/about">詳しく見る →</Link></p>
        </section>

        {latest && (
          <section className="home-section" aria-labelledby="latest-activity">
            <h2 id="latest-activity">最新の活動</h2>
            <p className="meta">{latest.year}年度</p>
            <h3>{latest.title}</h3>
            <p>{latest.summary}</p>
            <p><Link className="text-link" href={`/activities/${latest.year}`}>活動記録を読む →</Link></p>
          </section>
        )}

        <section className="home-section" aria-labelledby="participating-schools">
          <h2 id="participating-schools">参加高校</h2>
          <p>{schools.join("、")}</p>
          <p><Link className="text-link" href="/schools">参加高校の紹介を見る →</Link></p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
