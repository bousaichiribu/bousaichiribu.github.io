const carouselPhotos = [
  { src: "/images/home/coast-cliffs.jpg", alt: "海岸沿いの断崖と海" },
  { src: "/images/home/fishing-harbor.jpg", alt: "山に囲まれた漁港" },
  { src: "/images/home/coast-dawn.jpg", alt: "海を望む林と明け方の空" },
  { src: "/images/home/coast-harbor.jpg", alt: "断崖に囲まれた静かな港" },
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
        <nav class="site-nav" aria-label="メインナビゲーション">
          <ul>
            <li><a href="/">ホーム</a></li>
            <li class="nav-activity-menu">
              <span class="nav-activity-label">
                <a href="/activities.html">活動記録</a>
                <button class="activity-menu-toggle" type="button" aria-label="年度別の活動記録を開く" aria-expanded="false">▾</button>
              </span>
              <ul class="activity-year-menu" data-year-menu aria-label="年度別の活動記録"></ul>
            </li>
            <li><a href="/contact.html">お問い合わせ</a></li>
          </ul>
        </nav>
      </div>
    </header>`;

  const menu = mount.querySelector(".nav-activity-menu");
  const toggle = mount.querySelector(".activity-menu-toggle");
  toggle.addEventListener("click", () => {
    const open = menu.dataset.open !== "true";
    menu.dataset.open = open ? "true" : "false";
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("focusout", (event) => {
    if (!menu.contains(event.relatedTarget)) {
      menu.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
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
      mount.innerHTML = `<a class="text-link" href="/activity.html?year=${latest.year}">${latest.year}年度の活動記録 →</a>`;
    }
  });
}

function resolveActivityUrl(url, activity, sourcePath) {
  if (/^(?:https?:|mailto:|tel:|#)/i.test(url)) return url;
  if (/^javascript:/i.test(url)) return "#";
  if (sourcePath.startsWith("activities/")) {
    if (url.startsWith("/")) return url;
    return `/content/activities/${url.replace(/^\.\//, "")}`;
  }
  if (/^class(?:-\d+)?\.html$/i.test(url)) return `/activity.html?year=${activity.year}&section=class`;
  if (/^touhoku_tour\d{4}\.html$/i.test(url)) return `/activity.html?year=${activity.year}&section=tour`;

  const internalYear = url.match(/^\/bousai_(\d{2})\/?$/);
  if (internalYear) return `/activity.html?year=20${internalYear[1]}`;
  const internalTour = url.match(/^\/bousai_(\d{2})\/touhoku_tour\d{4}\.html$/);
  if (internalTour) return `/activity.html?year=20${internalTour[1]}&section=tour`;

  if (url.startsWith("/")) return `https://www.bin.t.u-tokyo.ac.jp${url}`;
  const relative = url.replace(/^\.\//, "");
  return `https://www.bin.t.u-tokyo.ac.jp/bousai_${activity.year.slice(2)}/${relative}`;
}

function prepareActivityHtml(source, activity, sourcePath) {
  const documentCopy = new DOMParser().parseFromString(source, "text/html");
  const root = documentCopy.querySelector("#main") || documentCopy.body;

  root.querySelectorAll("script").forEach((element) => element.remove());
  root.querySelectorAll("ul").forEach((element) => {
    if (element.textContent.includes("研究室TOP")) element.remove();
  });

  root.querySelectorAll("h2").forEach((heading) => {
    if (/防災地理部の活動理念|防災地理部の設立にあたって/.test(heading.textContent.trim())) {
      let element = heading;
      while (element) {
        const next = element.nextElementSibling;
        element.remove();
        if (!next || next.tagName === "H2") break;
        element = next;
      }
    }
  });

  const inquiry = root.querySelector("#inquiry");
  if (inquiry) {
    let element = inquiry;
    while (element) {
      const next = element.nextElementSibling;
      element.remove();
      element = next;
    }
  }

  root.querySelectorAll("input").forEach((element) => {
    const note = documentCopy.createElement("span");
    note.className = "restricted-note";
    note.textContent = "限定公開資料";
    element.replaceWith(note);
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
    activity.classSource && ["class", "活動の進め方"],
    activity.tourSource && ["tour", "東北復興視察"],
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
  if (!/^\d{4}$/.test(year) || !["index", "class", "tour"].includes(section)) {
    mount.innerHTML = '<h1>活動記録</h1><p class="load-error">年度が指定されていません。</p>';
    return;
  }

  try {
    const activity = (await activitiesPromise).find((item) => item.year === year);
    if (!activity) throw new Error("not found");

    const labels = { index: "活動記録", class: "活動の進め方", tour: "東北復興視察" };
    const sourceNames = { index: "source", class: "classSource", tour: "tourSource" };
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
