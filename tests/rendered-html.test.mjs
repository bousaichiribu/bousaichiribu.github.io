import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the simple 防災地理部 homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /防災地理部/);
  assert.match(html, /羽藤英二/);
  assert.match(html, /地域のよりよい理解/);
  assert.match(html, /こうした学びを独習で進めることは簡単ではありません/);
  assert.match(html, /災害からの地域復興は/);
  assert.match(html, /前の写真/);
  assert.match(html, /次の写真/);
  assert.match(html, /1 \/ 4/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("shows yearly activity links in the header menu", async () => {
  const html = await (await render()).text();
  assert.match(html, /年度別の活動記録/);
  assert.match(html, /2025年度/);
  assert.match(html, /2020年度/);
});

test("serves pages generated from yearly Markdown files", async () => {
  const routes = [
    "/contact",
    "/activities",
    "/activities/2025",
    "/activities/2025/class",
    "/activities/2025/tour",
    "/activities/2020",
    "/activities/2020/class",
  ];
  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  }
});

test("removes the standalone about and schools pages", async () => {
  for (const route of ["/about", "/schools"]) {
    const response = await render(route);
    assert.equal(response.status, 404, route);
  }
});

test("keeps common philosophy off yearly pages and schools inside them", async () => {
  const activity2025 = await (await render("/activities/2025")).text();
  assert.doesNotMatch(activity2025, /地理学者ブローデル/);
  assert.match(activity2025, /参加校/);
  assert.match(activity2025, /宇和島東高校/);
  assert.doesNotMatch(activity2025, /東北復興視察と地域での学び/);
});

test("preserves complete index, class, and tour source content", async () => {
  const activity2020 = await (await render("/activities/2020")).text();
  assert.match(activity2020, /各校の提案プラン/);
  assert.match(activity2020, /実践への接続/);

  const class2024 = await (await render("/activities/2024/class")).text();
  assert.match(class2024, /0\. はじめに/);
  assert.match(class2024, /7\. プランを実践してみる/);

  const tour2025 = await (await render("/activities/2025/tour")).text();
  assert.match(tour2025, /大川小学校/);
  assert.match(tour2025, /花露辺/);
});

test("shows contact and related links on the contact page", async () => {
  const html = await (await render("/contact")).text();
  assert.match(html, /お問い合わせ/);
  assert.match(html, /matsunaga \[at\] bin\.t\.u-tokyo\.ac\.jp/);
  assert.match(html, /https:\/\/dss\.bin\.t\.u-tokyo\.ac\.jp\/alliance\//);
  assert.match(html, /https:\/\/www\.bin\.t\.u-tokyo\.ac\.jp\//);
});

test("keeps yearly activities in editable Markdown", async () => {
  const [page, activity2025, template, packageJson, gitignore] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../content/activities/2025.md", import.meta.url), "utf8"),
    readFile(new URL("../content/activities/_template.md", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
  ]);

  assert.match(activity2025, /^---\nyear: 2025/m);
  assert.match(template, /year: 20XX/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(gitignore, /^\/node_modules$/m);
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});
