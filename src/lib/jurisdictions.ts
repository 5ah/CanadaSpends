import { SankeyData } from "@/components/Sankey/SankeyChartD3";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export type Jurisdiction = {
  slug: string;
  name: string;
  financialYear: string;
  totalEmployees: number;
  totalProvincialSpendingFormatted: string;
  totalProvincialSpending: number;
  total: number;
  source: string;
};

type Category = {
  name: string;
  amount: number;
};

export type Department = {
  slug: string;
  name: string;
  totalSpending: number;
  totalSpendingFormatted: string;
  percentage: number;
  percentageFormatted: string;
  categories: Category[];
  spending_data: {
    name: string;
    children: Category[];
  };
  generatedAt: string;
  // Editable content fields
  introText: string;
  descriptionText: string;
  roleText: string;
  programsHeading: string;
  programsDescription: string;
};

type Data = {
  jurisdiction: Jurisdiction;
  sankey: SankeyData;
};

export function getJurisdictionSlugs(): string[] {
  return fs
    .readdirSync(dataDir)
    .filter((f) => fs.statSync(path.join(dataDir, f)).isDirectory());
}

export function getJurisdictionData(jurisdiction: string): Data {
  const jurisdictionData = JSON.parse(
    fs.readFileSync(path.join(dataDir, jurisdiction, "summary.json"), "utf8"),
  );
  return {
    jurisdiction: { slug: jurisdiction, ...jurisdictionData },
    sankey: JSON.parse(
      fs.readFileSync(path.join(dataDir, jurisdiction, "sankey.json"), "utf8"),
    ),
  };
}

export function getDepartmentData(
  jurisdiction: string,
  department: string,
): Department {
  const departmentData: Omit<Department, "slug"> = JSON.parse(
    fs.readFileSync(
      path.join(dataDir, jurisdiction, "departments", `${department}.json`),
      "utf8",
    ),
  );

  return {
    slug: department,
    ...departmentData,
  };
}

export function getDepartmentsForJurisdiction(jurisdiction: string): string[] {
  return fs
    .readdirSync(path.join(dataDir, jurisdiction, "departments"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

export function getExpandedDepartments(jurisdiction: string): Department[] {
  const slugs = getDepartmentsForJurisdiction(jurisdiction);
  return slugs.map((slug) => getDepartmentData(jurisdiction, slug));
}

export function departmentHref(
  jurisdiction: string,
  department: string,
): string {
  return `/${jurisdiction}/departments/${department}`;
}
