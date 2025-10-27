import Image from "next/image";
import Link from "next/link";
import {
  ArticleWithAuthor,
  formatDate,
  getArticleThumbnail,
} from "@/lib/articles";
import { FiClock } from "react-icons/fi";

interface ArticleCardProps {
  article: ArticleWithAuthor;
  lang: string;
}

export function ArticleCard({ article, lang }: ArticleCardProps) {
  const thumbnailUrl = getArticleThumbnail(article);

  return (
    <Link
      href={`/${lang}/articles/${article.slug}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={article.metadata.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Tags */}
        {article.metadata.tags && article.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.metadata.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {article.metadata.title}
        </h3>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {article.metadata.subtitle}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          {/* Author */}
          <div className="flex items-center gap-2">
            {article.authorData.photo && (
              <Image
                src={article.authorData.photo}
                alt={article.authorData.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="font-medium">{article.authorData.name}</span>
          </div>

          {/* Reading Time */}
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span>{article.readingTime.text}</span>
          </div>
        </div>

        {/* Publish Date */}
        <div className="text-xs text-gray-400 mt-2">
          {formatDate(article.metadata.publishDate, lang)}
        </div>
      </div>
    </Link>
  );
}
