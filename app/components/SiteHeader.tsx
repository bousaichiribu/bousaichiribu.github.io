import Link from "next/link";

const navigation = [
  { href: "/", label: "ホーム" },
  { href: "/schools", label: "参加高校" },
  { href: "/activities", label: "活動記録" },
  { href: "/about", label: "防災地理部について" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="防災地理部 ホーム">
          <span className="brand-mark" aria-hidden="true" />
          防災地理部
        </Link>
        <nav className="site-nav" aria-label="メインナビゲーション">
          <ul>
            {navigation.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}
          </ul>
        </nav>
      </div>
    </header>
  );
}
