import {
	ChartContainer,
	ExternalLink,
	H1,
	H2,
	H3,
	Intro,
	P,
	Page,
	PageContent,
	Section,
} from "@/components/Layout";
import NoSSR from "@/components/NoSSR";
import { JurisdictionDepartmentList } from "@/components/DepartmentList";
import { DepartmentMiniSankey } from "@/components/Sankey/DepartmentMiniSankey";
import { StatCard, StatCardContainer } from "@/components/StatCard";
import { initLingui, type PageLangParam } from "@/initLingui";
import {
  getDepartmentData,
  getExpandedDepartments,
  getJurisdictionData,
} from "@/lib/jurisdictions";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PropsWithChildren } from "react";

export async function generateMetadata(
	props: PropsWithChildren<PageLangParam>,
) {
	const lang = (await props.params).lang;
	initLingui(lang);

	const { t } = useLingui();
	return {
		title: t`Ontario Children, Community and Social Services | CanadaSpends`,
		description: t`Explore Ontario's Children, Community and Social Services spending: $19.5B in fiscal year 2024, covering ODSP, Ontario Works, and child protection.`,
	};
}

export default async function ChildrenCommunityAndSocialServicesPage(
	props: PageLangParam,
) {
	const params = await props.params;
	initLingui(params.lang);
	const { t } = useLingui();

	const { jurisdiction } = getJurisdictionData("ontario");
	const departments = getExpandedDepartments("ontario");
	const department = getDepartmentData("ontario", "children-community-and-social-services");

	return (
		<Page>
			<PageContent>
				<Section>
					<H1>
						<Trans>Ontario Children, Community and Social Services</Trans>
					</H1>
					<Intro>
						<Trans>
							The Children, Community and Social Services ministry manages critical provincial social operations and services for Ontario residents.
						</Trans>
					</Intro>

					<StatCardContainer>
						<StatCard
							title={t`In FY 2024,`}
							value={department.totalSpendingFormatted}
							subtitle={t`was spent by Children, Community and Social Services`}
						/>
						<StatCard
							title={t`In FY 2024,`}
							value={department.percentageFormatted}
							subtitle={t`of Ontario provincial spending was by Children, Community and Social Services`}
						/>
					</StatCardContainer>

					<P>
						<Trans>
							The Ontario Children, Community and Social Services spent {department.totalSpendingFormatted} in fiscal year (FY) 2024, 
							representing {department.percentageFormatted} of the $200.6 billion in total provincial spending.
						</Trans>
					</P>

					<H2><Trans>Children, Community and Social Services accounted for {department.percentageFormatted} of all Ontario provincial spending in FY 2024</Trans></H2>

					<P>
						<Trans>
							This ministry plays an important role in Ontario's government operations, 
							delivering essential social services and programs to residents across the province.
						</Trans>
					</P>

					<ChartContainer>
						<DepartmentMiniSankey department={department} />
					</ChartContainer>

					<Section>
						<H3><Trans>Major Programs and Services</Trans></H3>
						<P>
							<Trans>
								The Children, Community and Social Services ministry operates various programs and services as part of Ontario's commitment 
								to delivering effective social services to residents.
							</Trans>
						</P>
					</Section>

					<Section>
						<H2><Trans>Other Ontario Government Ministries</Trans></H2>
						<JurisdictionDepartmentList
							jurisdiction={jurisdiction}
							lang={params.lang}
							departments={departments}
							current="children-community-and-social-services"
						/>
					</Section>
				</Section>
			</PageContent>
		</Page>
	);
} 