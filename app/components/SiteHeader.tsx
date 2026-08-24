import Link from "next/link";
import { getActivities } from "../lib/activities";
import { ActivityMenu } from "./ActivityMenu";

const navigation = [
  { href: "/", label: "ホーム" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteHeader() {
  const activityYears = getActivities().map((activity) => activity.year);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" href="/">防災地理部</Link>
        <nav className="site-nav" aria-label="メインナビゲーション">
          <ul>
            <li><Link href={navigation[0].href}>{navigation[0].label}</Link></li>
            <ActivityMenu years={activityYears} />
            <li><Link href={navigation[1].href}>{navigation[1].label}</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
