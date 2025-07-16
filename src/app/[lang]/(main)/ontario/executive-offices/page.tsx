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
    title: "Ontario Executive Offices Spending | CanadaSpends",
    description: "Explore Ontario Executive Offices spending including the Premier's Office, Cabinet Office, and executive support services.",
  };
}

export default async function ExecutiveOfficesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  initLingui(lang);

  const { jurisdiction } = getJurisdictionData("ontario");
  const department = getDepartmentData("ontario", "executive-offices");
  const allDepartments = getExpandedDepartments("ontario");

  return (
    <Page>
      <PageContent>
        <Section>
          <H1>
            <Trans>Ontario Executive Offices Spending</Trans>
          </H1>
          <Intro>
            <Trans>
              The Executive Offices provide strategic leadership and coordination for Ontario's government through the Premier's Office, Cabinet Office, and supporting services. In fiscal year {jurisdiction.financialYear}, the executive offices spent {department.totalSpendingFormatted}, representing {department.percentageFormatted} of Ontario's total budget. Key areas include executive leadership, policy coordination, and government communications.
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
              value={<Trans>Executive Leadership</Trans>}
              subtitle={<Trans>Government coordination and strategy</Trans>}
            />
          </div>
        </Section>

        <Section>
          <H2>
            <Trans>Spending Breakdown</Trans>
          </H2>
          <P>
            <Trans>
              This chart shows how Executive Offices allocates its {department.totalSpendingFormatted} budget across different programs and services, including Premier's Office operations, Cabinet Office support, policy coordination activities, and government communications services.
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
              See how Executive Offices spending compares to other Ontario government ministries and explore their detailed breakdowns.
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