export type Activity = {
  year: string;
  title: string;
  summary: string;
  schools: string[];
  cover: string;
  originalUrl?: string;
  source?: string;
  classSource?: string;
  tourSource?: string;
  body: string;
};

export type ArchiveSection = "index" | "class" | "tour";

export type MarkdownBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

const activityFiles = import.meta.glob<string>("../../content/activities/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const archiveFiles = import.meta.glob<string>("../../content/archive/*.html", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parseActivity(source: string): Activity | null {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const metadata = Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => {
        const separator = line.indexOf(":");
        return separator === -1
          ? [line.trim(), ""]
          : [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );

  if (!/^\d{4}$/.test(metadata.year ?? "")) return null;

  return {
    year: metadata.year,
    title: metadata.title || `防災地理部 ${metadata.year}年度`,
    summary: metadata.summary || "",
    schools: (metadata.schools || "")
      .split("｜")
      .map((school) => school.trim())
      .filter(Boolean),
    cover: metadata.cover || "/images/home/coast-cliffs.jpg",
    originalUrl: metadata.originalUrl || undefined,
    source: metadata.source || undefined,
    classSource: metadata.classSource || undefined,
    tourSource: metadata.tourSource || undefined,
    body: match[2].trim(),
  };
}

export function getActivities(): Activity[] {
  return Object.values(activityFiles)
    .map(parseActivity)
    .filter((activity): activity is Activity => Boolean(activity))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

export function getActivity(year: string): Activity | undefined {
  return getActivities().find((activity) => activity.year === year);
}

function findArchiveFile(filename: string): string | undefined {
  return Object.entries(archiveFiles).find(([path]) => path.endsWith(`/${filename}`))?.[1];
}

function resolveArchiveUrl(url: string, activity: Activity): string {
  if (/^(?:https?:|mailto:|tel:|#)/i.test(url)) return url;
  if (/^javascript:/i.test(url)) return "#";

  if (/^class(?:-\d+)?\.html$/i.test(url)) {
    return `/activities/${activity.year}/class`;
  }
  if (/^touhoku_tour\d{4}\.html$/i.test(url)) {
    return `/activities/${activity.year}/tour`;
  }

  const internalYear = url.match(/^\/bousai_(\d{2})\/?$/);
  if (internalYear) return `/activities/20${internalYear[1]}`;

  const internalTour = url.match(/^\/bousai_(\d{2})\/touhoku_tour\d{4}\.html$/);
  if (internalTour) return `/activities/20${internalTour[1]}/tour`;

  if (url.startsWith("/")) return `https://www.bin.t.u-tokyo.ac.jp${url}`;

  const relative = url.replace(/^\.\//, "");
  return `https://www.bin.t.u-tokyo.ac.jp/bousai_${activity.year.slice(2)}/${relative}`;
}

function prepareArchiveHtml(source: string, activity: Activity): string {
  const marker = '<div id="main">';
  const start = source.indexOf(marker);
  const end = source.lastIndexOf("</body>");
  let html = start === -1 ? source : source.slice(start + marker.length, end === -1 ? undefined : end);

  html = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<ul(?:\s+class=["']head["'])?>[\s\S]*?研究室TOP[\s\S]*?<\/ul>/i, "")
    .replace(/<h2\b[^>]*id=["']inquiry["'][^>]*>[\s\S]*$/i, "")
    .replace(/<input\b[^>]*>/gi, '<span class="restricted-note">限定公開資料</span>')
    .replace(/\son\w+=["'][^"']*["']/gi, "")
    .replace(/<\/?big\b[^>]*>/gi, "")
    .replace(/\b(href|src)=["']([^"']+)["']/gi, (_match, attribute: string, url: string) => {
      return `${attribute}="${resolveArchiveUrl(url, activity)}"`;
    });

  return html.trim();
}

export function getActivityArchiveHtml(
  activity: Activity,
  section: ArchiveSection,
): string | undefined {
  const filename = section === "index"
    ? activity.source
    : section === "class"
      ? activity.classSource
      : activity.tourSource;

  if (!filename) return undefined;
  const source = findArchiveFile(filename);
  return source ? prepareArchiveHtml(source, activity) : undefined;
}

export function getArchiveSections(activity: Activity): ArchiveSection[] {
  return ([
    activity.source && "index",
    activity.classSource && "class",
    activity.tourSource && "tour",
  ].filter(Boolean) as ArchiveSection[]);
}

export function parseMarkdown(body: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = body.split("\n");
  let paragraph: string[] = [];
  let items: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (items.length) {
      blocks.push({ type: "list", items });
      items = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: 3, text: line.slice(4) });
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: 2, text: line.slice(3) });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      items.push(line.slice(2));
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}
