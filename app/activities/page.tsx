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
        <div className="archive-list">
          {activities.map((activity) => (
            <article key={activity.year}>
              <Link href={`/activities/${activity.year}`}>{activity.year}年度の活動記録</Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
