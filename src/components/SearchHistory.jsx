import { useState, useEffect } from "react";
import { formatDate } from "../utils/helpers";

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

  if (isLoading) {
    return <div className="p-2">Loading history...</div>;
  }

  if (error) {
    return <div className="p-2 text-red-500">{error}</div>;
  }

  if (history.length === 0) {
    return <div className="p-2 text-gray-500">No search history available</div>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-medium mb-2">Recent Searches</h2>
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-slate-300 hover:scale-110 transition-all duration-200"
            onClick={() => handleSelectQuery(item.query)}
          >
            <div className="font-medium">{item.query}</div>
            <div className="text-xs text-gray-500">
              {formatDate(item.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
