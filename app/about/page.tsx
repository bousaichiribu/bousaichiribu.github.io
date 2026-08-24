import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "防災地理部について",
  description: "防災地理部の理念と活動の進め方を紹介します。",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <header className="page-hero shell">
          <p className="eyebrow">About</p>
          <h1>地域のよりよい理解を、<br />災害復興への備えに。</h1>
        </header>
        <section className="content-section shell">
          <article className="prose">
            <h2>防災地理部の活動理念</h2>
            <p>地形や歴史、暮らしは、長い時間をかけて地域の姿を形づくっています。けれども私たちは、自分たちが暮らす地域のことを、どれだけ知っているでしょうか。</p>
            <p>災害が起きれば、身の回りの暮らし、経済、文化の課題に向き合い、復興への道筋を描くことになります。だからこそ、災害が起きる前から地域をよく知り、何を守り、どのように立ち直るかを考えておくことが大切です。</p>
            <p>防災地理部では、地域で生きる私たち自身が、さまざまな世代の人とともにまちを歩き、語りあい、問題を発見します。声に耳を傾け、地図を囲んで線を引き、地域の復興と災害への備えを描きます。</p>
            <p>都市計画や防災・復興を専門とする大学生や専門家と学びながら、地域の総合理解、課題の抽出、災害シナリオ、事前復興計画へと考えを深め、成果を発信します。</p>
            <p className="signature">防災地理部代表　羽藤英二</p>

            <h3>活動の進め方</h3>
            <p>過去と現在の地形図を重ねる。家族や地域の方に話を聞く。他地域の復興事例を調べる。事前復興プランを考え、大学生や専門家、地域の方と議論する。こうした一つひとつの実践を年間の学びとして積み重ねます。</p>

            <h3>お問い合わせ</h3>
            <p>活動への参加・見学、その他のお問い合わせは、担当の松永隆宏までご連絡ください。<br /><a className="text-link" href="mailto:matsunaga@bin.t.u-tokyo.ac.jp">matsunaga [at] bin.t.u-tokyo.ac.jp</a></p>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
