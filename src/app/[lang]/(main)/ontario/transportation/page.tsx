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
		title: t`Ontario Transportation | CanadaSpends`,
		description: t`Explore Ontario's Transportation spending: $7.4B in fiscal year 2024, covering highways, public transit.`,
	};
}

export default async function TransportationPage(
	props: PageLangParam,
) {
	const params = await props.params;
	initLingui(params.lang);
	const { t } = useLingui();

	const { jurisdiction } = getJurisdictionData("ontario");
	const departments = getExpandedDepartments("ontario");
	const department = getDepartmentData("ontario", "transportation");

	return (
		<Page>
			<PageContent>
				<Section>
					<H1>
						<Trans>Ontario Transportation</Trans>
					</H1>
					<Intro>
						<Trans>
							The Transportation ministry manages critical provincial transportation operations and infrastructure for Ontario.
						</Trans>
					</Intro>

					<StatCardContainer>
						<StatCard
							title={t`In FY 2024,`}
							value={department.totalSpendingFormatted}
							subtitle={t`was spent by Transportation`}
						/>
						<StatCard
							title={t`In FY 2024,`}
							value={department.percentageFormatted}
							subtitle={t`of Ontario provincial spending was by Transportation`}
						/>
					</StatCardContainer>

					<P>
						<Trans>
							The Ontario Transportation spent {department.totalSpendingFormatted} in fiscal year (FY) 2024, 
							representing {department.percentageFormatted} of the $200.6 billion in total provincial spending.
						</Trans>
					</P>

					<H2><Trans>Transportation accounted for {department.percentageFormatted} of all Ontario provincial spending in FY 2024</Trans></H2>

					<P>
						<Trans>
							This ministry plays an important role in Ontario's government operations, 
							delivering essential transportation services and infrastructure across the province.
						</Trans>
					</P>

					<ChartContainer>
						<DepartmentMiniSankey department={department} />
					</ChartContainer>

					<Section>
						<H3><Trans>Major Programs and Services</Trans></H3>
						<P>
							<Trans>
								The Transportation ministry operates various programs and services as part of Ontario's commitment 
								to delivering effective transportation infrastructure and services.
							</Trans>
						</P>
					</Section>

					<Section>
						<H2><Trans>Other Ontario Government Ministries</Trans></H2>
						<JurisdictionDepartmentList
							jurisdiction={jurisdiction}
							lang={params.lang}
							departments={departments}
							current="transportation"
						/>
					</Section>
				</Section>
			</PageContent>
		</Page>
	);
} 