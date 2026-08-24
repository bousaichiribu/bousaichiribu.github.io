import Link from "next/link";

const navigation = [
  { href: "/", label: "ホーム" },
  { href: "/activities", label: "活動記録" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" href="/">防災地理部</Link>
        <nav className="site-nav" aria-label="メインナビゲーション">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
