import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const articlesDir = path.join(process.cwd(), "articles");

// ============================================================================
// Type Definitions
// ============================================================================

export interface Author {
  id: string;
  name: string;
  bio: string;
  photo: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface ArticleMetadata {
  title: string;
  subtitle: string;
  publishDate: string;
  author: string;
  thumbnail?: string;
  tags?: string[];
  relatedArticles?: string[];
  featured?: boolean;
}

export interface Article {
  slug: string;
  metadata: ArticleMetadata;
  content: string;
  readingTime: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  lang: string;
}

export interface ArticleWithAuthor extends Article {
  authorData: Author;
}

// ============================================================================
// Author Management
// ============================================================================

let authorsCache: Record<string, Author> | null = null;

export function getAuthors(): Record<string, Author> {
  if (authorsCache) return authorsCache;

  const authorsPath = path.join(articlesDir, "authors.json");

  if (!fs.existsSync(authorsPath)) {
    console.warn(
      "articles/authors.json not found. Please create this file to define authors.",
    );
    return {};
  }

  const authorsData = fs.readFileSync(authorsPath, "utf8");
  authorsCache = JSON.parse(authorsData);
  return authorsCache || {};
}

export function getAuthor(authorId: string): Author | null {
  const authors = getAuthors();
  return authors[authorId] || null;
}

// ============================================================================
// Core Article Functions
// ============================================================================

/**
 * Get All Article Slugs For A Given Language
 */
export function getArticleSlugs(lang: string): string[] {
  const langDir = path.join(articlesDir, lang);

  if (!fs.existsSync(langDir)) {
    return [];
  }

  return fs
    .readdirSync(langDir)
    .filter((item) => {
      const itemPath = path.join(langDir, item);
      return fs.statSync(itemPath).isDirectory();
    })
    .filter((slug) => {
      // Ensure the article has an index.mdx file
      const mdxPath = path.join(langDir, slug, "index.mdx");
      return fs.existsSync(mdxPath);
    });
}

/**
 * Get A Single Article By Slug And Language
 */
export function getArticle(slug: string, lang: string): Article | null {
  const articlePath = path.join(articlesDir, lang, slug);
  const mdxPath = path.join(articlePath, "index.mdx");
  const metadataPath = path.join(articlePath, "metadata.json");

  // Check If Article Exists
  if (!fs.existsSync(mdxPath) || !fs.existsSync(metadataPath)) {
    return null;
  }

  // Read MDX Content
  const fileContent = fs.readFileSync(mdxPath, "utf8");
  const { content } = matter(fileContent);

  // Read Metadata
  const metadataContent = fs.readFileSync(metadataPath, "utf8");
  const metadata: ArticleMetadata = JSON.parse(metadataContent);

  // Calculate Reading Time
  const stats = readingTime(content);

  return {
    slug,
    metadata,
    content,
    readingTime: stats,
    lang,
  };
}

/**
 * Get An Article With Author Data Populated
 */
export function getArticleWithAuthor(
  slug: string,
  lang: string,
): ArticleWithAuthor | null {
  const article = getArticle(slug, lang);
  if (!article) return null;

  const authorData = getAuthor(article.metadata.author);
  if (!authorData) {
    console.warn(
      `Author "${article.metadata.author}" not found for article "${slug}"`,
    );
    // Return A Default Author To Prevent Errors
    return {
      ...article,
      authorData: {
        id: article.metadata.author,
        name: article.metadata.author,
        bio: "",
        photo: "",
      },
    };
  }

  return {
    ...article,
    authorData,
  };
}

/**
 * Get All Articles For A Language, Sorted By Publish Date (Newest First)
 */
export function getAllArticles(lang: string): ArticleWithAuthor[] {
  const slugs = getArticleSlugs(lang);

  const articles = slugs
    .map((slug) => getArticleWithAuthor(slug, lang))
    .filter((article): article is ArticleWithAuthor => article !== null)
    .sort((a, b) => {
      const dateA = new Date(a.metadata.publishDate);
      const dateB = new Date(b.metadata.publishDate);
      return dateB.getTime() - dateA.getTime(); // Newest First
    });

  return articles;
}

/**
 * Get Featured Articles
 */
export function getFeaturedArticles(lang: string): ArticleWithAuthor[] {
  return getAllArticles(lang).filter(
    (article) => article.metadata.featured === true,
  );
}

/**
 * Get Related Articles For A Given Article
 */
export function getRelatedArticles(
  slug: string,
  lang: string,
  limit: number = 3,
): ArticleWithAuthor[] {
  const article = getArticle(slug, lang);
  if (!article) return [];

  // If Article Specifies Related Articles, Use Those
  if (article.metadata.relatedArticles) {
    return article.metadata.relatedArticles
      .map((relatedSlug) => getArticleWithAuthor(relatedSlug, lang))
      .filter((a): a is ArticleWithAuthor => a !== null)
      .slice(0, limit);
  }

  // Otherwise, Find Articles With Similar Tags
  const allArticles = getAllArticles(lang);
  const currentTags = article.metadata.tags || [];

  if (currentTags.length === 0) {
    // If No Tags, Just Return Latest Articles (Excluding Current)
    return allArticles.filter((a) => a.slug !== slug).slice(0, limit);
  }

  // Score Articles By Tag Overlap
  const scored = allArticles
    .filter((a) => a.slug !== slug)
    .map((a) => {
      const tags = a.metadata.tags || [];
      const overlap = tags.filter((tag) => currentTags.includes(tag)).length;
      return { article: a, score: overlap };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.article);
}

/**
 * Get Articles By Tag
 */
export function getArticlesByTag(
  tag: string,
  lang: string,
): ArticleWithAuthor[] {
  return getAllArticles(lang).filter((article) =>
    article.metadata.tags?.includes(tag),
  );
}

/**
 * Get All Unique Tags Across All Articles
 */
export function getAllTags(lang: string): string[] {
  const articles = getAllArticles(lang);
  const tagSet = new Set<string>();

  articles.forEach((article) => {
    article.metadata.tags?.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format A Date String For Display
 */
export function formatDate(dateString: string, locale: string = "en"): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get The Article Thumbnail URL, Handling Relative Paths
 */
export function getArticleThumbnail(
  article: Article,
  fallback: string = "/logo.png",
): string {
  if (!article.metadata.thumbnail) return fallback;

  // If It's A Relative Path Starting With ./, Construct The Full Path
  if (article.metadata.thumbnail.startsWith("./")) {
    return `/articles/${article.lang}/${article.slug}/${article.metadata.thumbnail.slice(2)}`;
  }

  return article.metadata.thumbnail;
}
