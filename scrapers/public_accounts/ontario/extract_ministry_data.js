const fs = require("fs");
const path = require("path");

// Read the main Ontario data file
const ontarioData = JSON.parse(
  fs.readFileSync("./Ontario2024CompactSankey.json", "utf8"),
);

// Create ministries directory if it doesn't exist
const ministriesDir = "./ministries";
if (!fs.existsSync(ministriesDir)) {
  fs.mkdirSync(ministriesDir);
}

// Function to calculate total spending for a ministry
function calculateTotalSpending(children) {
  let total = 0;

  function traverse(items) {
    if (!items) return;

    for (const item of items) {
      if (item.amount !== undefined) {
        total += item.amount;
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  }

  traverse(children);
  return total;
}

// Function to flatten ministry data into spending categories
function flattenMinistryData(children, ministryName) {
  const categories = [];

  function traverse(items) {
    if (!items) return;

    for (const item of items) {
      if (item.amount !== undefined) {
        // Create a clean category name by removing the ministry prefix
        let categoryName = item.name
          .replace(`${ministryName} → `, "")
          .replace(`${ministryName} \u2192 `, "");

        // If it's still too long, get the last part after the last arrow
        if (categoryName.includes(" → ") || categoryName.includes(" \u2192 ")) {
          const parts = categoryName.split(/\s*→\s*|\s*\u2192\s*/);
          categoryName = parts[parts.length - 1];
        }

        categories.push({
          name: categoryName,
          amount: item.amount,
        });
      }
      if (item.children) {
        traverse(item.children, item.name);
      }
    }
  }

  traverse(children);
  return categories;
}

// Function to create slug from ministry name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Extract data for each ministry
const ministries = ontarioData.spending_data.children;
const ministryStats = [];

ministries.forEach((ministry) => {
  const ministryName = ministry.name;
  const slug = createSlug(ministryName);

  // Handle special case where ministry structure is different
  let children = ministry.children;
  let totalSpending = 0;

  // Special handling for ministries with direct amounts
  if (ministry.amount !== undefined) {
    totalSpending = ministry.amount;
    children = null;
  } else if (ministryName.includes("→") || ministryName.includes("\u2192")) {
    // Handle nested structure like "Cabinet Office → Cabinet Office"
    totalSpending = ministry.children
      ? calculateTotalSpending(ministry.children)
      : 0;
  } else {
    totalSpending = calculateTotalSpending(children);
  }

  // Flatten the data for mini-sankey
  const categories = children
    ? flattenMinistryData(children, ministryName)
    : [];

  // Calculate percentage of total provincial spending
  const totalProvincialSpending = ontarioData.spending;
  const percentage = (totalSpending / totalProvincialSpending) * 100;

  const ministryData = {
    name: ministryName,
    slug: slug,
    totalSpending: totalSpending,
    totalSpendingFormatted: `$${totalSpending.toFixed(1)}B`,
    percentage: percentage,
    percentageFormatted: `${percentage.toFixed(1)}%`,
    categories: categories.sort((a, b) => b.amount - a.amount), // Sort by amount descending
    spending_data: {
      name: ministryName,
      children: categories.map((cat) => ({
        name: cat.name,
        amount: cat.amount,
      })),
    },
  };

  // Write individual ministry file
  const filename = path.join(ministriesDir, `${slug}.json`);
  fs.writeFileSync(filename, JSON.stringify(ministryData, null, 2));

  // Add to summary stats
  ministryStats.push({
    name: ministryName,
    slug: slug,
    totalSpending: totalSpending,
    totalSpendingFormatted: ministryData.totalSpendingFormatted,
    percentage: percentage,
    percentageFormatted: ministryData.percentageFormatted,
  });

  console.log(
    `✓ Created ${filename} - ${ministryName}: ${ministryData.totalSpendingFormatted} (${ministryData.percentageFormatted})`,
  );
});

// Sort ministries by spending amount
ministryStats.sort((a, b) => b.totalSpending - a.totalSpending);

// Write summary file
const summaryData = {
  totalProvincialSpending: ontarioData.spending,
  totalProvincialSpendingFormatted: `$${ontarioData.spending.toFixed(1)}B`,
  ministries: ministryStats,
  generatedAt: new Date().toISOString(),
};

fs.writeFileSync(
  path.join(ministriesDir, "_summary.json"),
  JSON.stringify(summaryData, null, 2),
);

console.log("\n📊 Ministry Spending Summary (Top 10):");
ministryStats.slice(0, 10).forEach((ministry, index) => {
  console.log(
    `${index + 1}. ${ministry.name}: ${ministry.totalSpendingFormatted} (${ministry.percentageFormatted})`,
  );
});

console.log(`\n✅ Processed ${ministries.length} ministries`);
console.log(`📁 Files created in: ${ministriesDir}/`);
