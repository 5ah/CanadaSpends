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

          <H2>
            <Trans>Department Spending</Trans>
          </H2>

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

          <div className="mt-6"></div>

          <P>
            <Trans>{department.descriptionText}</Trans>
          </P>

          <P>
            <Trans>{department.roleText}</Trans>
          </P>

          <ChartContainer>
            <DepartmentMiniSankey department={department} />
          </ChartContainer>

          <div className="mt-8"></div>

          {department.prioritiesHeading && department.prioritiesDescription && (
            <Section>
              <H2>
                <Trans>{department.prioritiesHeading}</Trans>
              </H2>
              <div>
                {department.prioritiesDescription
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <div key={index}>
                      {paragraph.startsWith("•") ? (
                        <ul className="list-disc pl-6 space-y-2">
                          {paragraph
                            .split("\n")
                            .filter((line) => line.trim().startsWith("•"))
                            .map((item, itemIndex) => {
                              const cleanItem = item.replace("• ", "");
                              const parts = cleanItem.split(" – ");
                              return (
                                <li key={itemIndex} className="text-gray-700">
                                  <strong>{parts[0]}</strong>
                                  {parts[1] && ` – ${parts[1]}`}
                                </li>
                              );
                            })}
                        </ul>
                      ) : (
                        <P>
                          <Trans>{paragraph}</Trans>
                        </P>
                      )}
                    </div>
                  ))}
              </div>
            </Section>
          )}

          {department.leadershipHeading && department.leadershipDescription && (
            <Section>
              <H2>
                <Trans>{department.leadershipHeading}</Trans>
              </H2>
              <P>
                <Trans>{department.leadershipDescription}</Trans>
              </P>
            </Section>
          )}

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
