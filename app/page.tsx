import Link from "next/link";
import { HomeCarousel } from "./components/HomeCarousel";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { getActivities } from "./lib/activities";

export default function Home() {
  const latest = getActivities()[0];

  return (
    <>
      <SiteHeader />
      <HomeCarousel />
      <main className="main-content" id="main-content">
        <section className="intro" aria-labelledby="page-title">
          <h1 id="page-title">防災地理部</h1>
          <h2 className="intro-heading">防災地理部の活動理念</h2>
          <div className="bio-text">
            <p>
              地理学者ブローデルの「地中海」を手にとると、「まず初めに山地」という意外な文章で始まります。地形によってその運命を大きく左右された地中海を描いた物語は、人間の生活全般に対して、長くにわたって影響を与え続ける地域的・社会的な構造の学問「地理」の重要性を示唆しています。地理を学ぶことは、その地域に生きる上で必須であることは疑いの余地もない、しかし私たちは、自分たちが暮らしている地域のことをどれだけ知っているといえるでしょうか。
            </p>
            <p>
              災害は忘れた頃にやってくる。長い時間、地域で暮らしていれば、災害に直面することもあるでしょう。災害が一度起きれば、地域の存続そのものが左右されることになります。危機に直面した地域で、わたしたちは、身の回りの暮らし、経済、文化の問題解決を迫られることになるでしょうか。そのとき、私たちは、何を頼りに、復興のための道筋を描けばいいでしょうか。「地域のよりよい理解」を下敷にした「災害復興への備え」を考えることが今求められています。
            </p>
            <p>
              「防災地理部」では、地域で生きる私たち自身が、さまざまな世代の人々とともに、自ら地域を歩き、語りあい、問題を発見すること。さまざまな声に耳を傾け、懸命に考えること。そうして得られた地域のよりよい理解に基づいて、地図を囲んで線を引き、地域の復興と災害への備えを描くことに、みんなで取り組んでみたいと考えています。
            </p>
            <p>
              こうした学びを独習で進めることは簡単ではありません。防災地理部では、東京大学工学部社会基盤学科の基礎プロジェクト１で、学部３年生が取り組んでいる演習資料を活用しながら、都市計画や防災・復興を専門とする大学生らともに学びを深めます。地域の地理の総合理解、地理的課題の抽出と災害シナリオの作成、事前復興計画の策定までを、複数の学校共同で行い、東京大学で12月に開催予定の復興デザイン会議で復興に携わる全国の人に向けて発信します。
            </p>
            <p>
              災害からの地域復興は、どのような形をとるにせよ、そのいずれもが、空間の力を借りることなく、十分な力を発揮することは難しいでしょう。「防災地理部」では「地理」と「防災」の問題を、同時に現場で考えることを通じて、地域で生きる術を学んでいくための活動の場です。地域のみなさんと一緒に楽しく学んでいきましょう。なにとぞよろしくお願いいたします。
            </p>
          </div>
          <p className="signature">羽藤英二</p>

          <div className="top-links" aria-label="主要ページ">
            <Link href="/activities">年度ごとの活動記録</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>

        </section>

        <section className="home-section" aria-labelledby="activity-outline">
          <h2 id="activity-outline">活動概要</h2>
          <p>
            中高生が大学生や専門家とともに、まちあるき、聞き取り、地図や資料の分析、被災地の視察を行います。
            その成果をもとに災害シナリオと事前復興計画を考え、地域や復興デザイン会議で発表します。
          </p>
        </section>

        {latest && (
          <section className="home-section" aria-labelledby="latest-activity">
            <h2 id="latest-activity">最新の活動記録</h2>
            <p><Link className="text-link" href={`/activities/${latest.year}`}>{latest.year}年度の活動記録 →</Link></p>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
