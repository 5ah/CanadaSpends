import { ArticleWithAuthor } from "@/lib/articles";
import { ArticleCard } from "./ArticleCard";

interface RelatedArticlesProps {
  articles: ArticleWithAuthor[];
  lang: string;
  title?: string;
}

export function RelatedArticles({
  articles,
  lang,
  title = "Related Articles",
}: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} lang={lang} />
        ))}
      </div>
    </div>
  );
}
