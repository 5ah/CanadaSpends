const fs = require("fs");
const path = require("path");

// Read the summary to get all ministries
const summaryData = JSON.parse(
  fs.readFileSync("./ministries/_summary.json", "utf8"),
);

// Ministries that already have pages created
const existingMinistries = ["health", "education"];

// Filter to get ministries that need pages
const ministriesToCreate = summaryData.ministries.filter(
  (ministry) => !existingMinistries.includes(ministry.slug),
);

console.log(`Creating pages for ${ministriesToCreate.length} ministries...`);

// Function to create slug-friendly component name
function createComponentName(slug) {
  return (
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("") + "MiniSankey"
  );
}

// Function to create human-readable ministry name for descriptions
function createDescription(ministryName, totalSpending) {
  const lowerName = ministryName.toLowerCase();
  let description = `Explore Ontario's ${ministryName} spending: ${totalSpending} in fiscal year 2024`;

  // Add specific context based on ministry
  if (lowerName.includes("health")) {
    description += ", covering hospitals, physicians, and health services";
  } else if (lowerName.includes("education")) {
    description += ", covering schools, teachers, and education programs";
  } else if (lowerName.includes("children") || lowerName.includes("social")) {
    description += ", covering ODSP, Ontario Works, and child protection";
  } else if (lowerName.includes("finance")) {
    description += ", covering treasury operations and municipal support";
  } else if (lowerName.includes("transportation")) {
    description +=
      ", covering transit, highways, and transportation infrastructure";
  } else if (lowerName.includes("long-term care")) {
    description += ", covering long-term care homes and operations";
  } else if (lowerName.includes("college") || lowerName.includes("universit")) {
    description += ", covering post-secondary education and research";
  } else if (lowerName.includes("energy")) {
    description += ", covering electricity programs and energy policy";
  } else if (lowerName.includes("solicitor")) {
    description += ", covering policing, corrections, and public safety";
  } else if (lowerName.includes("attorney")) {
    description += ", covering courts, legal services, and justice programs";
  } else {
    description += ", covering ministry operations and programs";
  }

  description += `.`;
  return description;
}

// Template for page.tsx
function createPageTemplate(ministry) {
  const componentName = createComponentName(ministry.slug);
  const description = createDescription(
    ministry.name,
    ministry.totalSpendingFormatted,
    ministry.percentageFormatted,
  );

  return `import {
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
import { OntarioMinistryList } from "@/components/OntarioMinistryList";
import { StatCard, StatCardContainer } from "@/components/StatCard";
import { initLingui, type PageLangParam } from "@/initLingui";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PropsWithChildren } from "react";
import { ${componentName} } from "./${componentName}";

export async function generateMetadata(
	props: PropsWithChildren<PageLangParam>,
) {
	const lang = (await props.params).lang;
	initLingui(lang);

	const { t } = useLingui();
	return {
		title: t\`Ontario ${ministry.name} | CanadaSpends\`,
		description: t\`${description}\`,
	};
}

export default async function ${ministry.name.replace(/[^a-zA-Z0-9]/g, "")}Page(
	props: PageLangParam,
) {
	const params = await props.params;
	initLingui(params.lang);
	const { t } = useLingui();

	return (
		<Page>
			<PageContent>
				<Section>
					<H1>
						<Trans>Ontario ${ministry.name}</Trans>
					</H1>
					<Intro>
						<Trans>
							The ${ministry.name} ministry manages critical provincial operations and services for Ontario residents.
						</Trans>
					</Intro>

					<StatCardContainer>
						<StatCard
							title={t\`In FY 2024,\`}
							value="${ministry.totalSpendingFormatted}"
							subtitle={t\`was spent by ${ministry.name}\`}
						/>
						<StatCard
							title={t\`In FY 2024,\`}
							value="${ministry.percentageFormatted}"
							subtitle={t\`of Ontario provincial spending was by ${ministry.name}\`}
						/>
					</StatCardContainer>

					<P>
						<Trans>
							The Ontario ${ministry.name} spent ${ministry.totalSpendingFormatted} in fiscal year (FY) 2024, 
							representing ${ministry.percentageFormatted} of the $200.6 billion in total provincial spending.
						</Trans>
					</P>

					<H2><Trans>${ministry.name} accounted for ${ministry.percentageFormatted} of all Ontario provincial spending in FY 2024</Trans></H2>

					<P>
						<Trans>
							This ministry plays an important role in Ontario's government operations, 
							delivering essential services and programs to residents across the province.
						</Trans>
					</P>

					<ChartContainer>
						<NoSSR>
							<${componentName} />
						</NoSSR>
					</ChartContainer>

					<Section>
						<H3><Trans>Major Programs and Services</Trans></H3>
						<P>
							<Trans>
								The ${ministry.name} operates various programs and services as part of Ontario's commitment 
								to delivering effective government services to residents.
							</Trans>
						</P>
					</Section>

					<Section>
						<H2><Trans>Other Ontario Government Ministries</Trans></H2>
						<OntarioMinistryList current="${ministry.slug}" />
					</Section>
				</Section>
			</PageContent>
		</Page>
	);
}`;
}

