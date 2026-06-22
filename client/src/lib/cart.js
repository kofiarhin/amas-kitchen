import businessConfig from "../../../shared/businessConfig.json";

export const initialCart = { version: 1, lines: [] };

const createLineId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

export function cartReducer(state, action) {
  if (action.type === "hydrate") return action.cart?.version === 1 ? action.cart : initialCart;
  if (action.type === "add") return { ...state, lines: [...state.lines, { lineId: createLineId(), item: action.item, quantity: action.quantity, addons: action.addons }] };
  if (action.type === "remove") return { ...state, lines: state.lines.filter((line) => line.lineId !== action.lineId) };
  if (action.type === "clear") return initialCart;
  return state;
}

export const lineTotal = (line) => (line.item.basePrice + line.addons.reduce((sum, addon) => sum + addon.price, 0)) * line.quantity;
export const cartSubtotal = (cart) => cart.lines.reduce((sum, line) => sum + lineTotal(line), 0);
export const formatMoney = (minorUnits) => new Intl.NumberFormat(businessConfig.locale, { style: "currency", currency: businessConfig.currency }).format(minorUnits / 100);
