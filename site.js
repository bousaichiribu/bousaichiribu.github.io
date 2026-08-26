const carouselPhotos = [
  { src: "/images/home/ainan.webp", alt: "山を背景にした愛南町の道路と市街地" },
  { src: "/images/home/ainan2.webp", alt: "高台から見渡す愛南町の市街地と海" },
  { src: "/images/home/ainan3.webp", alt: "川と田畑に沿って広がる愛南町の住宅地" },
  { src: "/images/home/ozu1.webp", alt: "山に囲まれた大洲市の市街地と川" },
  { src: "/images/home/uwajima1.webp", alt: "宇和島市の商店街を歩く学生たち" },
  { src: "/images/home/yamada.webp", alt: "山に囲まれた山田町の漁港" },
  { src: "/images/home/yawatahama1.webp", alt: "段々畑の高台から見渡す八幡浜市街と港" },
  { src: "/images/home/yawatahama2.webp", alt: "枝いっぱいに実ったみかん" },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadActivities() {
  const response = await fetch("/content/activities.json", { cache: "no-cache" });
  if (!response.ok) throw new Error("activity list not found");

  const activities = await response.json();
  if (!Array.isArray(activities)) throw new Error("invalid activity list");

  return activities
    .filter((activity) => /^\d{4}$/.test(activity.year || "") && Array.isArray(activity.schools))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

const activitiesPromise = loadActivities();

function renderHeader() {
  const mount = document.querySelector("[data-site-header]");
  if (!mount) return;

  mount.innerHTML = `
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="/">防災地理部</a>
        <button class="site-menu-toggle" type="button" aria-controls="site-navigation" aria-expanded="false" aria-label="メニューを開く">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
        <nav class="site-nav" id="site-navigation" aria-label="メインナビゲーション">
          <ul>
            <li><a href="/">ホーム</a></li>
            <li><a href="/organization.html">体制</a></li>
            <li><a href="/how-to.html">活動の進め方</a></li>
            <li class="nav-activity-menu">
              <span class="nav-activity-label">
                <a href="/activities.html">活動記録</a>
                <button class="activity-menu-toggle" type="button" aria-label="年度別の活動記録を開く" aria-expanded="false">▾</button>
              </span>
              <ul class="activity-year-menu" data-year-menu aria-label="年度別の活動記録"></ul>
            </li>
            <li><a href="/#contact">お問い合わせ</a></li>
          </ul>
        </nav>
      </div>
    </header>`;

  const header = mount.querySelector(".site-header");
  const siteNav = mount.querySelector(".site-nav");
  const siteMenuToggle = mount.querySelector(".site-menu-toggle");
  const activityMenu = mount.querySelector(".nav-activity-menu");
  const activityToggle = mount.querySelector(".activity-menu-toggle");

  const setSiteMenuOpen = (open) => {
    header.dataset.menuOpen = open ? "true" : "false";
    siteMenuToggle.setAttribute("aria-expanded", String(open));
    siteMenuToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  };

  const setActivityMenuOpen = (open) => {
    activityMenu.dataset.open = open ? "true" : "false";
    activityToggle.setAttribute("aria-expanded", String(open));
  };

  siteMenuToggle.addEventListener("click", () => {
    setSiteMenuOpen(header.dataset.menuOpen !== "true");
  });
  siteNav.addEventListener("click", (event) => {
    if (event.target.closest?.("a")) setSiteMenuOpen(false);
  });
  header.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setSiteMenuOpen(false);
    setActivityMenuOpen(false);
    siteMenuToggle.focus();
  });

  activityToggle.addEventListener("click", () => {
    setActivityMenuOpen(activityMenu.dataset.open !== "true");
  });
  activityMenu.addEventListener("focusout", (event) => {
    if (!activityMenu.contains(event.relatedTarget)) {
      setActivityMenuOpen(false);
    }
  });

  activitiesPromise.then((activities) => {
    const yearMenu = mount.querySelector("[data-year-menu]");
    yearMenu.innerHTML = activities.map((activity) => (
      `<li><a href="/activity.html?year=${activity.year}">${activity.year}年度</a></li>`
    )).join("");
  });
}

function renderFooter() {
  const mount = document.querySelector("[data-site-footer]");
  if (mount) mount.innerHTML = '<footer class="site-footer"><p>© 防災地理部</p></footer>';
}

function initializeCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const image = carousel.querySelector("[data-carousel-image]");
  const counter = carousel.querySelector("[data-carousel-counter]");
  let current = 0;

  const show = (next) => {
    current = (next + carouselPhotos.length) % carouselPhotos.length;
    image.src = carouselPhotos[current].src;
    image.alt = carouselPhotos[current].alt;
    counter.textContent = `${current + 1} / ${carouselPhotos.length}`;
  };

  carousel.querySelector("[data-carousel-previous]").addEventListener("click", () => show(current - 1));
  carousel.querySelector("[data-carousel-next]").addEventListener("click", () => show(current + 1));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
}

function renderActivityList() {
  const mount = document.querySelector("[data-activity-list]");
  if (!mount) return;

  activitiesPromise.then((activities) => {
    mount.innerHTML = activities.map((activity) => (
      `<article><a href="/activity.html?year=${activity.year}">${activity.year}年度の活動記録</a></article>`
    )).join("");
  }).catch(() => {
    mount.innerHTML = '<p class="load-error">活動記録を読み込めませんでした。</p>';
  });
}

