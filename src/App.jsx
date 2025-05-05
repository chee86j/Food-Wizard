import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch Search Results. Try Again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 text-center">
        <h1 className="text-2xl font-bold">Food Wizard</h1>
      </header>
      <SearchBar onSearch={handleSearch} isSearching={isLoading} />
      {error && <div className="p-4 text-red-500 text-center">{error}</div>}
      {isLoading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        <SearchResults results={results} />
      )}
    </div>
  );
}

export default App;
