import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityArchive, ActivitySectionNav } from "../../components/ActivityArchive";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getActivities, getActivity, getActivityArchiveHtml, parseMarkdown } from "../../lib/activities";

type Props = { params: Promise<{ year: string }> };

export function generateStaticParams() {
  return getActivities().map((activity) => ({ year: activity.year }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const activity = getActivity(year);

  return activity
    ? { title: `${activity.year}年度の活動記録`, description: `防災地理部の${activity.year}年度の活動記録です。` }
    : { title: "活動記録" };
}

export default async function ActivityPage({ params }: Props) {
  const { year } = await params;
  const activity = getActivity(year);
  if (!activity) notFound();

  const archiveHtml = getActivityArchiveHtml(activity, "index");
  const blocks = archiveHtml ? [] : parseMarkdown(activity.body);

  return (
    <>
      <SiteHeader />
      <main className="main-content" id="main-content">
        <article className="prose activity-detail">
          <h1>{activity.year}年度の活動記録</h1>

          <p className="activity-schools"><strong>参加校</strong><br />{activity.schools.join("、")}</p>

          {archiveHtml && <ActivitySectionNav activity={activity} current="index" />}

          {archiveHtml && <ActivityArchive html={archiveHtml} />}

          {blocks.map((block, index) => {
            if (block.type === "heading") {
              return block.level === 2
                ? <h2 key={`${block.text}-${index}`}>{block.text}</h2>
                : <h3 key={`${block.text}-${index}`}>{block.text}</h3>;
            }
            if (block.type === "list") {
              return <ul key={`list-${index}`}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
            }
            return <p key={`paragraph-${index}`}>{block.text}</p>;
          })}
          <p><Link className="text-link" href="/activities">年度ごとの活動記録へ戻る →</Link></p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
