import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Flame } from "lucide-react";
import { API_BASE } from "../utils/api"; // Centralized API base URL

/**
 * SearchResults component displaying search results
 */
const SearchResults = ({ results }) => {
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [nutritionData, setNutritionData] = useState({});
  const [loadingIds, setLoadingIds] = useState([]);

  // Reset expanded state when results change
  useEffect(() => {
    setExpandedCardId(null);
    setNutritionData({});
  }, [results]);

  // Toggle Card Expansion
  const handleToggleExpand = async (id) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
      return;
    }

    setExpandedCardId(id);

    if (!nutritionData[id]) {
      setLoadingIds((prev) => [...prev, id]);

      try {
        // Use centralized API base to avoid hard-coded localhost
        const response = await fetch(`${API_BASE}/api/search/details/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch nutrition data");
        }

        const data = await response.json();
        setNutritionData((prev) => ({
          ...prev,
          [id]: data,
        }));
      } catch (error) {
        console.error("Error fetching nutrition data:", error);
      } finally {
        setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
      }
    }
  };

  if (!results?.length) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center mb-3">
        <h2 className="text-lg font-medium">Lowest Calorie Options</h2>
        <div className="flex items-center ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          <Flame size={14} className="mr-1" />
          <span>Lowest Calories</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        Showing the 3 Least Calorie-dense Foods that Match Your Search
      </p>
      <div className="grid gap-3">
        {results.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            isExpanded={expandedCardId === item.id}
            onToggleExpand={handleToggleExpand}
            nutritionData={nutritionData[item.id]}
            isLoading={loadingIds.includes(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
