export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface TaxCalculation {
  grossIncome: number;
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
}

// 2024 Federal basic personal amount (tax-free threshold)
export const FEDERAL_BASIC_PERSONAL_AMOUNT = 15705;

// 2024 Ontario basic personal amount
export const ONTARIO_BASIC_PERSONAL_AMOUNT = 12399;

// 2024 Alberta basic personal amount
export const ALBERTA_BASIC_PERSONAL_AMOUNT = 21885;

// 2024 Federal tax brackets
export const FEDERAL_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 55867, rate: 0.15 },
  { min: 55867, max: 111733, rate: 0.205 },
  { min: 111733, max: 173205, rate: 0.26 },
  { min: 173205, max: 246752, rate: 0.29 },
  { min: 246752, max: null, rate: 0.33 },
];

// 2024 Ontario provincial tax brackets
export const ONTARIO_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 51446, rate: 0.0505 },
  { min: 51446, max: 102894, rate: 0.0915 },
  { min: 102894, max: 150000, rate: 0.1116 },
  { min: 150000, max: 220000, rate: 0.1216 },
  { min: 220000, max: null, rate: 0.1316 },
];

// 2024 Alberta provincial tax brackets
export const ALBERTA_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 148269, rate: 0.1 },
  { min: 148269, max: 177922, rate: 0.12 },
  { min: 177922, max: 237230, rate: 0.13 },
  { min: 237230, max: 355845, rate: 0.14 },
  { min: 355845, max: null, rate: 0.15 },
];

export function calculateTaxFromBrackets(
  income: number,
  brackets: TaxBracket[],
): number {
  let tax = 0;

  for (const bracket of brackets) {
    if (income <= bracket.min) {
      break;
    }

    const taxableInThisBracket = Math.min(
      income - bracket.min,
      bracket.max ? bracket.max - bracket.min : income - bracket.min,
    );

    tax += taxableInThisBracket * bracket.rate;
  }

  return tax;
}

export function calculateFederalTax(income: number): number {
  // Step 1: Calculate tax on full income using progressive brackets
  const taxOnFullIncome = calculateTaxFromBrackets(
    income,
    FEDERAL_TAX_BRACKETS,
  );

  // Step 2: Apply BPA as a credit (15% of BPA)
  const bpaCredit = FEDERAL_BASIC_PERSONAL_AMOUNT * 0.15;

  // Step 3: Subtract the credit from the calculated tax
  return Math.max(0, taxOnFullIncome - bpaCredit);
}

export function calculateOntarioTax(income: number): number {
  // Step 1: Calculate tax on full income using progressive brackets
  const taxOnFullIncome = calculateTaxFromBrackets(
    income,
    ONTARIO_TAX_BRACKETS,
  );

  // Step 2: Apply BPA as a credit (5.05% of BPA - lowest provincial rate)
  const bpaCredit = ONTARIO_BASIC_PERSONAL_AMOUNT * 0.0505;

  // Step 3: Subtract the credit from the calculated tax
  return Math.max(0, taxOnFullIncome - bpaCredit);
}

export function calculateAlbertaTax(income: number): number {
  // Step 1: Calculate tax on full income using progressive brackets
  const taxOnFullIncome = calculateTaxFromBrackets(
    income,
    ALBERTA_TAX_BRACKETS,
  );

  // Step 2: Apply BPA as a credit (10% of BPA - lowest provincial rate)
  const bpaCredit = ALBERTA_BASIC_PERSONAL_AMOUNT * 0.1;

  // Step 3: Subtract the credit from the calculated tax
  return Math.max(0, taxOnFullIncome - bpaCredit);
}

export function calculateTotalTax(
  income: number,
  province: string = "ontario",
): TaxCalculation {
  const federalTax = calculateFederalTax(income);

  let provincialTax = 0;
  switch (province.toLowerCase()) {
    case "ontario":
      provincialTax = calculateOntarioTax(income);
      break;
    case "alberta":
      provincialTax = calculateAlbertaTax(income);
      break;
    default:
      provincialTax = calculateOntarioTax(income); // Default to Ontario for now
  }

  const totalTax = federalTax + provincialTax;
  const netIncome = income - totalTax;
  const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    grossIncome: income,
    federalTax,
    provincialTax,
    totalTax,
    netIncome,
    effectiveTaxRate,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(rate: number): string {
  return `${rate.toFixed(1)}%`;
}
