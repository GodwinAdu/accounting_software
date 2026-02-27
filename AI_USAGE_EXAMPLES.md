# AI Features Usage Examples

## Quick Start

All AI components are available in `@/components/ai` and can be imported individually or together.

```typescript
import { AIButton, AIInsightCard, SalarySuggestionModal } from "@/components/ai";
```

---

## 1. Payroll Module - Salary Suggestions

### Usage in Employee Form

```typescript
"use client";

import { useState } from "react";
import { SalarySuggestionModal } from "@/components/ai";
import { Button } from "@/components/ui/button";

export function EmployeeForm() {
  const [showAISalary, setShowAISalary] = useState(false);
  const [salary, setSalary] = useState("");

  return (
    <div>
      <Input
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        placeholder="Salary"
      />
      <Button onClick={() => setShowAISalary(true)}>AI Suggest Salary</Button>

      <SalarySuggestionModal
        open={showAISalary}
        onClose={() => setShowAISalary(false)}
        onApply={(suggestedSalary) => setSalary(suggestedSalary.toString())}
      />
    </div>
  );
}
```

### Direct API Usage

```typescript
import { suggestSalary } from "@/lib/actions/ai.action";

const result = await suggestSalary("Software Engineer", 5, "Technology");
if (result.success) {
  console.log(result.suggestion);
  // { min: 8000, max: 15000, average: 11500, currency: "GHS", reasoning: "..." }
}
```

---

## 2. Accounting Module - Journal Entry Suggestions

### Usage in Journal Entry Form

```typescript
"use client";

import { JournalEntrySuggestion } from "@/components/ai";

export function JournalEntryPage() {
  const handleApply = (debitAccount: string, creditAccount: string, amount: number) => {
    // Apply to form
    setDebitAccount(debitAccount);
    setCreditAccount(creditAccount);
    setAmount(amount);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>{/* Your journal entry form */}</div>
      <JournalEntrySuggestion onApply={handleApply} />
    </div>
  );
}
```

---

## 3. Budgeting Module - Budget Suggestions

### Usage in Budget Form

```typescript
"use client";

import { BudgetSuggestion } from "@/components/ai";

export function BudgetForm() {
  const handleApply = (suggestedAmount: number) => {
    setBudgetAmount(suggestedAmount);
  };

  return (
    <div className="space-y-4">
      <BudgetSuggestion onApply={handleApply} />
    </div>
  );
}
```

### Variance Analysis

```typescript
import { analyzeVariance } from "@/lib/actions/ai.action";

const result = await analyzeVariance(5000, 6200, "Office Supplies");
if (result.success) {
  console.log(result.analysis); // AI analysis text
  console.log(result.variance); // 24.0 (percentage)
}
```

---

## 4. CRM Module - Customer Segmentation

### Usage in CRM Dashboard

```typescript
"use client";

import { CustomerSegmentation } from "@/components/ai";

export function CRMDashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>{/* Other CRM widgets */}</div>
      <CustomerSegmentation />
    </div>
  );
}
```

### Lead Scoring

```typescript
import { scoreLeads } from "@/lib/actions/ai.action";

const leads = [
  { name: "John Doe", company: "Tech Corp", email: "john@techcorp.com" },
  { name: "Jane Smith", company: "Business Inc", email: "jane@business.com" },
];

const result = await scoreLeads(leads);
if (result.success) {
  result.scores.scores.forEach((score) => {
    console.log(`${score.name}: ${score.score}/100 - ${score.priority} priority`);
  });
}
```

---

## 5. Products/Inventory Module - Demand Forecasting

### Usage in Product Details

```typescript
"use client";

import { useState } from "react";
import { AIButton, AIInsightCard } from "@/components/ai";
import { forecastDemand } from "@/lib/actions/ai.action";

export function ProductDetails({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);

  const handleForecast = async () => {
    setLoading(true);
    const result = await forecastDemand(productId);
    if (result.success) {
      setForecast(result.forecast);
    }
    setLoading(false);
  };

  return (
    <div>
      <AIButton onClick={handleForecast} loading={loading}>
        Forecast Demand
      </AIButton>

      {forecast && (
        <AIInsightCard
          title="Demand Forecast"
          confidence={forecast.confidence}
          content={
            <div>
              <p>Reorder Point: {forecast.reorderPoint} units</p>
              {forecast.forecast.map((f: any) => (
                <div key={f.month}>
                  {f.month}: {f.quantity} units
                </div>
              ))}
            </div>
          }
        />
      )}
    </div>
  );
}
```

