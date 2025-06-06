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
