import {
  getDepartmentData,
  getDepartmentsForJurisdiction,
  getExpandedDepartments,
  getJurisdictionData,
  getJurisdictionSlugs,
} from "@/lib/jurisdictions";

export const dynamicParams = false;

export async function generateStaticParams() {
  const jurisdictions = getJurisdictionSlugs();
  const languages = ["en", "fr"]; // or import from your locales

  const all = languages.flatMap((lang) =>
    jurisdictions.flatMap((jurisdiction) => {
      const departments = getDepartmentsForJurisdiction(jurisdiction);
      return departments.map((department) => ({
        lang,
        jurisdiction,
        department,
      }));
    }),
  );

  return all;
}

import {
  ChartContainer,
  H1,
  H2,
  H3,
  Intro,
  P,
  Page,
  PageContent,
  Section,
} from "@/components/Layout";
import { StatCard, StatCardContainer } from "@/components/StatCard";
import { initLingui } from "@/initLingui";
import { Trans } from "@lingui/react/macro";
import { DepartmentMiniSankey } from "@/components/Sankey/DepartmentMiniSankey";
import { JurisdictionDepartmentList } from "@/components/DepartmentList";

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ lang: string; jurisdiction: string; department: string }>;
}) {
  const {
    lang,
    jurisdiction: jurisdictionSlug,
    department: departmentSlug,
  } = await params;

  initLingui(lang);

  const { jurisdiction } = getJurisdictionData(jurisdictionSlug);
  const departments = getExpandedDepartments(jurisdiction.slug);

  const department = getDepartmentData(jurisdictionSlug, departmentSlug);

  return (
    <Page>
      <PageContent>
        <Section>
          <H1>
            <Trans>{department.name}</Trans>
          </H1>
          <Intro>
            <Trans>{department.introText}</Trans>
          </Intro>

          <StatCardContainer>
            <StatCard
              title={
                <Trans>In Financial Year {jurisdiction.financialYear},</Trans>
              }
              value={department.totalSpendingFormatted}
              subtitle={<Trans>was spent by {department.name}</Trans>}
            />
            <StatCard
              title={
                <Trans>In Financial Year {jurisdiction.financialYear},</Trans>
              }
              value={department.percentageFormatted}
              subtitle={
                <Trans>
                  of {jurisdiction.name} provincial spending was by{" "}
                  {department.name}
                </Trans>
              }
            />
          </StatCardContainer>

          <P>
            <Trans>{department.descriptionText}</Trans>
          </P>

          <H2>
            <Trans>
              {department.name} accounted for {department.percentageFormatted}{" "}
              of all {jurisdiction.name} provincial spending in FY{" "}
              {jurisdiction.financialYear}
            </Trans>
          </H2>

          <P>
            <Trans>{department.roleText}</Trans>
          </P>

          <ChartContainer>
            <DepartmentMiniSankey department={department} />
          </ChartContainer>

          <Section>
            <H3>
              <Trans>{department.programsHeading}</Trans>
            </H3>
            <P>
              <Trans>{department.programsDescription}</Trans>
            </P>
          </Section>

          <Section>
            <H2>
              <Trans>Other {jurisdiction.name} Government Ministries</Trans>
            </H2>
            <JurisdictionDepartmentList
              jurisdiction={jurisdiction}
              lang={lang}
              departments={departments}
              current={department.slug}
            />
          </Section>
        </Section>
      </PageContent>
    </Page>
  );
}
