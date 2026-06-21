import { describe, expect, test } from "vitest";
import { cartReducer, cartSubtotal, initialCart } from "./cart";

const dish = { _id: "dish-1", name: "Smoky Jollof", basePrice: 1200 };
const addons = [{ _id: "addon-1", name: "Chicken", price: 300 }];

describe("cart", () => {
  test("keeps separately configured lines and calculates integer totals", () => {
    let state = cartReducer(initialCart, { type: "add", item: dish, quantity: 2, addons });
    state = cartReducer(state, { type: "add", item: dish, quantity: 1, addons: [] });
    expect(state.lines).toHaveLength(2);
    expect(cartSubtotal(state)).toBe(4200);
  });

  test("removes a line", () => {
    const added = cartReducer(initialCart, { type: "add", item: dish, quantity: 1, addons });
    expect(cartReducer(added, { type: "remove", lineId: added.lines[0].lineId }).lines).toEqual([]);
  });
});
