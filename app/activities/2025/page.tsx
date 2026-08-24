import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "2025年度の活動",
  description: "2025年8月に行った東日本大震災復興視察の記録です。",
};

const itinerary = [
  { day: "8月1日（金）", places: ["宮城県名取市・閖上地区", "石巻市震災遺構 大川小学校", "ウィーアーワン北上 佐藤尚美さんの講演", "石巻市での振り返りミーティング"] },
  { day: "8月2日（土）", places: ["気仙沼市東日本大震災遺構・伝承館", "JR気仙沼線BRT", "陸前高田市 東日本大震災津波伝承館", "田老地区", "釜石鵜住居復興スタジアム"] },
  { day: "8月3日（日）", places: ["釜石市唐丹町 本郷地区", "釜石市唐丹町 花露辺地区"] },
];

const notes = [
  { title: "避難を決めておく", text: "災害時の判断をその場だけに委ねず、家族や地域で避難の方針を共有しておく大切さを学びました。" },
  { title: "対話を積み重ねる", text: "復興計画では、説得だけでなく共感を生み、若い世代の声も含めて意思決定する必要があります。" },
  { title: "地域ごとの地理を見る", text: "同じ津波災害でも地形や暮らしは異なります。現地を歩くことで、地域に合った備えを考えました。" },
];

export default function Activity2025Page() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <header className="page-hero shell">
          <p className="eyebrow">2025 activity</p>
          <h1>東日本大震災<br />復興視察</h1>
          <p className="lead">2025年8月1日から3日まで、宮城県・岩手県の被災地を巡り、避難と復興まちづくりを学びました。</p>
        </header>
        <section className="content-section shell">
          <div className="activity-intro">
            <figure><img src="/images/home/coast-harbor.jpg" alt="岩手県沿岸の入り江" /></figure>
            <div>
              <p className="eyebrow">Field study</p>
              <h2>現場に立ち、地域の選択を考える</h2>
              <p>被災の記憶を伝える施設や学校、復興した市街地、堤防をつくらない選択をした集落を訪ねました。語り部や地域の方の言葉を聞き、自分たちの地域なら何を守り、どう備えるかを考えるための視察です。</p>
            </div>
          </div>

          <div className="itinerary" aria-label="視察日程">
            {itinerary.map((item) => (
              <section className="itinerary-day" key={item.day}>
                <h3>{item.day}</h3>
                <ul>{item.places.map((place) => <li key={place}>{place}</li>)}</ul>
              </section>
            ))}
          </div>
        </section>

        <section className="section section-tint">
          <div className="shell">
            <div className="section-heading compact">
              <p className="eyebrow">What we learned</p>
              <h2>視察から得た三つの視点</h2>
            </div>
            <div className="learning-notes">
              {notes.map((note) => <article className="learning-note" key={note.title}><h3>{note.title}</h3><p>{note.text}</p></article>)}
            </div>
            <Link className="text-link" href="/activities">年度別の活動記録へ戻る <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
