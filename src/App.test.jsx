import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, jest, beforeEach } from "./testUtils";
import App from "./App";

// Mock the child components to isolate App testing
jest.mock(
  "./components/SearchBar",
  () =>
    ({ onSearch, isSearching, initialValue }) =>
      (
        <div data-testid="mock-search-bar">
          <button
            onClick={() => onSearch("apple")}
            data-testid="trigger-search"
          >
            Search
          </button>
          <div>{isSearching ? "Loading" : "Not Loading"}</div>
          <div>Initial: {initialValue}</div>
        </div>
      )
);

jest.mock("./components/SearchResults", () => ({ results }) => (
  <div data-testid="mock-search-results">Results: {results.length}</div>
));

jest.mock("./components/SearchHistory", () => ({ onSelectQuery }) => (
  <div data-testid="mock-search-history">
    <button onClick={() => onSelectQuery("banana")} data-testid="history-item">
      History Item
    </button>
  </div>
));

jest.mock(
  "./components/RecipeResults",
  () =>
    ({ recipes, isLoading, onRecipeClick }) =>
      (
        <div data-testid="mock-recipe-results">
          <div>Recipes: {recipes.length}</div>
          <div>{isLoading ? "Loading Recipes" : "Recipes Loaded"}</div>
          <button onClick={() => onRecipeClick(123)} data-testid="recipe-item">
            Recipe Item
          </button>
        </div>
      )
);

jest.mock("./components/RecipeDetail", () => ({ recipeId, onClose }) => (
  <div data-testid="mock-recipe-detail">
    <div>Recipe ID: {recipeId}</div>
    <button onClick={onClose} data-testid="close-recipe">
      Close
    </button>
  </div>
));

// Mock fetch for API calls
global.fetch = jest.fn();

describe("App Component", () => {
  const mockSearchResponse = [{ id: 1, name: "Apple" }];
  const mockRecipesResponse = [{ id: 123, title: "Apple Pie" }];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup fetch mocks
    global.fetch.mockImplementation((url) => {
      if (url.includes("/api/search")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse),
        });
      }
      if (url.includes("/api/recipes/by-ingredient")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRecipesResponse),
        });
      }
      return Promise.reject(new Error("Not Found"));
    });
  });

  test("renders main components on initial load", () => {
    render(<App />);

    // Check if header is rendered
    expect(screen.getByText("Food Wizard")).toBeInTheDocument();

    // Check if main components are rendered
    expect(screen.getByTestId("mock-search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-search-history")).toBeInTheDocument();
  });

  test("handles search flow - search, show results, and recipes", async () => {
    render(<App />);

    // Trigger search
    const searchButton = screen.getByTestId("trigger-search");
    await userEvent.click(searchButton);

    // Wait for API calls to complete
    await waitFor(() => {
      // Should show search results
      expect(screen.getByTestId("mock-search-results")).toBeInTheDocument();

      // Should have made API calls
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/search?query=apple"
      );
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/recipes/by-ingredient/apple"
      );

      // Should display recipe results
      expect(screen.getByTestId("mock-recipe-results")).toBeInTheDocument();
    });
  });

  test("handles recipe detail flow - open and close recipe detail", async () => {
    render(<App />);

    // Trigger search to show recipes
    const searchButton = screen.getByTestId("trigger-search");
    await userEvent.click(searchButton);

    // Wait for API calls to complete
    await waitFor(() => {
      expect(screen.getByTestId("mock-recipe-results")).toBeInTheDocument();
    });

    // Click on a recipe to show detail
    const recipeItem = screen.getByTestId("recipe-item");
    await userEvent.click(recipeItem);

    // Recipe detail should be shown
    expect(screen.getByTestId("mock-recipe-detail")).toBeInTheDocument();
    expect(screen.getByText("Recipe ID: 123")).toBeInTheDocument();

    // Close recipe detail
    const closeButton = screen.getByTestId("close-recipe");
    await userEvent.click(closeButton);

    // Recipe detail should be closed
    expect(screen.queryByTestId("mock-recipe-detail")).not.toBeInTheDocument();
  });

  test("handles history item selection", async () => {
    render(<App />);

    // Click on a history item
    const historyItem = screen.getByTestId("history-item");
    await userEvent.click(historyItem);

    // Should trigger a search with the history item's query
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/search?query=banana"
      );
    });
  });

  test("handles API error gracefully", async () => {
    // Mock fetch to return an error
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<App />);

    // Trigger search
    const searchButton = screen.getByTestId("trigger-search");
    await userEvent.click(searchButton);

    // Should show error message
    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch search results/i)
      ).toBeInTheDocument();
    });
  });
});
