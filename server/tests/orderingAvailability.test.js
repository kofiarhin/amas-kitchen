const {
  getOrderingAvailability,
  isSundayInLondon,
} = require("../services/orderingAvailability");

describe("ordering availability", () => {
  test("detects Sunday using Europe/London time", () => {
    expect(isSundayInLondon(new Date("2026-06-21T08:00:00Z"))).toBe(true);
    expect(isSundayInLondon(new Date("2026-06-22T08:00:00Z"))).toBe(false);
  });

  test("Sunday closure overrides enabled settings", () => {
    expect(
      getOrderingAvailability(
        { orderingEnabled: true, closureReason: "" },
        new Date("2026-06-21T08:00:00Z"),
      ),
    ).toEqual({
      canOrder: false,
      reason: "Ama's Kitchen is closed on Sundays.",
      code: "SUNDAY_CLOSED",
    });
  });

  test("returns the manual closure reason on other days", () => {
    expect(
      getOrderingAvailability(
        { orderingEnabled: false, closureReason: "Kitchen maintenance" },
        new Date("2026-06-22T08:00:00Z"),
      ),
    ).toEqual({
      canOrder: false,
      reason: "Kitchen maintenance",
      code: "ORDERING_DISABLED",
    });
  });
});
