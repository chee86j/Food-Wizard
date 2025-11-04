// JSON Error Handler
export const safeJsonParse = (jsonString) => {
  try {
    return typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
  } catch (error) {
    console.error("JSON parse error:", error);
    return null;
  }
};

// Nutrition Value Formatter
export const formatNutritionValue = (nutrient) => {
  if (!nutrient) return "N/A";
  return `${nutrient.amount}${nutrient.unit}`;
};

// Format ingredient amounts so scaled servings stay readable.
export const formatMeasuredAmount = (amount, unit, measures) => {
  if (amount === undefined || amount === null) return "";

  const normalizedAmount = Number(amount);
  if (!Number.isFinite(normalizedAmount)) return "";

  const precision = normalizedAmount >= 1 ? 2 : 3;
  const formatted = parseFloat(normalizedAmount.toFixed(precision)).toString();

  // Prefer provided unit, otherwise fall back to Spoonacular measure metadata.
  const resolvedUnit = unit
    ? unit.trim()
    : measures?.us?.unitShort || measures?.metric?.unitShort || "";

  return `${formatted}${resolvedUnit ? ` ${resolvedUnit}` : ""}`.trim();
};

// Date Formatter
export const formatDate = (dateString) => {
  if (!dateString) return "Recent";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Recent";
  }

  return date.toLocaleString();
};

// Very small sanitizer to display API-provided HTML as safe text.
// This trades rich formatting for safety without adding dependencies.
export const stripHtmlTags = (html) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return doc.body.textContent || "";
};
