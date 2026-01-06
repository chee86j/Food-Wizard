import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, jest, beforeEach } from "../testUtils";
import SearchHistory from "./SearchHistory";

// Mock fetch for history API calls.
global.fetch = jest.fn();

describe("SearchHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("uses created_at when timestamp is missing", async () => {
    // Provide history data with only created_at.
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          query: "apple",
          results: [],
          created_at: "2025-01-01T00:00:00.000Z",
        },
      ],
    });

    render(<SearchHistory onSelectQuery={() => {}} refreshKey={0} />);

    // Ensure the search entry renders.
    await waitFor(() => {
      expect(screen.getByText("apple")).toBeInTheDocument();
    });

    // "Recent" should not render when a valid timestamp exists.
    expect(screen.queryByText("Recent")).not.toBeInTheDocument();
  });

  test("re-fetches when refreshKey changes", async () => {
    // Two fetch responses for the initial render and rerender.
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    const { rerender } = render(
      <SearchHistory onSelectQuery={() => {}} refreshKey={0} />
    );

    // First call happens on mount.
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Second call happens when refreshKey changes.
    rerender(<SearchHistory onSelectQuery={() => {}} refreshKey={1} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
