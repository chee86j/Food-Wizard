import { useState } from "react";

const SearchBar = ({ onSearch, isSearching }) => {
  // State vars to manage search query
  const [query, setQuery] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    await onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Searching Ingredients and Recipes..."
        className="flex-1 px-3 py-2 rounded border"
        disabled={isSearching}
      />
      <button
        type="submit"
        disabled={isSearching}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isSearching ? "..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
