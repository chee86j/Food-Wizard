import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, jest, beforeEach } from "../testUtils";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders input field and search button", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    // Check if input field exists
    const searchInput = screen.getByPlaceholderText("Enter Ingredients...");
    expect(searchInput).toBeInTheDocument();

    // Check if search button exists
    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  test("shows loading state when isSearching is true", () => {
    render(<SearchBar onSearch={mockOnSearch} isSearching={true} />);

    // Check for loading indicator
    const loadingIndicator = screen.getByText(/searching/i);
    expect(loadingIndicator).toBeInTheDocument();

    // Button should be disabled during search
    const searchButton = screen.getByRole("button");
    expect(searchButton).toBeDisabled();
  });

  test("calls onSearch when form is submitted", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    // Type in the input field
    const searchInput = screen.getByPlaceholderText("Enter Ingredients...");
    await user.type(searchInput, "apple");

    // Submit the form
    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    // Check if onSearch was called with the correct query
    expect(mockOnSearch).toHaveBeenCalledWith("apple");
  });

  test("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    // Type in the input field
    const searchInput = screen.getByPlaceholderText("Enter Ingredients...");
    await user.type(searchInput, "apple");

    // Clear button should be visible after typing
    const clearButton = screen.getByRole("button", { name: "" });
    await user.click(clearButton);

    // Input should be cleared
    expect(searchInput.value).toBe("");
  });

  test("initializes with initialValue when provided", () => {
    render(<SearchBar onSearch={mockOnSearch} initialValue="banana" />);

    // Input should have the initial value
    const searchInput = screen.getByPlaceholderText("Enter Ingredients...");
    expect(searchInput.value).toBe("banana");
  });
});
