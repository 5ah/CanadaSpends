// Types for Budget News Data
export interface NewsItem {
  id: string;
  source: string;
  date: string;
  url: string;
  headline: string;
  budgetImpact: string;
  amount: string;
  percentage: number;
  isIncrease: boolean;
}

// Budget News Data - Easily Configurable and Maintainable
export const budgetNewsData: NewsItem[] = [
  {
    id: "cbc-healthcare",
    source: "CBC News",
    date: "Dec 15, 2024",
    url: "https://www.cbc.ca/news/politics/federal-budget-2025-preview",
    headline: "Healthcare funding increase",
    budgetImpact: "Health Transfer to Provinces",
    amount: "$2.5B",
    percentage: 5.1,
    isIncrease: true,
  },
  {
    id: "globe-defence",
    source: "Globe and Mail",
    date: "Dec 12, 2024",
    url: "https://www.theglobeandmail.com/politics/article-defence-spending-budget-2025",
    headline: "Defence spending commitment",
    budgetImpact: "National Defence",
    amount: "$1.8B",
    percentage: 5.3,
    isIncrease: true,
  },
  {
    id: "natpost-carbon",
    source: "National Post",
    date: "Dec 10, 2024",
    url: "https://nationalpost.com/news/politics/carbon-tax-reduction-2025",
    headline: "Carbon tax policy adjustment",
    budgetImpact: "Carbon Tax Revenue",
    amount: "$0.5B",
    percentage: -4.8,
    isIncrease: false,
  },
  {
    id: "ctv-infrastructure",
    source: "CTV News",
    date: "Dec 8, 2024",
    url: "https://www.ctvnews.ca/politics/infrastructure-spending-budget-2025",
    headline: "Infrastructure investment plan",
    budgetImpact: "Infrastructure Investments",
    amount: "$1.2B",
    percentage: 13.3,
    isIncrease: true,
  },
];

// Helper Functions for Working with News Data
export const addNewsItem = (item: NewsItem): NewsItem[] => {
  return [...budgetNewsData, item];
};

export const updateNewsItem = (
  id: string,
  updates: Partial<NewsItem>,
): NewsItem[] => {
  return budgetNewsData.map((item) =>
    item.id === id ? { ...item, ...updates } : item,
  );
};

export const removeNewsItem = (id: string): NewsItem[] => {
  return budgetNewsData.filter((item) => item.id !== id);
};

export const getNewsBySource = (source: string): NewsItem[] => {
  return budgetNewsData.filter((item) =>
    item.source.toLowerCase().includes(source.toLowerCase()),
  );
};

export const getNewsByImpact = (budgetImpact: string): NewsItem[] => {
  return budgetNewsData.filter((item) =>
    item.budgetImpact.toLowerCase().includes(budgetImpact.toLowerCase()),
  );
};
