export function SiteFooter() {
  return (
    <>
      <aside className="contact-panel" aria-labelledby="contact-heading">
        <h2 id="contact-heading">お問い合わせ</h2>
        <p>活動への参加・見学、その他のお問い合わせは、下記までご連絡ください。</p>
        <p className="contact-person">松永隆宏<br />matsunaga [at] bin.t.u-tokyo.ac.jp</p>

        <h3>関連リンク</h3>
        <ul>
          <li><a href="https://dss.bin.t.u-tokyo.ac.jp/alliance/" target="_blank" rel="noreferrer">復興デザイン会議 ↗</a></li>
          <li><a href="https://www.bin.t.u-tokyo.ac.jp/" target="_blank" rel="noreferrer">東京大学 羽藤研究室 ↗</a></li>
        </ul>
      </aside>
      <footer className="site-footer">
        <p>© 防災地理部</p>
      </footer>
    </>
  );
}
