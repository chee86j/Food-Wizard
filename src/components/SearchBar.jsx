import { useState, useEffect } from "react";
import { Search, X, Loader } from "lucide-react";

const SearchBar = ({ onSearch, isSearching, initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);

  // Update Search Query when IOnitialValue changes
  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    await onSearch(query);
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Ingredients..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            disabled={isSearching}
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => setQuery("")}
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-md disabled:bg-gray-300 transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {isSearching ? (
            <span className="flex items-center justify-center">
              <Loader size={18} className="animate-spin mr-2" />
              <span>Searching...</span>
            </span>
          ) : (
            <span className="flex items-center">
              <Search size={18} className="mr-2" />
              <span>Search</span>
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
