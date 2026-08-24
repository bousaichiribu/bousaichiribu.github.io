export type Activity = {
  year: string;
  title: string;
  summary: string;
  schools: string[];
  cover: string;
  originalUrl?: string;
  body: string;
};

export type MarkdownBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

const activityFiles = import.meta.glob<string>("../../content/activities/*.md", {
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
