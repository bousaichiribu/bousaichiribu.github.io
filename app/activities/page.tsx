import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getActivities } from "../lib/activities";

export const metadata: Metadata = {
  title: "活動記録",
  description: "防災地理部の年度ごとの活動記録です。",
};

export default function ActivitiesPage() {
  const activities = getActivities();

  return (
    <>
      <SiteHeader />
      <main className="main-content" id="main-content">
        <h1>年度ごとの活動記録</h1>
        <p className="page-lead">
          地域調査、被災地視察、事前復興の提案など、各年度の活動をまとめています。
        </p>

        <div className="archive-list">
          {activities.map((activity) => (
            <article key={activity.year}>
              <p className="archive-year">{activity.year}</p>
              <div>
                <h2><Link href={`/activities/${activity.year}`}>{activity.title}</Link></h2>
                <p>{activity.summary}</p>
                <p className="archive-schools">参加校：{activity.schools.join("、")}</p>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
