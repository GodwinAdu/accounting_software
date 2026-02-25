export interface TaxCalculation {
  subtotal: number;
  taxAmount: number;
  total: number;
  taxRate: number;
}

export function calculateTax(amount: number, taxRate: number, taxEnabled: boolean = true): TaxCalculation {
  if (!taxEnabled || taxRate === 0) {
    return {
      subtotal: amount,
      taxAmount: 0,
      total: amount,
      taxRate: 0,
    };
  }

  const taxAmount = (amount * taxRate) / 100;
  const total = amount + taxAmount;

  return {
    subtotal: amount,
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    taxRate,
  };
}

export function calculateTaxFromTotal(totalAmount: number, taxRate: number, taxEnabled: boolean = true): TaxCalculation {
  if (!taxEnabled || taxRate === 0) {
    return {
      subtotal: totalAmount,
      taxAmount: 0,
      total: totalAmount,
      taxRate: 0,
    };
  }

  const subtotal = totalAmount / (1 + taxRate / 100);
  const taxAmount = totalAmount - subtotal;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    total: totalAmount,
    taxRate,
  };
}

export function getTaxBreakdown(items: Array<{ amount: number; quantity?: number; taxable?: boolean }>, taxRate: number, taxEnabled: boolean = true) {
  let taxableAmount = 0;
  let nonTaxableAmount = 0;

  items.forEach((item) => {
    const itemTotal = item.amount * (item.quantity || 1);
    if (item.taxable !== false) {
      taxableAmount += itemTotal;
    } else {
      nonTaxableAmount += itemTotal;
    }
  });

  const taxCalc = calculateTax(taxableAmount, taxRate, taxEnabled);

  return {
    taxableAmount,
    nonTaxableAmount,
    subtotal: taxableAmount + nonTaxableAmount,
    taxAmount: taxCalc.taxAmount,
    total: taxableAmount + nonTaxableAmount + taxCalc.taxAmount,
    taxRate,
  };
}
