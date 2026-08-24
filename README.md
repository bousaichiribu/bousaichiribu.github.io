# 防災地理部ウェブサイト

防災地理部の公式サイトです。ページは Next.js / vinext で構成しています。

## 年度の活動記録を追加する

活動記録は `content/activities` 内のMarkdownファイルから自動生成されます。

1. `_template.md` をコピーし、`2026.md` のように年度をファイル名にします。
2. 冒頭の `year`、`title`、`summary`、`schools`、`cover` を書き換えます。
3. `---` より下に本文を書きます。見出しは `##` または `###`、箇条書きは `-` が使えます。

追加した年度は、トップページの「最新の活動」、活動記録一覧、年度別の詳細ページへ自動で反映されます。

画像は `public/images` に保存し、Markdownの `cover` には `/images/ファイル名.jpg` の形式で指定します。

## ローカルで確認する

```bash
npm install
npm run dev
```

## ビルドとテスト

```bash
npm test
```
