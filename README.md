# 防災地理部ウェブサイト

HTML、CSS、JavaScriptだけで表示する静的サイトです。React、Next.js、データベースは使っていません。

## 主なファイル

- `index.html` — ホーム
- `activities.html` — 年度別活動記録の一覧
- `activity.html` — 各年度の活動記録
- `contact.html` — お問い合わせ
- `style.css` — 全ページ共通の見た目
- `site.js` — 写真切替、年度メニュー、活動記録の読み込み
- `content/archive/` — 2020〜2025年度の過去資料（通常は編集しません）
- `content/activities/` — 2026年度以降の活動記録HTML
- `content/activities.json` — 年度、参加校、表示するHTMLファイルの一覧
- `images/` — 写真

## 年度を追加する

現在はMarkdownを使いません。2020〜2025年度の`content/archive/`は過去資料としてそのまま残します。

1. `content/activities/_template.html`をコピーし、例えば`2026index.html`を作って活動内容を編集します。
2. 写真は`images/activities/2026/`のように年度別フォルダへ入れます。
3. `content/activities.json`の先頭へ2026年度を追加します。

```json
{
  "year": "2026",
  "schools": ["高校A", "高校B"],
  "source": "activities/2026index.html"
}
```

「活動の進め方」や「東北復興視察」を別ページにする場合は、同じ`content/activities/`へHTMLを置き、次の項目を追加します。

```json
"classSource": "activities/class2026.html",
"tourSource": "activities/touhoku_tour2026.html"
```

年度一覧と上部メニューは`content/activities.json`から自動的に作られます。活動記録のURLは`activity.html?year=2026`です。

## ローカルで確認する

```sh
npm run dev
```

ブラウザで`http://localhost:3000/`を開きます。ファイルを直接開くのではなく、ローカルサーバー経由で確認してください。

## 公開用ファイルを作る

```sh
npm run build
```

外部パッケージのインストールは不要です。
