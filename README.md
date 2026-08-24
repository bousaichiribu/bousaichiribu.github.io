# 防災地理部ウェブサイト

HTML、CSS、JavaScriptだけで表示する静的サイトです。React、Next.js、データベースは使っていません。

## 主なファイル

- `index.html` — ホーム
- `activities.html` — 年度別活動記録の一覧
- `activity.html` — 各年度の活動記録
- `how-to.html` — 共通の「活動の進め方」と参考資料
- `style.css` — 全ページ共通の見た目
- `site.js` — 写真切替、年度メニュー、活動記録の読み込み
- `content/archive/` — 2020〜2025年度の本文、画像、PDF（通常は編集しません）
- `content/archive/img/` — 過年度ページで使用するローカル画像
- `content/archive/files/` — 過年度ページで使用するローカルPDF
- `content/activities/` — 2026年度以降の活動記録HTML
- `content/activities.json` — 年度、参加校、表示するHTMLファイルの一覧
- `images/` — 写真

関連リンクとお問い合わせは、`index.html`の下部にあります。

## 年度を追加する

現在はMarkdownを使いません。2020〜2025年度の`content/archive/`は過去資料としてそのまま残します。

過年度のHTMLは現在のサイトへ挿入する本文断片だけを保存しています。旧・羽藤研究室サイトから画像やPDFを読み込む処理はありません。YouTubeやSpeaker Deckなど、資料そのものが外部サービスにある埋め込み・リンクだけは外部参照です。

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

「東北復興視察」を年度内の別ページにする場合は、同じ`content/activities/`へHTMLを置き、次の項目を追加します。

```json
"tourSource": "activities/touhoku_tour2026.html"
```

年度一覧と上部メニューは`content/activities.json`から自動的に作られます。活動記録のURLは`activity.html?year=2026`です。「活動の進め方」は年度共通の独立ページとして`how-to.html`を編集します。

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
