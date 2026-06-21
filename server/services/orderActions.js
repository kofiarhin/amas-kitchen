const AppError = require("../utils/AppError");

const transitions = Object.freeze({
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Preparing", "Cancelled"],
  Preparing: ["Ready", "Cancelled"],
  Ready: ["Out For Delivery"],
  "Out For Delivery": ["Delivered", "Delivery Failed"],
  Delivered: [], Cancelled: [], "Delivery Failed": [],
});

const getAllowedTransitions = (status) => transitions[status] || [];
function assertTransitionAllowed(current, next) {
  if (!getAllowedTransitions(current).includes(next)) throw new AppError(`Order cannot move from ${current} to ${next}.`, 409, "INVALID_STATUS_TRANSITION");
}
function assertPaymentAllowed(status) {
  if (["Cancelled", "Delivery Failed"].includes(status)) throw new AppError(`${status} orders cannot be marked paid.`, 409, "PAYMENT_NOT_ALLOWED");
}

module.exports = { assertPaymentAllowed, assertTransitionAllowed, getAllowedTransitions };
