import type { Metadata } from "next";
import Link from "next/link";
import { getVnExpressArticles, type VnExpressArticle } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Bài viết từ VnExpress",
  description:
    "Tin mới từ VnExpress được tổng hợp qua RSS để người dùng SilverLink đọc nhanh trong ứng dụng.",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function ArticlesPage() {
  let articles: VnExpressArticle[] = [];
  let loadError = false;

  try {
    articles = await getVnExpressArticles();
  } catch {
    articles = [];
    loadError = true;
  }

  return (
    <div className="bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-700">
            RSS VnExpress
          </p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight text-stone-950 md:text-5xl">
            Bài viết mới
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">
            Tin tức được lấy từ RSS trang chủ VnExpress và làm mới định kỳ.
            Bấm vào từng bài để đọc đầy đủ tại nguồn gốc.
          </p>
          <a
            href="https://vnexpress.net/rss/tin-moi-nhat.rss"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-800 hover:bg-brand-100"
          >
            Nguồn RSS: VnExpress
          </a>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {loadError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
            Chưa tải được RSS VnExpress. Vui lòng thử lại sau.
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.link}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              {article.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.imageUrl}
                  alt=""
                  className="aspect-[16/9] w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="grid aspect-[16/9] place-items-center bg-brand-50 text-4xl">
                  📰
                </div>
              )}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {formatDate(article.pubDate) || "VnExpress"}
                </p>
                <h2 className="mt-2 line-clamp-3 text-xl font-extrabold leading-7 text-stone-950">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-700"
                  >
                    {article.title}
                  </a>
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                  {article.description}
                </p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex font-bold text-brand-700 hover:underline"
                >
                  Đọc tại VnExpress
                </a>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-2xl bg-brand-700 p-7 text-white md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <h2 className="text-2xl font-extrabold">
              Muốn thảo luận về một bài viết?
            </h2>
            <p className="mt-2 max-w-2xl leading-7 text-brand-50">
              Mang chủ đề đó sang cộng đồng để hỏi kinh nghiệm từ những người
              dùng SilverLink khác.
            </p>
          </div>
          <Link
            href="/cong-dong"
            className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-brand-800 hover:bg-brand-50 md:mt-0"
          >
            Vào cộng đồng
          </Link>
        </section>
      </main>
    </div>
  );
}
