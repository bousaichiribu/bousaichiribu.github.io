import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "活動について",
  description: "防災地理部の理念と年間活動の進め方を紹介します。",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="main-content" id="main-content">
        <article className="prose">
          <h1>活動について</h1>

          <h2>防災地理部の理念</h2>
          <p>
            地形や歴史、暮らしは、長い時間をかけて地域の姿を形づくっています。
            災害が起きれば、日々の暮らし、経済、文化の課題に向き合い、復興への道筋を描くことになります。
            だからこそ、災害が起きる前から地域をよく知り、何を守り、どのように立ち直るかを考えておくことが大切です。
          </p>
          <p>
            防災地理部では、地域で生きる私たち自身が、さまざまな世代の人とともにまちを歩き、語りあい、問題を発見します。
            声に耳を傾け、地図を囲んで線を引き、地域の復興と災害への備えを描きます。
          </p>
          <p className="signature">防災地理部代表　羽藤英二</p>

          <h2>一年間の活動</h2>
          <ol className="plain-steps">
            <li><strong>地域を知る</strong><br />過去と現在の地図を重ね、まちを歩き、家族や地域の方に話を聞きます。</li>
            <li><strong>災害と復興を学ぶ</strong><br />被災地の視察や専門家との対話を通して、避難と復興の実例を学びます。</li>
            <li><strong>地域の未来を描く</strong><br />大学生や専門家と議論し、災害シナリオと事前復興の提案をまとめます。</li>
            <li><strong>地域へ伝える</strong><br />復興デザイン会議や地域の発表会で成果を共有します。</li>
          </ol>

          <h2>お問い合わせ</h2>
          <p>
            活動への参加・見学、その他のお問い合わせは、担当の松永隆宏までご連絡ください。<br />
            matsunaga [at] bin.t.u-tokyo.ac.jp
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
