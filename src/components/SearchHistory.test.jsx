import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, jest, beforeEach } from "../testUtils";
import SearchHistory from "./SearchHistory";

global.fetch = jest.fn();

describe("SearchHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("uses created_at when timestamp is missing", async () => {
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

    await waitFor(() => {
      expect(screen.getByText("apple")).toBeInTheDocument();
    });

    expect(screen.queryByText("Recent")).not.toBeInTheDocument();
  });

  test("re-fetches when refreshKey changes", async () => {
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

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    rerender(<SearchHistory onSelectQuery={() => {}} refreshKey={1} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});

