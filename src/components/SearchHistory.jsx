import { useState, useEffect } from "react";
import { History, Tag, Clock, AlertCircle, Loader } from "lucide-react";

// Format Date for Search History
const formatDate = (dateString) => {
  if (!dateString) return "Recent";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Recent";
  }

  return date.toLocaleString();
};

const SearchHistory = ({ onSelectQuery }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/search/history");

      if (!response.ok) {
        throw new Error("Failed to fetch search history");
      }

      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("History fetch error:", err);
      setError("Failed to load search history");
    } finally {
      setIsLoading(false);
    }
  };

  // Load History when Component Mounts
  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const handleSelectQuery = (query) => {
    if (onSelectQuery) {
      onSelectQuery(query);
    }
  };

  const doesItHaveARecipe = (query) => {
    return query.startsWith("recipe:");
  };

  const cleanUpQueryText = (query) => {
    if (doesItHaveARecipe(query)) {
      return query.replace("recipe:", "");
    }
    return query;
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-medium mb-3 flex items-center">
          <History size={18} className="mr-2" />
          Recent Searches
        </h2>
        <div className="space-y-2 flex justify-center items-center p-4">
          <Loader size={20} className="animate-spin mr-2" />
          <span>Loading Search History...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-red-500 bg-red-50 rounded border border-red-200 flex items-center">
        <AlertCircle size={18} className="mr-2" />
        {error}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-3 text-gray-500 bg-gray-50 rounded border border-gray-200 flex items-center">
        <History size={18} className="mr-2" />
        No Recent Searches Available
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-3 flex items-center">
        <History size={18} className="mr-2" />
        Recent Searches
      </h2>
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded cursor-pointer hover:bg-blue-50 transition-all duration-200 ${
              doesItHaveARecipe(item.query)
                ? "bg-green-50 border border-green-100"
                : "bg-gray-50 border border-gray-100"
            }`}
            onClick={() => handleSelectQuery(cleanUpQueryText(item.query))}
          >
            <div className="font-medium">{cleanUpQueryText(item.query)}</div>
            <div className="flex justify-between mt-1">
              <div className="text-xs text-gray-500 flex items-center">
                <Clock size={12} className="mr-1" />
                {formatDate(item.timestamp)}
              </div>
              {doesItHaveARecipe(item.query) && (
                <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                  <Tag size={10} className="mr-1" />
                  Recipe
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
