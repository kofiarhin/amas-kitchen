const { assertPaymentAllowed, assertTransitionAllowed, getAllowedTransitions } = require("../services/orderActions");

describe("order actions", () => {
  test("allows only the next configured status", () => {
    expect(getAllowedTransitions("Pending")).toEqual(["Confirmed", "Cancelled"]);
    expect(() => assertTransitionAllowed("Pending", "Preparing")).toThrow(/cannot move/i);
    expect(() => assertTransitionAllowed("Delivered", "Confirmed")).toThrow(/cannot move/i);
  });

  test.each(["Cancelled", "Delivery Failed"])("blocks payment for %s orders", (status) => {
    expect(() => assertPaymentAllowed(status)).toThrow(/paid/i);
  });

  test("permits payment for delivered orders", () => expect(() => assertPaymentAllowed("Delivered")).not.toThrow());
});
