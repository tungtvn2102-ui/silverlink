export type VnExpressArticle = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl: string | null;
};

const RSS_URLS = [
  "https://vnexpress.net/rss/tin-moi-nhat.rss",
  "http://vnexpress.net/rss/gl/trang-chu.rss",
];

function decodeEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function getTag(item: string, tag: string): string {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeEntities(match[1].trim()) : "";
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getImageUrl(description: string): string | null {
  const match = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

export async function getVnExpressArticles(): Promise<VnExpressArticle[]> {
  let response: Response | null = null;

  for (const url of RSS_URLS) {
    try {
      response = await fetch(url, {
        next: { revalidate: 900 },
        headers: {
          "User-Agent": "SilverLink/1.0 (+https://silverlink-six.vercel.app)",
        },
      });

      if (response.ok) break;
    } catch {
      response = null;
    }
  }

  if (!response?.ok) {
    throw new Error("Unable to load VnExpress RSS");
  }

  const xml = await response.text();
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return items.slice(0, 24).map((item) => {
    const description = getTag(item, "description");

    return {
      title: stripHtml(getTag(item, "title")),
      link: stripHtml(getTag(item, "link")),
      description: stripHtml(description),
      pubDate: getTag(item, "pubDate"),
      imageUrl: getImageUrl(description),
    };
  });
}
