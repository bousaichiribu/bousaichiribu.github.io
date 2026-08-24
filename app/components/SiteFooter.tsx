import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">防災地理部</p>
            <p className="footer-copy">地域を知り、災害への備えと事前復興を考える中学・高校教育活動</p>
          </div>
          <ul className="footer-links">
            <li><Link href="/schools">参加高校</Link></li>
            <li><Link href="/activities">活動記録</Link></li>
            <li><Link href="/about">理念・活動概要</Link></li>
            <li><a href="mailto:matsunaga@bin.t.u-tokyo.ac.jp">お問い合わせ</a></li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p className="footer-note">活動担当：松永隆宏　matsunaga [at] bin.t.u-tokyo.ac.jp</p>
        </div>
      </div>
    </footer>
  );
}
