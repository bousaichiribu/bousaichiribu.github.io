import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const children = await listFiles(new URL(`${entry.name}/`, directory));
      files.push(...children.map((name) => `${entry.name}/${name}`));
    } else {
      files.push(entry.name);
    }
  }
  return files;
}

test("home keeps the full philosophy and carousel", async () => {
  const home = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(home, /class="intro-heading">活動理念/);
  assert.match(home, /地理学者ブローデル/);
  assert.match(home, /羽藤英二 \(東京大学大学院教授\)/);
  assert.match(home, /data-carousel-previous/);
  assert.match(home, /data-carousel-next/);
  assert.match(home, /href="\/organization\.html"[\s\S]*images\/subimage\/organization\.webp/);
  assert.match(home, /href="\/how-to\.html"[\s\S]*images\/subimage\/how-to\.webp/);
  assert.match(home, /data-latest-activity-card[\s\S]*images\/subimage\/activities\.webp/);
  assert.doesNotMatch(home, /images\/subimage\/[^"']+\.(?:jpe?g|png)/i);
});

test("plain JavaScript provides the JSON-backed year menu and nine WebP photos", async () => {
  const script = await readFile(new URL("../site.js", import.meta.url), "utf8");
  assert.match(script, /年度別の活動記録を開く/);
  assert.match(script, /carouselPhotos/);
  assert.match(script, /DSC_1633\.webp/);
  assert.match(script, /fishing-harbor\.webp/);
  assert.match(script, /\/content\/activities\.json/);
  assert.match(script, /loadActivities/);
  assert.match(script, /data-latest-activity-card/);
  assert.match(script, /href="\/how-to\.html">活動の進め方/);
  assert.match(script, /href="\/organization\.html">体制/);
  const navigationLabels = [
    'href="/">ホーム',
    'href="/organization.html">体制',
    'href="/how-to.html">活動の進め方',
    'href="/activities.html">活動記録',
    'href="/#contact">お問い合わせ',
  ];
  const navigationPositions = navigationLabels.map((label) => script.indexOf(label));
  assert.ok(navigationPositions.every((position) => position >= 0));
  assert.deepEqual(navigationPositions, [...navigationPositions].sort((a, b) => a - b));
  assert.doesNotMatch(script, /Markdown|\.md/);
  assert.doesNotMatch(script, /React|Next\.js|node_modules/);
});

test("header stays visible and collapses into an accessible menu", async () => {
  const [style, script] = await Promise.all([
    readFile(new URL("../style.css", import.meta.url), "utf8"),
    readFile(new URL("../site.js", import.meta.url), "utf8"),
  ]);
  assert.match(style, /\[data-site-header\] \{[\s\S]*?position: sticky;/);
  assert.match(style, /@media \(max-width: 800px\)/);
  assert.match(style, /\.site-header\[data-menu-open="true"\] \.site-nav \{ display: block; \}/);
  assert.match(script, /class="site-menu-toggle"/);
  assert.match(script, /aria-controls="site-navigation"/);
  assert.match(script, /setSiteMenuOpen/);
  assert.match(script, /event\.key !== "Escape"/);
});

test("archive headings have visible hierarchy and hash navigation", async () => {
  const [activityPage, style, script] = await Promise.all([
    readFile(new URL("../activity.html", import.meta.url), "utf8"),
    readFile(new URL("../style.css", import.meta.url), "utf8"),
    readFile(new URL("../site.js", import.meta.url), "utf8"),
  ]);
  assert.match(activityPage, /class="main-content activity-main"/);
  assert.match(style, /\.activity-main \{ width: min\(1350px,/);
  assert.match(style, /\.prose\.activity-detail \{ max-width: none; \}/);
  assert.match(style, /\.archive-source h2 \{/);
  assert.match(style, /border-left: 4px solid #444/);
  assert.match(style, /\.archive-source h3 \{/);
  assert.match(style, /border-bottom: 1px solid #ccc/);
  assert.match(style, /scroll-margin-top/);
  assert.match(script, /scrollIntoView/);
});

test("contact and related links are sections on the home page", async () => {
  const home = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../site.js", import.meta.url), "utf8");
  const notFound = await readFile(new URL("../404.html", import.meta.url), "utf8");
  assert.match(home, /<section class="home-section" aria-labelledby="related-links-title">/);
  assert.match(home, /<section class="home-section" id="contact"/);
  assert.match(home, /matsunaga \[at\] bin\.t\.u-tokyo\.ac\.jp/);
  assert.match(home, /https:\/\/dss\.bin\.t\.u-tokyo\.ac\.jp\/alliance\//);
  assert.match(home, /https:\/\/www\.bin\.t\.u-tokyo\.ac\.jp\//);
  assert.match(home, /https:\/\/speakerdeck\.com\/bousaichiribu/);
  assert.match(script, /href="\/#contact"/);
  assert.doesNotMatch(script, /contact\.html/);
  assert.match(notFound, /path === "\/contact" \|\| path === "\/contact\.html"/);
  assert.match(notFound, /window\.location\.replace\("\/#contact"\)/);
  await assert.rejects(access(new URL("../contact.html", import.meta.url)));
});

test("organization page lists the team, participating schools, and award rules", async () => {
  const organization = await readFile(new URL("../organization.html", import.meta.url), "utf8");
  const activity2026 = await readFile(new URL("../content/archive/2026/index.html", import.meta.url), "utf8");
  const notFound = await readFile(new URL("../404.html", import.meta.url), "utf8");

  assert.match(organization, /<h1>体制<\/h1>/);
  assert.match(organization, /羽藤英二/);
  assert.match(organization, /山本浩司/);
  assert.match(organization, /多田豊/);
  assert.match(organization, /復興デザイン会議 U30・若手WG学生委員/);
  assert.match(organization, /2026年度/);
  assert.match(organization, /2020年度/);
  assert.match(organization, /U18復興デザインコンペ/);
  assert.match(organization, /表彰の設置目的/);
  assert.match(organization, /2025年度より表彰を設置/);
  assert.match(organization, /復興の実践・研究に関わる技術者、政策立案者、計画者、研究者/);
  assert.match(organization, /防災地理部表彰規定/);
  assert.match(organization, /最優秀地域活動賞/);
  assert.match(organization, /最優秀研究提案賞/);
  assert.match(activity2026, /href="\/organization\.html#award"/);
  assert.doesNotMatch(activity2026, /class="award-box"/);
  assert.match(notFound, /path === "\/organization"/);
});

test("the activity list points to year-based 2020-2026 archives", async () => {
  const activities = JSON.parse(await readFile(new URL("../content/activities.json", import.meta.url), "utf8"));
  assert.deepEqual(activities.map((activity) => activity.year), ["2026", "2025", "2024", "2023", "2022", "2021", "2020"]);
  for (const activity of activities) {
    assert.match(activity.source, new RegExp(`^archive/${activity.year}/index\\.html$`));
    assert.equal(activity.classSource, undefined);
    await access(new URL(`../content/${activity.source}`, import.meta.url));
    await assert.rejects(access(new URL(`../content/activities/${activity.year}.md`, import.meta.url)));
  }

  for (const year of ["2022", "2023", "2024", "2025"]) {
    const activity = activities.find((item) => item.year === year);
    assert.equal(activity.finalSource, `archive/${year}/final.html`);
  }
  assert.equal(activities.find((item) => item.year === "2024").walkSource, "archive/2024/walk.html");

  const template = await readFile(new URL("../content/activities/_template.html", import.meta.url), "utf8");
  const activity2020 = await readFile(new URL("../content/archive/2020/index.html", import.meta.url), "utf8");
  const activity2026 = await readFile(new URL("../content/archive/2026/index.html", import.meta.url), "utf8");
  const howTo = await readFile(new URL("../how-to.html", import.meta.url), "utf8");
  const tour2025 = await readFile(new URL("../content/archive/2025/tour.html", import.meta.url), "utf8");
  assert.match(template, /<main id="main">/);
  assert.match(template, /content\/archive\/2027\/index\.html/);
  assert.match(template, /images\/main\/photo\.webp/);
  assert.match(activity2020, /各校の提案プラン/);
  assert.match(activity2026, /\/organization\.html#award/);
  assert.match(howTo, /7\. プランを実践してみる/);
  assert.match(howTo, /石巻がれき処理/);
  assert.match(howTo, /\/content\/archive\/files\/Layer_analysis\.pdf/);
  assert.match(tour2025, /大川小学校/);

  for (const activity of activities) {
    const annual = await readFile(new URL(`../content/${activity.source}`, import.meta.url), "utf8");
    assert.match(annual, /^<main id="main">\s*<h2(?: id="date")?>日程<\/h2>/);
    assert.doesNotMatch(annual, /目次|活動概要|演習資料/);
  }
  for (const oldClass of ["class.html", "class-2.html", "class-3.html"]) {
    await assert.rejects(access(new URL(`../content/archive/${oldClass}`, import.meta.url)));
  }
});

test("archive fragments and their media are self-contained", async () => {
  const archiveDirectory = new URL("../content/archive/", import.meta.url);
  const allArchiveFiles = await listFiles(archiveDirectory);
  const archiveFiles = allArchiveFiles.filter((name) => name.endsWith(".html"));
  const rasterFiles = allArchiveFiles.filter((name) => /\.(?:png|jpe?g|webp)$/i.test(name));
  const script = await readFile(new URL("../site.js", import.meta.url), "utf8");

  assert.doesNotMatch(script, /www\.bin\.t\.u-tokyo\.ac\.jp\/bousai_/);
  assert.match(script, /`\/content\/\$\{sourceDirectory\}\$\{relative\}`/);
  assert.match(script, /walkSource/);
  assert.match(script, /finalSource/);
  assert.ok(rasterFiles.length > 0);
  assert.ok(rasterFiles.every((name) => name.endsWith(".webp")));
  assert.ok(allArchiveFiles.every((name) => !name.includes("/images/activity/")));

  for (const filename of archiveFiles) {
    const source = await readFile(new URL(filename, archiveDirectory), "utf8");
    assert.match(source, /^<main id="main">/);
    assert.doesNotMatch(source, /<!DOCTYPE|<html|<head|<body|id="wrapper"|研究室TOP|\/seminar\.html|<input|onclick=/i);
    assert.doesNotMatch(source, /images\/activity|\.(?:png|jpe?g)["']/i);

    for (const match of source.matchAll(/(?:src|href)=["']((?:images|files)\/[^"']+)["']/gi)) {
      await access(new URL(match[1], new URL(filename, archiveDirectory)));
    }
  }
});

test("build output contains static pages and the small hosting entry", async () => {
  for (const path of [
    "dist/client/index.html",
    "dist/client/activity.html",
    "dist/client/how-to.html",
    "dist/client/organization.html",
    "dist/client/content/activities.json",
    "dist/client/content/activities/_template.html",
    "dist/client/content/archive/2023/images/main/2023_1.webp",
    "dist/client/content/archive/2024/walk.html",
    "dist/client/content/archive/2024/images/walk/ozu.webp",
    "dist/client/content/archive/2025/final.html",
    "dist/client/content/archive/2026/index.html",
    "dist/client/content/archive/2026/images/main/lec2026_1_1.webp",
    "dist/client/content/archive/files/Layer_analysis.pdf",
    "dist/client/images/subimage/organization.webp",
    "dist/client/images/subimage/how-to.webp",
    "dist/client/images/subimage/activities.webp",
    "dist/client/images/home/DSC_1633.webp",
    "dist/server/index.js",
    "dist/.openai/hosting.json",
  ]) {
    await access(new URL(`../${path}`, import.meta.url));
  }
  await assert.rejects(access(new URL("../dist/client/contact.html", import.meta.url)));
  await assert.rejects(access(new URL("../dist/client/content/activities/2025.md", import.meta.url)));
  await assert.rejects(access(new URL("../dist/client/content/archive/2023/images/activity/2023_1.png", import.meta.url)));
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
