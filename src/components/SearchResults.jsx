import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

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
        const response = await fetch(
          `http://localhost:5000/api/search/details/${id}`
        );

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
    <div>
      <h2 className="text-lg font-medium mb-2">Results</h2>
      <div className="grid gap-2">
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