function renderLatestActivity() {
  const mount = document.querySelector("[data-latest-activity]");
  if (!mount) return;
  activitiesPromise.then(([latest]) => {
    if (latest) {
      const link = mount.closest("[data-latest-activity-card]");
      if (link) link.href = `/activity.html?year=${latest.year}`;
      mount.textContent = `${latest.year}年度の活動記録を見る →`;
    }
  });
}

function resolveActivityUrl(url, activity, sourcePath) {
  if (/^(?:https?:|mailto:|tel:|#)/i.test(url)) return url;
  if (/^javascript:/i.test(url)) return "#";
  if (/^class(?:-\d+)?\.html$/i.test(url)) return "/how-to.html";
  if (/^(?:machiaruki\d{4}|walk)\.html$/i.test(url)) return `/activity.html?year=${activity.year}&section=walk`;
  if (/^(?:touhoku_tour\d{4}|tour)\.html$/i.test(url)) return `/activity.html?year=${activity.year}&section=tour`;
  if (/^(?:\d{4}final|final)\.html$/i.test(url)) return `/activity.html?year=${activity.year}&section=final`;
  if (url.startsWith("/")) return url;

  const sourceDirectory = sourcePath.slice(0, sourcePath.lastIndexOf("/") + 1);
  const relative = url.replace(/^\.\//, "");
  return `/content/${sourceDirectory}${relative}`;
}

function prepareActivityHtml(source, activity, sourcePath) {
  const documentCopy = new DOMParser().parseFromString(source, "text/html");
  const root = documentCopy.querySelector("#main") || documentCopy.body;

  root.querySelectorAll("script").forEach((element) => element.remove());

  root.querySelectorAll('div[style*="width:500px"]').forEach((element) => {
    element.removeAttribute("style");
    element.classList.add("archive-media");
  });

  root.querySelectorAll("img").forEach((element) => {
    element.setAttribute("loading", "lazy");
    if (!element.hasAttribute("alt")) element.setAttribute("alt", "活動記録の画像");
  });

  root.querySelectorAll("iframe").forEach((element) => {
    element.setAttribute("loading", "lazy");
  });

  root.querySelectorAll("*").forEach((element) => {
    for (const attribute of [...element.attributes]) {
      if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
    }
    for (const attributeName of ["href", "src"]) {
      if (element.hasAttribute(attributeName)) {
        element.setAttribute(attributeName, resolveActivityUrl(element.getAttribute(attributeName), activity, sourcePath));
      }
    }
  });

  return root.innerHTML;
}

function sectionLinks(activity, current) {
  const sections = [
    activity.source && ["index", "年度の活動"],
    activity.walkSource && ["walk", "まちあるき"],
    activity.tourSource && ["tour", "東北復興視察"],
    activity.finalSource && ["final", "最終発表"],
  ].filter(Boolean);

  return `<nav class="activity-tabs" aria-label="${activity.year}年度の活動資料">${sections.map(([section, label]) => {
    const query = section === "index" ? "" : `&section=${section}`;
    const currentAttribute = current === section ? ' aria-current="page"' : "";
    return `<a${currentAttribute} href="/activity.html?year=${activity.year}${query}">${label}</a>`;
  }).join("")}</nav>`;
}

async function renderActivityDetail() {
  const mount = document.querySelector("[data-activity-detail]");
  if (!mount) return;

  const parameters = new URLSearchParams(window.location.search);
  const year = parameters.get("year") || "";
  const section = parameters.get("section") || "index";
  if (section === "class") {
    window.location.replace("/how-to.html");
    return;
  }
  if (!/^\d{4}$/.test(year) || !["index", "walk", "tour", "final"].includes(section)) {
    mount.innerHTML = '<h1>活動記録</h1><p class="load-error">年度が指定されていません。</p>';
    return;
  }

  try {
    const activity = (await activitiesPromise).find((item) => item.year === year);
    if (!activity) throw new Error("not found");

    const labels = { index: "活動記録", walk: "まちあるき", tour: "東北復興視察", final: "最終発表" };
    const sourceNames = { index: "source", walk: "walkSource", tour: "tourSource", final: "finalSource" };
    const archiveFilename = activity[sourceNames[section]];
    document.title = `${year}年度 ${labels[section]}｜防災地理部`;

    const heading = section === "index"
      ? `<h1>${year}年度の活動記録</h1>`
      : `<h1>${year}年度　${labels[section]}</h1>`;
    const schools = section === "index"
      ? `<p class="activity-schools"><strong>参加校</strong><br>${activity.schools.map(escapeHtml).join("、")}</p>`
      : "";

    if (!archiveFilename) throw new Error("activity source not found");
    const response = await fetch(`/content/${archiveFilename}`);
    if (!response.ok) throw new Error("activity source not found");
    const content = `<div class="archive-source">${prepareActivityHtml(await response.text(), activity, archiveFilename)}</div>`;

    const backLink = section === "index"
      ? '<a class="text-link" href="/activities.html">年度ごとの活動記録へ戻る →</a>'
      : `<a class="text-link" href="/activity.html?year=${year}">${year}年度の活動へ戻る →</a>`;

    mount.innerHTML = `${heading}${schools}${sectionLinks(activity, section)}${content}<p>${backLink}</p>`;

    if (window.location.hash) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) requestAnimationFrame(() => target.scrollIntoView());
    }
  } catch {
    mount.innerHTML = `<h1>${escapeHtml(year)}年度の活動記録</h1><p class="load-error">活動記録を読み込めませんでした。</p>`;
  }
}

renderHeader();
renderFooter();
initializeCarousel();
renderActivityList();
renderLatestActivity();
renderActivityDetail();