// Template for MiniSankey component
function createMiniSankeyTemplate(ministry, ministryData) {
  const componentName = createComponentName(ministry.slug);
  const topCategories = ministryData.categories.slice(0, 10); // Top 10 categories

  const childrenData = topCategories
    .map(
      (cat) => `					{
						"name": t\`${cat.name}\`,
						"amount": ${cat.amount}
					}`,
    )
    .join(",\n");

  return `"use client";

import { SankeyChart } from "@/components/Sankey/SankeyChart";
import { SankeyData } from "@/components/Sankey/SankeyChartD3";
import { useLingui } from "@lingui/react/macro";
import { useMemo } from "react";

export function ${componentName}() {
	const { t } = useLingui()

	const data = useMemo(() => {
		// Actual ${ministry.name} ministry data from Ontario2024CompactSankey.json
		return JSON.parse(JSON.stringify({
			"spending": ${ministry.totalSpending.toFixed(1)}, // Actual total from the Ontario data
			"spending_data": {
				"name": t\`${ministry.name}\`,
				"children": [
${childrenData}
				]
			},
			revenue_data: {}
		}))
	}, [t])

	return <SankeyChart data={data as SankeyData} />
}`;
}

// Create pages for all ministries
let createdCount = 0;

ministriesToCreate.forEach((ministry) => {
  try {
    // Read the detailed ministry data
    const ministryDataPath = `./ministries/${ministry.slug}.json`;
    const ministryData = JSON.parse(fs.readFileSync(ministryDataPath, "utf8"));

    // Create ministry directory
    const ministryDir = `../src/app/[lang]/(main)/ontario/${ministry.slug}`;
    if (!fs.existsSync(ministryDir)) {
      fs.mkdirSync(ministryDir, { recursive: true });
    }

    // Create page.tsx
    const pageContent = createPageTemplate(ministry, ministryData);
    fs.writeFileSync(path.join(ministryDir, "page.tsx"), pageContent);

    // Create MiniSankey component
    const componentName = createComponentName(ministry.slug);
    const sankeyContent = createMiniSankeyTemplate(ministry, ministryData);
    fs.writeFileSync(
      path.join(ministryDir, `${componentName}.tsx`),
      sankeyContent,
    );

    console.log(
      `✓ Created ${ministry.name} (${ministry.totalSpendingFormatted})`,
    );
    createdCount++;
  } catch (error) {
    console.error(`✗ Failed to create ${ministry.name}:`, error.message);
  }
});

console.log(`\n✅ Successfully created ${createdCount} ministry pages!`);
console.log(`📁 All pages created in: ../src/app/[lang]/(main)/ontario/`);
