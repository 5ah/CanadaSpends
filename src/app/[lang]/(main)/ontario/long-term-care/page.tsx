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
    title: "Ontario Long-Term Care Spending | CanadaSpends",
    description: "Explore Ontario Long-Term Care spending including nursing home funding, home care services, and senior care programs.",
  };
}

export default async function LongTermCarePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  initLingui(lang);

  const { jurisdiction } = getJurisdictionData("ontario");
  const department = getDepartmentData("ontario", "long-term-care");
  const allDepartments = getExpandedDepartments("ontario");

  return (
    <Page>
      <PageContent>
        <Section>
          <H1>
            <Trans>Ontario Long-Term Care Spending</Trans>
          </H1>
          <Intro>
            <Trans>
              The Ministry of Long-Term Care ensures quality care for Ontario's seniors through nursing home oversight, home care services, and support programs. In fiscal year {jurisdiction.financialYear}, the ministry spent {department.totalSpendingFormatted}, representing {department.percentageFormatted} of Ontario's total budget. Key areas include long-term care facility funding, home and community care, and quality assurance programs.
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
              value={<Trans>Senior Care</Trans>}
              subtitle={<Trans>Long-term care and home services</Trans>}
            />
          </div>
        </Section>

        <Section>
          <H2>
            <Trans>Spending Breakdown</Trans>
          </H2>
          <P>
            <Trans>
              This chart shows how Long-Term Care allocates its {department.totalSpendingFormatted} budget across different programs and services, including long-term care facility operations, home and community care services, capital development, and quality assurance programs.
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
              See how Long-Term Care spending compares to other Ontario government ministries and explore their detailed breakdowns.
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