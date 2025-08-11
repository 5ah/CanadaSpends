// Direct mapping: sankey node name → department slug
export const nodeToDepartment: Record<string, string> = {
  // Direct department mappings
  Defence: "national-defence",
  "International Affairs": "global-affairs-canada",
  "Immigration + Border Security": "immigration-refugees-and-citizenship",
  "Support for Veterans": "veterans-affairs",
  Transportation: "transport-canada",
  "Infrastructure Investments": "housing-infrastructure-communities",
  Health: "health-canada",
  "Public Works + Government Services":
    "public-services-and-procurement-canada",
  "Innovation + Research": "innovation-science-and-industry",
  "Net Interest on Debt": "department-of-finance",
  "Health Transfers to Provinces": "department-of-finance",
  "Employment + Training": "employment-and-social-development-canada",
  "Social Security": "employment-and-social-development-canada",
  "Indigenous Priorities": "indigenous-services-and-northern-affairs",
  "Indigenous Well-Being + Self Determination":
    "indigenous-services-and-northern-affairs",
  "Crown-Indigenous Relations": "indigenous-services-and-northern-affairs",

  // Public Safety Canada nodes
  CSIS: "public-safety-canada",
  Corrections: "public-safety-canada",
  RCMP: "public-safety-canada",
  "Disaster Relief": "public-safety-canada",
  "Community Safety": "public-safety-canada",
  "Other Public Safety Expenses": "public-safety-canada",

  // Child nodes that should also map to their parent departments
  "Border Security": "immigration-refugees-and-citizenship",
  "Other Immigration Services": "immigration-refugees-and-citizenship",
  "Settlement Assistance": "immigration-refugees-and-citizenship",
  "Health Care Systems + Protection": "health-canada",
  "Food Safety": "health-canada",
  "Public Health + Disease Prevention": "health-canada",
  "Government IT Operations": "public-services-and-procurement-canada",
  "Ready Forces": "national-defence",
  "Defence Procurement": "national-defence",
  "Retirement Benefits": "employment-and-social-development-canada",
  "Employment Insurance": "employment-and-social-development-canada",
  "Children's Benefits": "employment-and-social-development-canada",
};

// Department slug → official name
export const departmentNames: Record<string, string> = {
  "canada-revenue-agency": "Canada Revenue Agency",
  "national-defence": "National Defence",
  "global-affairs-canada": "Global Affairs Canada",
  "immigration-refugees-and-citizenship":
    "Immigration, Refugees and Citizenship",
  "veterans-affairs": "Veterans Affairs",
  "transport-canada": "Transport Canada",
  "housing-infrastructure-communities":
    "Housing, Infrastructure and Communities Canada",
  "health-canada": "Health Canada",
  "public-services-and-procurement-canada":
    "Public Services and Procurement Canada",
  "innovation-science-and-industry": "Innovation, Science and Industry",
  "public-safety-canada": "Public Safety Canada",
  "indigenous-services-and-northern-affairs":
    "Indigenous Services Canada + Crown-Indigenous Relations and Northern Affairs Canada",
  "employment-and-social-development-canada":
    "Employment and Social Development Canada",
  "department-of-finance": "Finance Canada",
};
