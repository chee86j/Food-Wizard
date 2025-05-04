import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";

function App() {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    // TODO: Replace with actual API call
    console.log("Searching:", query);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 text-center">
        <h1 className="text-2xl font-bold">Food Wizard</h1>
      </header>
      <SearchBar onSearch={handleSearch} />
      <SearchResults results={results} />
    </div>
  );
}

export default App;
