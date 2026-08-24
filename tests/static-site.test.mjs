import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("home keeps the full philosophy and carousel", async () => {
  const home = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(home, /防災地理部の活動理念/);
  assert.match(home, /地理学者ブローデル/);
  assert.match(home, /羽藤英二/);
  assert.match(home, /data-carousel-previous/);
  assert.match(home, /data-carousel-next/);
});

test("plain JavaScript provides the year menu and four photos", async () => {
  const script = await readFile(new URL("../site.js", import.meta.url), "utf8");
  assert.match(script, /年度別の活動記録を開く/);
  assert.match(script, /carouselPhotos/);
  assert.match(script, /coast-harbor\.jpg/);
  assert.match(script, /discoverActivities/);
  assert.doesNotMatch(script, /React|Next\.js|node_modules/);
});

test("contact and related links are present", async () => {
  const contact = await readFile(new URL("../contact.html", import.meta.url), "utf8");
  assert.match(contact, /matsunaga \[at\] bin\.t\.u-tokyo\.ac\.jp/);
  assert.match(contact, /https:\/\/dss\.bin\.t\.u-tokyo\.ac\.jp\/alliance\//);
  assert.match(contact, /https:\/\/www\.bin\.t\.u-tokyo\.ac\.jp\//);
});

test("all yearly Markdown and complete archives remain", async () => {
  for (const year of [2020, 2021, 2022, 2023, 2024, 2025]) {
    const markdown = await readFile(new URL(`../content/activities/${year}.md`, import.meta.url), "utf8");
    assert.match(markdown, new RegExp(`year: ${year}`));
  }
  const activity2020 = await readFile(new URL("../content/archive/2020index.html", import.meta.url), "utf8");
  const class2024 = await readFile(new URL("../content/archive/class.html", import.meta.url), "utf8");
  const tour2025 = await readFile(new URL("../content/archive/touhoku_tour2025.html", import.meta.url), "utf8");
  assert.match(activity2020, /各校の提案プラン/);
  assert.match(class2024, /7\. プランを実践してみる/);
  assert.match(tour2025, /大川小学校/);
});

test("build output contains static pages and the small hosting entry", async () => {
  for (const path of [
    "dist/client/index.html",
    "dist/client/activity.html",
    "dist/client/content/activities/2025.md",
    "dist/client/images/home/coast-cliffs.jpg",
    "dist/server/index.js",
    "dist/.openai/hosting.json",
  ]) {
    await access(new URL(`../${path}`, import.meta.url));
  }
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
