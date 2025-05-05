import { useState } from "react";
const SearchBar = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    await onSearch(query);
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Searching..."
          className="flex-1 px-3 py-2 border"
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="px-4 py-2 bg-blue-500 text-white disabled:bg-gray-300"
        >
          {isSearching ? "..." : "Search"}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
