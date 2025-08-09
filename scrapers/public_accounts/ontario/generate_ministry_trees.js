const fs = require("fs");
const path = require("path");

// Paths
const provincialFile = path.join(__dirname, "Ontario2024CompressedSankey.json");
const provincialData = JSON.parse(fs.readFileSync(provincialFile, "utf8"));

// Output directory inside src so it is part of the Next.js bundle
const outputDir = path.join(__dirname, "..", "src", "data", "ministries");
fs.mkdirSync(outputDir, { recursive: true });

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s*→\s*/g, "-") // replace arrow with dash
    .replace(/[^a-z0-9]+/g, "-") // non-alphanum to dash
    .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
    .replace(/--+/g, "-"); // collapse consecutive dashes
}

function sumAmounts(node) {
  if (typeof node.amount === "number") {
    return node.amount;
  }
  if (!node.children || node.children.length === 0) {
    return 0;
  }
  return node.children.reduce((acc, child) => acc + sumAmounts(child), 0);
}

// Iterate over top-level ministries
provincialData.spending_data.children.forEach((ministry) => {
  const baseSlug = slugify(ministry.name);
  let slug = baseSlug;

  // Check if directory with baseSlug exists; if not, check doubled slug form
  const dirBase = path.join(
    __dirname,
    "..",
    "src",
    "app",
    "[lang]",
    "(main)",
    "ontario",
    baseSlug,
  );
  if (!fs.existsSync(dirBase)) {
    const doubleSlug = `${baseSlug}-${baseSlug}`;
    const dirDouble = path.join(
      __dirname,
      "..",
      "src",
      "app",
      "[lang]",
      "(main)",
      "ontario",
      doubleSlug,
    );
    if (fs.existsSync(dirDouble)) {
      slug = doubleSlug;
    }
  }

  const totalSpending = sumAmounts(ministry);
  // Clone ministry subtree so we can add amount to root
  const ministryTree = JSON.parse(JSON.stringify(ministry));
  ministryTree.amount = totalSpending;

  const moduleObject = {
    name: ministry.name,
    slug,
    totalSpending,
    spending_data: ministryTree,
  };

  const tsPath = path.join(outputDir, `${slug}.ts`);

  const fileContent = `// Auto-generated from Ontario2024CompressedSankey.json – DO NOT EDIT BY HAND
import { SankeyNode } from "@/components/Sankey/SankeyChartD3";

type MinistryData = {
  name: string;
  slug: string;
  totalSpending: number;
  spending_data: SankeyNode;
};

const ministryData: MinistryData = ${JSON.stringify(moduleObject, null, 2)} as MinistryData;

export default ministryData;
`;

  fs.writeFileSync(tsPath, fileContent);
  console.log(`Generated module for ${ministry.name} -> ${slug}.ts`);
});

console.log("✅ All ministry modules generated.");
