import { formatMeasuredAmount } from "./helpers";

describe("formatMeasuredAmount", () => {
  test("formats amount with provided unit", () => {
    expect(formatMeasuredAmount(1.5, "cup")).toBe("1.5 cup");
  });

  test("falls back to measure metadata when unit missing", () => {
    const measures = { us: { unitShort: "tbsp" } };
    expect(formatMeasuredAmount(0.3333, "", measures)).toBe("0.333 tbsp");
  });

  test("handles invalid numbers gracefully", () => {
    expect(formatMeasuredAmount(undefined)).toBe("");
    expect(formatMeasuredAmount("not-a-number")).toBe("");
  });
});
