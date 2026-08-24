import Link from "next/link";
import type { Activity, ArchiveSection } from "../lib/activities";

const sectionLabels: Record<ArchiveSection, string> = {
  index: "年度の活動",
  class: "活動の進め方",
  tour: "東北復興視察",
};

export function ActivitySectionNav({
  activity,
  current,
}: {
  activity: Activity;
  current: ArchiveSection;
}) {
  const sections: ArchiveSection[] = [
    ...(activity.source ? ["index" as const] : []),
    ...(activity.classSource ? ["class" as const] : []),
    ...(activity.tourSource ? ["tour" as const] : []),
  ];

  return (
    <nav className="activity-tabs" aria-label={`${activity.year}年度の活動資料`}>
      {sections.map((section) => {
        const href = section === "index"
          ? `/activities/${activity.year}`
          : `/activities/${activity.year}/${section}`;
        return (
          <Link
            aria-current={current === section ? "page" : undefined}
            href={href}
            key={section}
          >
            {sectionLabels[section]}
          </Link>
        );
      })}
    </nav>
  );
}

export function ActivityArchive({ html }: { html: string }) {
  return <div className="archive-source" dangerouslySetInnerHTML={{ __html: html }} />;
}
