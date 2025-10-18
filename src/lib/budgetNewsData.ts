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
    id: "cbc-cbsa-funding",
    source: "CBC",
    date: "Oct 17, 2025",
    url: "https://www.cbc.ca/player/play/video/9.6942597",
    headline:
      "Public Safety minister announces $617.7 million over 5 years to bolster CBSA",
    budgetImpact: "Defence & Security",
    amount: "$123.54M",
    percentage: 4.83,
    isIncrease: true,
  },
  {
    id: "cbc-national-school-program-funding",
    source: "CBC",
    date: "Oct 10, 2025",
    url: "https://www.cbc.ca/news/politics/carney-school-food-automatic-tax-canada-strong-pass-9.6934474",
    headline:
      "Carney announces $216.6M annually for the National School Program",
    budgetImpact: "Economy + Innovation & Research",
    amount: "$216.6M",
    percentage: 0.79,
    isIncrease: true,
  },
  {
    id: "cbc-build-canada-homes",
    source: "CBC",
    date: "Sep 14, 2025",
    url: "https://www.cbc.ca/news/politics/carney-new-housing-agency-1.7632981",
    headline: "Carney announces $13B for Build Canada Homes",
    budgetImpact: "Economy + Innovation & Research",
    amount: "$13B",
    percentage: 100,
    isIncrease: true,
  },
  {
    id: "cbc-tariff-spending",
    source: "CBC",
    date: "Sep 5, 2025",
    url: "https://www.cbc.ca/news/politics/carney-unveils-new-industrial-strategy-1.7626064",
    headline:
      "Carney unveils billions in funding, Buy Canadian policy to combat Trump's tariffs",
    budgetImpact: "Economy + Innovation & Research",
    amount: "$6.37B",
    percentage: 100,
    isIncrease: true,
  },
  {
    id: "cbc-defence",
    source: "CBC",
    date: "Aug 3, 2025",
    url: "https://www.cbc.ca/news/politics/carney-defence-spending-1.7598150",
    headline: "Carney says Canada will spend $8.7B more on defence in 2025-26",
    budgetImpact: "Defence & Security",
    amount: "$8.7B",
    percentage: 30,
    isIncrease: true,
  },
  {
    id: "cbc-government-spending-cut-7.5-percent",
    source: "CBC",
    date: "July 12, 2025",
    url: "https://www.cbc.ca/news/politics/carney-spending-review-cuts-1.7582889",
    headline: "Government plans to cut operational spending by 7.5% in 2026-27",
    budgetImpact: "Government Operations",
    amount: "$11.8B",
    percentage: 7.5,
    isIncrease: false,
  },
  {
    id: "cbc-income-tax-decrease-revenue",
    source: "CBC",
    date: "June 18, 2025",
    url: "https://www.cbc.ca/news/politics/average-family-savings-liberal-tax-cut-1.7565144",
    headline:
      "Government will bring in $5.4B less per year in revenue due to Bill C4",
    budgetImpact: "Revenue & Tax Administration",
    amount: "$5.4B",
    percentage: 100,
    isIncrease: false,
  },
  {
    id: "cbc-carbon-tax-removal-revenue",
    source: "CBC",
    date: "Apr 1, 2025",
    url: "https://www.cbc.ca/news/business/carbon-tax-ending.",
    headline: "Carbon Tax phase-out reduces revenue by $9.86B",
    budgetImpact: "Revenue & Tax Administration",
    amount: "$9.86B",
    percentage: 100,
    isIncrease: false,
  },
  {
    id: "cbc-carbon-tax-removal-expense",
    source: "CBC",
    date: "Apr 1, 2025",
    url: "https://www.cbc.ca/news/business/carbon-tax-ending.",
    headline: "Carbon Tax Rebate phase-out reduces expenses by $9.86B",
    budgetImpact: "Standards of Living",
    amount: "$9.86B",
    percentage: 100,
    isIncrease: false,
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
