import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityArchive, ActivitySectionNav } from "../../../components/ActivityArchive";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import {
  getActivities,
  getActivity,
  getActivityArchiveHtml,
  getArchiveSections,
  type ArchiveSection,
} from "../../../lib/activities";

type Props = { params: Promise<{ year: string; section: string }> };

const labels: Record<Exclude<ArchiveSection, "index">, string> = {
  class: "活動の進め方",
  tour: "東北復興視察",
};

function isSubsection(section: string): section is Exclude<ArchiveSection, "index"> {
  return section === "class" || section === "tour";
}

export function generateStaticParams() {
  return getActivities().flatMap((activity) =>
    getArchiveSections(activity)
      .filter((section) => section !== "index")
      .map((section) => ({ year: activity.year, section })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, section } = await params;
  const activity = getActivity(year);
  return activity && isSubsection(section)
    ? { title: `${labels[section]}｜${activity.year}年度`, description: activity.summary }
    : { title: "活動記録" };
}

export default async function ActivitySubsectionPage({ params }: Props) {
  const { year, section } = await params;
  const activity = getActivity(year);
  if (!activity || !isSubsection(section)) notFound();

  const archiveHtml = getActivityArchiveHtml(activity, section);
  if (!archiveHtml) notFound();

  return (
    <>
      <SiteHeader />
      <main className="main-content" id="main-content">
        <article className="prose activity-detail">
          <p className="meta">{activity.year}年度</p>
          <h1>{labels[section]}</h1>
          <ActivitySectionNav activity={activity} current={section} />
          <ActivityArchive html={archiveHtml} />
          <p><Link className="text-link" href={`/activities/${activity.year}`}>{activity.year}年度の活動へ戻る →</Link></p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
