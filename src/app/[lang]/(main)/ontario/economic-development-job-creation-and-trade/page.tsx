import {
  ExternalLink,
  H1,
  H2,
  Intro,
  P,
  Page,
  PageContent,
  Section,
} from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { DepartmentMiniSankey } from "@/components/Sankey/DepartmentMiniSankey";
import { JurisdictionDepartmentList } from "@/components/DepartmentList";
import { getDepartmentData, getExpandedDepartments, getJurisdictionData } from "@/lib/jurisdictions";
import { initLingui } from "@/initLingui";
import { Trans, useLingui } from "@lingui/react/macro";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  initLingui(lang);

  return {
    title: "Ontario Economic Development, Job Creation and Trade Spending | CanadaSpends",
    description: "Explore Ontario Economic Development, Job Creation and Trade spending including business support, innovation programs, and trade initiatives.",
  };
}

export default async function EconomicDevelopmentJobCreationAndTradePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  initLingui(lang);

  const { jurisdiction } = getJurisdictionData("ontario");
  const department = getDepartmentData("ontario", "economic-development-job-creation-and-trade");
  const allDepartments = getExpandedDepartments("ontario");

  return (
    <Page>
      <PageContent>
        <Section>
          <H1>
            <Trans>Ontario Economic Development, Job Creation and Trade Spending</Trans>
          </H1>
          <Intro>
            <Trans>
              The Ministry of Economic Development, Job Creation and Trade drives economic growth through business support, innovation funding, and trade promotion. In fiscal year {jurisdiction.financialYear}, the ministry spent {department.totalSpendingFormatted}, representing {department.percentageFormatted} of Ontario's total budget. Key areas include business incentives, innovation programs, and international trade initiatives.
            </Trans>
          </Intro>
        </Section>

        <Section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title={<Trans>Total Spending</Trans>}
              value={department.totalSpendingFormatted}
              subtitle={<Trans>Fiscal Year {jurisdiction.financialYear}</Trans>}
            />
            <StatCard
              title={<Trans>Percentage of Budget</Trans>}
              value={department.percentageFormatted}
              subtitle={<Trans>Of total Ontario government spending</Trans>}
            />
            <StatCard
              title={<Trans>Key Focus</Trans>}
              value={<Trans>Economic Growth</Trans>}
              subtitle={<Trans>Business support and job creation</Trans>}
            />
          </div>
        </Section>

        <Section>
          <H2>
            <Trans>Spending Breakdown</Trans>
          </H2>
          <P>
            <Trans>
              This chart shows how Economic Development, Job Creation and Trade allocates its {department.totalSpendingFormatted} budget across different programs and services, including business development incentives, innovation funding, trade promotion, and regional economic development programs.
            </Trans>
          </P>
          <DepartmentMiniSankey department={department} />
        </Section>

        <Section>
          <H2>
            <Trans>Compare with Other Ministries</Trans>
          </H2>
          <P>
            <Trans>
              See how Economic Development, Job Creation and Trade spending compares to other Ontario government ministries and explore their detailed breakdowns.
            </Trans>
          </P>
          <JurisdictionDepartmentList
            jurisdiction={jurisdiction}
            lang={lang}
            departments={allDepartments}
          />
        </Section>

        <Section>
          <H2>
            <Trans>About This Data</Trans>
          </H2>
          <P>
            <Trans>
              All spending data is sourced from the{" "}
              <ExternalLink href={jurisdiction.source}>
                Public Accounts of Ontario for Fiscal Year {jurisdiction.financialYear}
              </ExternalLink>
              . The data includes operating and capital expenditures but may not reflect all financial activities. For the most current and comprehensive financial information, please refer to the official government sources.
            </Trans>
          </P>
        </Section>
      </PageContent>
    </Page>
  );
} 