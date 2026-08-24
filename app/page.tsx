import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

const schools = [
  "宇和島東高校",
  "宇和島南高校",
  "大洲高校",
  "大洲農業高校",
  "天竜高校",
  "南宇和高校",
  "八幡浜高校",
];

const learningSteps = [
  { number: "01", title: "歩く", text: "自分たちのまちを歩き、地形や暮らし、災害の痕跡を見つけます。" },
  { number: "02", title: "聞く", text: "家族や地域の方の経験に耳を傾け、地域の記憶を集めます。" },
  { number: "03", title: "重ねる", text: "地図や歴史資料、調査結果を重ね、地域が抱える課題を読み解きます。" },
  { number: "04", title: "描く", text: "守りたい暮らしを考え、災害への備えと事前復興の姿を提案します。" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">高校生と専門家で地域の未来を描く</p>
            <h1 id="hero-title">地域を知ることから、<br />災害への備えは始まる。</h1>
            <p className="hero-lead">
              まちを歩き、声を聞き、地図を囲む。中高生が地域の未来と
              事前復興を考える、年間を通した学びの場です。
            </p>
            <div className="button-row">
              <Link className="button button-primary" href="/activities">活動を見る</Link>
              <Link className="button button-secondary" href="/schools">参加高校を見る</Link>
            </div>
          </div>
          <div className="hero-images" aria-label="沿岸地域でのフィールドワークを支える風景">
            <figure className="hero-image-main">
              <img src="/images/home/coast-cliffs.jpg" alt="岩手県沿岸の断崖と海" />
            </figure>
            <figure className="hero-image-sub">
              <img src="/images/home/coast-dawn.jpg" alt="海を望む林と静かな空" />
            </figure>
          </div>
        </section>

        <section className="section shell" aria-labelledby="learning-title">
          <div className="section-heading">
            <p className="eyebrow">Our approach</p>
            <h2 id="learning-title">地域を読み、未来を考える</h2>
            <p>現場での気づきを出発点に、調査と対話を重ねて提案へつなげます。</p>
          </div>
          <ol className="learning-grid">
            {learningSteps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section section-tint">
          <div className="shell feature-grid">
            <figure className="feature-image">
              <img src="/images/home/fishing-harbor.jpg" alt="山々に囲まれた沿岸の漁港" />
            </figure>
            <div className="feature-copy">
              <p className="eyebrow">2025 activity</p>
              <h2>東北復興視察</h2>
              <p className="feature-meta">2025年8月1日—3日</p>
              <p>
                閖上、大川小学校、気仙沼、陸前高田、田老、釜石を訪ねました。
                被災の記憶と復興の現場に立ち、避難の判断、地域の対話、
                まちの再生について学びました。
              </p>
              <Link className="text-link" href="/activities/2025">2025年度の記録を読む <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="section shell schools-preview" aria-labelledby="schools-title">
          <div className="section-heading compact">
            <p className="eyebrow">Schools</p>
            <h2 id="schools-title">参加高校</h2>
            <p>2025年度は、愛媛県と静岡県の高校を中心に活動しています。</p>
          </div>
          <ul className="school-name-list">
            {schools.map((school) => <li key={school}>{school}</li>)}
          </ul>
          <Link className="text-link" href="/schools">参加高校の紹介を見る <span aria-hidden="true">→</span></Link>
        </section>

        <section className="section shell mission-panel" aria-labelledby="mission-title">
          <p className="eyebrow">Why geography?</p>
          <h2 id="mission-title">自ら地域を歩き、語りあい、問題を発見する。</h2>
          <p>
            地域のよりよい理解を下敷きに、災害復興への備えを考える。
            防災地理部は、「地理」と「防災」を現場で同時に考えながら、
            地域で生きる術を学んでいく活動の場です。
          </p>
          <Link className="text-link" href="/about">防災地理部について <span aria-hidden="true">→</span></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
