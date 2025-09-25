import { JurisdictionDepartmentList } from "@/components/DepartmentList";
import {
  ExternalLink,
  H1,
  H2,
  InternalLink,
  Intro,
  P,
  Page,
  PageContent,
  Section,
} from "@/components/Layout";
import { JurisdictionSankey } from "@/components/Sankey/JurisdictionSankey";
import { Tooltip } from "@/components/Tooltip";
import { initLingui } from "@/initLingui";
import {
  getExpandedDepartments,
  getJurisdictionData,
  getJurisdictionSlugs,
} from "@/lib/jurisdictions";
import { Trans } from "@lingui/react/macro";

const HelpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-2 text-gray-500 cursor-pointer"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

export const dynamicParams = false;

export function generateStaticParams() {
  const jurisdictions = getJurisdictionSlugs();
  const languages = ["en", "fr"]; // or import { locales } from '@/locales';

  const all = languages.flatMap((lang) =>
    jurisdictions.map((jurisdiction) => ({ lang, jurisdiction })),
  );

  return all;
}

export default async function ProvinceIndex({
  params,
}: {
  params: Promise<{ jurisdiction: string; lang: string }>;
}) {
  const { jurisdiction: slug, lang } = await params;
  initLingui(lang);

  const { jurisdiction, sankey } = getJurisdictionData(slug);

  const departments = getExpandedDepartments(jurisdiction.slug);

  // Financial position figures for Ontario FY 2023-24 (Public Accounts 2023-24)
  const netDebt = 408.0; // in billions of dollars
  const netDebtFormatted = `$${netDebt.toFixed(1)}B`;

  const totalDebt = 552.1; // in billions of dollars
  const totalDebtFormatted = `$${totalDebt.toFixed(1)}B`;

  const interestOnDebt = 11.376; // in billions of dollars (Interest on Ontario Securities)
  const interestOnDebtFormatted = `$${interestOnDebt.toFixed(1)}B`;

  return (
    <Page>
      <PageContent>
        <Section>
          <H1>
            <Trans>{jurisdiction.name} Government Spending</Trans>
          </H1>
          <Intro>
            <Trans>
              Get data-driven insights into how {jurisdiction.name}'s provincial
              revenue and spending affect {jurisdiction.name} residents and
              programs.
            </Trans>
          </Intro>
        </Section>
        <Section>
          <H2>
            <Trans>
              Financial Year {jurisdiction.financialYear} {jurisdiction.name}{" "}
              Government Revenue and Spending
            </Trans>
          </H2>
          <P>
            <Trans>
              Explore {jurisdiction.name}'s revenue and spending categories or
              filter by ministry for deeper insights.
            </Trans>
          </P>
        </Section>
        <div className="sankey-chart-container relative overflow-hidden sm:(mr-0 ml-0) md:(min-h-[776px] min-w-[1280px] w-screen -ml-[50vw] -mr-[50vw] left-1/2 right-1/2)">
          <JurisdictionSankey data={sankey} />
          <div className="absolute bottom-3 left-6">
            <ExternalLink
              className="text-xs text-gray-400"
              href={jurisdiction.source}
            >
              <Trans>Source</Trans>
            </ExternalLink>
          </div>
          <div className="absolute top-0 left-0 w-[100vw] h-full  backdrop-blur-sm z-10 text-white md:hidden flex items-center justify-center">
            <ExternalLink
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              href={`/${jurisdiction.slug}/spending-full-screen`}
            >
              <Trans>View this chart in full screen</Trans>
            </ExternalLink>
          </div>
        </div>
        <Section>
          <H2>
            <Trans>Financial Position {jurisdiction.financialYear}</Trans>
          </H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatBox
              title={
                <div className="flex items-center">
                  <Trans>Net Debt</Trans>
                  <Tooltip text="Net Debt is what remains after subtracting financial assets (like cash and investments) from the Total Debt. It represents the debt that isn't immediately covered by liquid assets.">
                    <HelpIcon />
                  </Tooltip>
                </div>
              }
              value={netDebtFormatted}
              description={
                <Trans>
                  As of fiscal year end {jurisdiction.financialYear}
                </Trans>
              }
            />

            <StatBox
              title={
                <div className="flex items-center">
                  <Trans>Total Debt</Trans>
                  <Tooltip text="Total Debt is the government's complete outstanding debt. This is the figure on which interest payments are calculated.">
                    <HelpIcon />
                  </Tooltip>
                </div>
              }
              value={totalDebtFormatted}
              description={
                <Trans>
                  As of fiscal year end {jurisdiction.financialYear}
                </Trans>
              }
            />

            <StatBox
              title={
                <div className="flex items-center">
                  <Trans>Interest on Debt</Trans>
                  <Tooltip text="Annual interest payments on Ontario's outstanding debt. This represents the cost of servicing the province's debt obligations.">
                    <HelpIcon />
                  </Tooltip>
                </div>
              }
              value={interestOnDebtFormatted}
              description={
                <Trans>
                  Annual interest expense for {jurisdiction.financialYear}
                </Trans>
              }
            />
          </div>
        </Section>
        <Section>
          <H2>
            <Trans>{jurisdiction.name} Government Workforce</Trans>
          </H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatBox
              title={<Trans>Public Service Employees</Trans>}
              value={jurisdiction.totalEmployees.toLocaleString("en-CA")}
              description={<Trans>Estimated provincial public service</Trans>}
            />

            <StatBox
              title={<Trans>Ministries + Agencies</Trans>}
              value={(
                departments.length ||
                (Array.isArray((jurisdiction as any).ministries)
                  ? (jurisdiction as any).ministries.length
                  : 0)
              ).toLocaleString("en-CA")}
              description={<Trans>Provincial organizations</Trans>}
            />
          </div>
          <P className="text-sm mt-4">
            <Trans>Sources:</Trans>{" "}
            <ExternalLink href={jurisdiction.source}>
              <Trans>
                Public Accounts of {jurisdiction.name} FY{" "}
                {jurisdiction.financialYear}
              </Trans>
            </ExternalLink>
          </P>
        </Section>
        <Section>
          <H2>
            <Trans>{jurisdiction.name} Government Departments explained</Trans>
          </H2>
          <JurisdictionDepartmentList
            jurisdiction={jurisdiction}
            lang={lang}
            departments={departments}
          />
        </Section>
        <Section>
          <H2>
            <Trans>Sources</Trans>
          </H2>
          <P>
            <Trans>
              All government spending data is sourced from official databases,
              but due to the complexity of these systems, occasional errors may
              occur despite our best efforts. We aim to make this information
              more accessible and accurate, and we welcome feedback. If you
              notice any issues, please let us know{" "}
              <InternalLink href="/contact">here</InternalLink> — we appreciate
              it and will work to address them promptly.
            </Trans>
          </P>
        </Section>
      </PageContent>
    </Page>
  );
}

const StatBox = ({
  title,
  value,
  description,
}: {
  title: React.ReactNode;
  value: string;
  description: React.ReactNode;
}) => (
  <div className="flex flex-col mr-8 mb-8">
    <div className="text-sm text-gray-600 mb-1">{title}</div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm text-gray-600">{description}</div>
  </div>
);
