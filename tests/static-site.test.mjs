import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("home keeps the full philosophy and carousel", async () => {
  const home = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(home, /class="intro-heading">活動理念/);
  assert.match(home, /地理学者ブローデル/);
  assert.match(home, /羽藤英二 \(東京大学大学院教授\)/);
  assert.match(home, /data-carousel-previous/);
  assert.match(home, /data-carousel-next/);
});

test("plain JavaScript provides the JSON-backed year menu and four photos", async () => {
  const script = await readFile(new URL("../site.js", import.meta.url), "utf8");
  assert.match(script, /年度別の活動記録を開く/);
  assert.match(script, /carouselPhotos/);
  assert.match(script, /coast-harbor\.jpg/);
  assert.match(script, /\/content\/activities\.json/);
  assert.match(script, /loadActivities/);
  assert.doesNotMatch(script, /Markdown|\.md/);
  assert.doesNotMatch(script, /React|Next\.js|node_modules/);
});

test("archive headings have visible hierarchy and hash navigation", async () => {
  const [style, script] = await Promise.all([
    readFile(new URL("../style.css", import.meta.url), "utf8"),
    readFile(new URL("../site.js", import.meta.url), "utf8"),
  ]);
  assert.match(style, /\.archive-source h2 \{/);
  assert.match(style, /border-left: 4px solid #444/);
  assert.match(style, /\.archive-source h3 \{/);
  assert.match(style, /border-bottom: 1px solid #ccc/);
  assert.match(style, /scroll-margin-top/);
  assert.match(script, /scrollIntoView/);
});

test("contact and related links are present", async () => {
  const contact = await readFile(new URL("../contact.html", import.meta.url), "utf8");
  assert.match(contact, /matsunaga \[at\] bin\.t\.u-tokyo\.ac\.jp/);
  assert.match(contact, /https:\/\/dss\.bin\.t\.u-tokyo\.ac\.jp\/alliance\//);
  assert.match(contact, /https:\/\/www\.bin\.t\.u-tokyo\.ac\.jp\//);
  assert.match(contact, /https:\/\/speakerdeck\.com\/bousaichiribu/);
});

test("the activity list points to the complete 2020-2025 archives", async () => {
  const activities = JSON.parse(await readFile(new URL("../content/activities.json", import.meta.url), "utf8"));
  assert.deepEqual(activities.map((activity) => activity.year), ["2025", "2024", "2023", "2022", "2021", "2020"]);
  for (const activity of activities) {
    assert.match(activity.source, new RegExp(`^archive/${activity.year}index\\.html$`));
    await access(new URL(`../content/${activity.source}`, import.meta.url));
    await assert.rejects(access(new URL(`../content/activities/${activity.year}.md`, import.meta.url)));
  }

  const template = await readFile(new URL("../content/activities/_template.html", import.meta.url), "utf8");
  const activity2020 = await readFile(new URL("../content/archive/2020index.html", import.meta.url), "utf8");
  const class2024 = await readFile(new URL("../content/archive/class.html", import.meta.url), "utf8");
  const tour2025 = await readFile(new URL("../content/archive/touhoku_tour2025.html", import.meta.url), "utf8");
  assert.match(template, /<main id="main">/);
  assert.match(activity2020, /各校の提案プラン/);
  assert.match(class2024, /7\. プランを実践してみる/);
  assert.match(tour2025, /大川小学校/);
});

test("archive fragments and their media are self-contained", async () => {
  const archiveDirectory = new URL("../content/archive/", import.meta.url);
  const archiveFiles = (await readdir(archiveDirectory)).filter((name) => name.endsWith(".html"));
  const script = await readFile(new URL("../site.js", import.meta.url), "utf8");

  assert.doesNotMatch(script, /www\.bin\.t\.u-tokyo\.ac\.jp\/bousai_/);
  assert.match(script, /`\/content\/\$\{sourceDirectory\}\$\{relative\}`/);

  for (const filename of archiveFiles) {
    const source = await readFile(new URL(filename, archiveDirectory), "utf8");
    assert.match(source, /^<main id="main">/);
    assert.doesNotMatch(source, /<!DOCTYPE|<html|<head|<body|id="wrapper"|研究室TOP|\/seminar\.html|<input|onclick=/i);

    for (const match of source.matchAll(/(?:src|href)=["']((?:img|files)\/[^"']+)["']/gi)) {
      await access(new URL(match[1], archiveDirectory));
    }
  }
});

test("build output contains static pages and the small hosting entry", async () => {
  for (const path of [
    "dist/client/index.html",
    "dist/client/activity.html",
    "dist/client/content/activities.json",
    "dist/client/content/activities/_template.html",
    "dist/client/content/archive/img/2023_1.png",
    "dist/client/content/archive/files/Layer_analysis.pdf",
    "dist/client/images/home/coast-cliffs.jpg",
    "dist/server/index.js",
    "dist/.openai/hosting.json",
  ]) {
    await access(new URL(`../${path}`, import.meta.url));
  }
  await assert.rejects(access(new URL("../dist/client/content/activities/2025.md", import.meta.url)));
});

test("the hosting entry serves the static index", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", String(Date.now()));
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(new Request("http://localhost/"), {
    ASSETS: {
      fetch: async (request) => new Response(new URL(request.url).pathname),
    },
  });
  assert.equal(await response.text(), "/index.html");
});

test("framework source directories are gone", async () => {
  for (const directory of ["app", "worker", "build", "public"]) {
    await assert.rejects(access(new URL(directory, root)));
  }
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.deepEqual(packageJson.dependencies, undefined);
  assert.deepEqual(packageJson.devDependencies, undefined);
});
