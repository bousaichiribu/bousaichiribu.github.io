# 防災地理部ウェブサイト

HTML、CSS、JavaScriptだけで表示する静的サイトです。React、Next.js、データベースは使っていません。

## 主なファイル

- `index.html` — ホーム
- `activities.html` — 年度別活動記録の一覧
- `activity.html` — 各年度の活動記録
- `contact.html` — お問い合わせ
- `style.css` — 全ページ共通の見た目
- `site.js` — 写真切替、年度メニュー、活動記録の読み込み
- `content/activities/` — 年度ごとのMarkdown
- `content/archive/` — 以前のサイトから移した完全な活動記録
- `images/` — 写真

## 年度を追加する

1. `content/activities/_template.md`をコピーして、例えば`2026.md`を作ります。
2. `year`、`schools`、本文を編集します。
3. 以前のHTML資料がある場合だけ`content/archive/`へ入れ、Markdownの`source`、`classSource`、`tourSource`にファイル名を書きます。

年度一覧と上部メニューはMarkdownを自動的に探して表示します。活動記録のURLは`activity.html?year=2026`です。

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
