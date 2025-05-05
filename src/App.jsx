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
    <div className="min-h-screen bg-white">
      <header className="p-3 border-b">
        <h1 className="text-3xl font-bold">Food Wizard</h1>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        <SearchBar onSearch={handleSearch} isSearching={isLoading} />

        {error && <div className="p-2 mb-3 text-red-500">{error}</div>}

        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <SearchResults results={results} />
        )}
      </main>
    </div>
  );
}

export default App;
