import { H1, Intro, Page, PageContent, Section } from "@/components/Layout";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getAllArticles, getFeaturedArticles } from "@/lib/articles";
import { initLingui, PageLangParam } from "@/initLingui";
import { Trans, useLingui } from "@lingui/react/macro";
import { PropsWithChildren } from "react";

export async function generateMetadata(
  props: PropsWithChildren<PageLangParam>,
) {
  const lang = (await props.params).lang;
  initLingui(lang);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useLingui();
  return {
    title: t`Articles | Canada Spends`,
    description: t`Explore in-depth articles about Canadian government spending, budget analysis, and public finance. Stay informed about how your tax dollars are used through Canada Spends.`,
  };
}

export default async function ArticlesPage(
  props: PropsWithChildren<PageLangParam>,
) {
  const lang = (await props.params).lang;
  initLingui(lang);

  // Get all articles and featured articles
  const allArticles = getAllArticles(lang);
  const featuredArticles = getFeaturedArticles(lang);

  return (
    <Page>
      <PageContent>
        <Section>
          <H1>
            <Trans>Articles</Trans>
          </H1>
          <Intro>
            <Trans>
              In-depth analysis and insights about Canadian government spending,
              budget policies, and public finance. Our team at Canada Spends
              breaks down complex financial data to help you understand how
              government spending impacts your life.
            </Trans>
          </Intro>
        </Section>

        {/* Featured Articles Section */}
        {featuredArticles.length > 0 && (
          <Section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <Trans>Featured Articles</Trans>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} lang={lang} />
              ))}
            </div>
          </Section>
        )}

        {/* All Articles Section */}
        <Section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            <Trans>All Articles</Trans>
          </h2>

          {allArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                <Trans>
                  No articles available yet on Canada Spends. Check back soon!
                </Trans>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} lang={lang} />
              ))}
            </div>
          )}
        </Section>
      </PageContent>
    </Page>
  );
}