### Price Optimization

```typescript
import { optimizePrice } from "@/lib/actions/ai.action";

const result = await optimizePrice(productId, 100);
if (result.success) {
  console.log(`Suggested Price: GHS ${result.optimization.suggestedPrice}`);
  console.log(`Expected Revenue: GHS ${result.optimization.expectedRevenue}`);
  console.log(result.optimization.reasoning);
}
```

---

## 6. Tax Module - Tax Deduction Suggestions

### Usage in Tax Dashboard

```typescript
"use client";

import { useState } from "react";
import { AIButton } from "@/components/ai";
import { suggestTaxDeductions } from "@/lib/actions/ai.action";

export function TaxDashboard() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState("");

  const handleSuggest = async () => {
    setLoading(true);
    const result = await suggestTaxDeductions();
    if (result.success) {
      setSuggestions(result.suggestions);
    }
    setLoading(false);
  };

  return (
    <div>
      <AIButton onClick={handleSuggest} loading={loading}>
        Analyze Tax Deductions
      </AIButton>
      {suggestions && (
        <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm">{suggestions}</pre>
        </div>
      )}
    </div>
  );
}
```

---

## 7. Projects Module - Budget Forecasting

### Usage in Project Form

```typescript
import { forecastProjectBudget } from "@/lib/actions/ai.action";

const handleForecast = async () => {
  const result = await forecastProjectBudget("Website Redesign", 200, 5);
  if (result.success) {
    console.log(`Estimated Cost: GHS ${result.forecast.estimatedCost}`);
    console.log(`Contingency: GHS ${result.forecast.contingency}`);
    console.log(`Timeline: ${result.forecast.timeline}`);
    console.log("Risks:", result.forecast.risks);
  }
};
```

---

## 8. Expenses Module - Already Implemented

The expense module already has AI features implemented:
- AI Categorization (in expense form)
- Receipt OCR (in expense form)
- Anomaly Detection (in expense form)

---

## 9. Invoices Module - Already Implemented

The invoice module already has AI features implemented:
- Smart Invoice Suggestions (in invoice form)
- AI Email Generator (in invoice actions)
- Email Sending via SMTP (in invoice actions)

---

## Custom AI Button Usage

```typescript
import { AIButton } from "@/components/ai";

<AIButton
  onClick={handleClick}
  loading={isLoading}
  disabled={!canUse}
  variant="default"
  size="lg"
  className="custom-class"
>
  Custom AI Action
</AIButton>
```

---

## Custom AI Insight Card Usage

```typescript
import { AIInsightCard } from "@/components/ai";

<AIInsightCard
  title="AI Recommendation"
  confidence="high"
  content={
    <div>
      <p>Your custom content here</p>
      <Button>Take Action</Button>
    </div>
  }
  className="custom-class"
/>
```

---

## Access Control

All AI features automatically check if the AI module is enabled:

```typescript
// In your page/component
import { checkModuleAccess } from "@/lib/helpers/module-access";

export default async function Page() {
  const hasAIAccess = await checkModuleAccess(organizationId, "ai");

  return (
    <div>
      {hasAIAccess && <AIFeatureComponent />}
    </div>
  );
}
```

---

## Error Handling

All AI functions return a consistent format:

```typescript
const result = await anyAIFunction(...params);

if (result.success) {
  // Use result.data, result.suggestion, result.forecast, etc.
} else {
  // Handle error
  console.error(result.error);
  toast.error(result.error);
}
```

---

## Best Practices

1. **Always show loading states** - AI calls can take 1-3 seconds
2. **Handle errors gracefully** - Show user-friendly error messages
3. **Check AI access** - Conditionally render AI features based on module access
4. **Provide context** - Give users clear information about what AI is suggesting
5. **Allow manual override** - Don't force AI suggestions, let users choose
6. **Show confidence levels** - Display AI confidence when available
7. **Explain reasoning** - Show why AI made a suggestion when provided

---

## Performance Tips

1. **Debounce AI calls** - Don't call AI on every keystroke
2. **Cache results** - Store AI suggestions temporarily
3. **Lazy load components** - Use dynamic imports for AI components
4. **Batch requests** - Combine multiple AI calls when possible

```typescript
// Example: Debounced AI call
import { useDebouncedCallback } from "use-debounce";

const debouncedSuggest = useDebouncedCallback(async () => {
  const result = await categorizeExpense(description, amount);
  setSuggestion(result.suggestion);
}, 1000);
```
