import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import SearchHistory from "./components/SearchHistory";
import RecipeResults from "./components/RecipeResults";
import RecipeDetail from "./components/RecipeDetail";

function App() {
  const [results, setResults] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecipes, setShowRecipes] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const handleSearch = async (query) => {
    setSearchQuery(query);
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

      // Automatically fetch recipes when a search is performed
      fetchRecipes(query);
      // Automatically show recipes section
      setShowRecipes(true);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch Search Results. Try Again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipes = async (ingredient) => {
    if (!ingredient) return;

    setIsLoadingRecipes(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes/by-ingredient/${encodeURIComponent(
          ingredient
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to Fetch Recipes");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      console.error("Recipe Fetching Resulted in Error:", err);
      setRecipes([]);
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  // Handler History Product Selection & Future Search When Selected
  const handleSelectHistoryItem = (query) => {
    setSearchQuery(query);
    handleSearch(query);
    // Note: No need to add fetchRecipes here as handleSearch now does this
  };

  // Toggle to Expand Recipes
  const toggleRecipes = () => {
    setShowRecipes((prev) => !prev);
  };

  // Handle Recipe Click
  const handleRecipeClick = (recipeId) => {
    setSelectedRecipeId(recipeId);
  };

  // Close Recipe Detail Modal
  const handleCloseRecipeDetail = () => {
    setSelectedRecipeId(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="p-3 border-b">
        <h1 className="text-3xl font-bold">Food Wizard</h1>
        <p className="text-sm text-gray-600">
          Find your Lowest Calorie Options
        </p>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        <SearchBar
          onSearch={handleSearch}
          isSearching={isLoading}
          initialValue={searchQuery}
        />

        {error && <div className="p-2 mb-3 text-red-500">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {isLoading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : (
              <>
                <SearchResults results={results} />

                {/* Toggle to Expand Recipes if Query Exists*/}
                {searchQuery && (
                  <div className="mt-4">
                    <button
                      onClick={toggleRecipes}
                      className="px-4 py-2 bg-blue-500 text-white disabled:bg-gray-300"
                    >
                      {showRecipes ? "Hide Recipes" : "Show Recipes"}
                    </button>

                    {showRecipes && (
                      <div className="mt-3">
                        <RecipeResults
                          recipes={recipes}
                          isLoading={isLoadingRecipes}
                          onRecipeClick={handleRecipeClick}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="md:col-span-1">
            <SearchHistory onSelectQuery={handleSelectHistoryItem} />
          </div>
        </div>
      </main>

      {selectedRecipeId && (
        <RecipeDetail
          recipeId={selectedRecipeId}
          onClose={handleCloseRecipeDetail}
        />
      )}
    </div>
  );
}

export default App;
