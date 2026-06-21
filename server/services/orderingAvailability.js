const SUNDAY_MESSAGE = "Ama's Kitchen is closed on Sundays.";

function isSundayInLondon(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
  }).format(date) === "Sunday";
}

function getOrderingAvailability(settings, date = new Date()) {
  if (isSundayInLondon(date)) {
    return { canOrder: false, reason: SUNDAY_MESSAGE, code: "SUNDAY_CLOSED" };
  }

  if (!settings?.orderingEnabled) {
    return {
      canOrder: false,
      reason: settings?.closureReason || "Ordering is temporarily unavailable.",
      code: "ORDERING_DISABLED",
    };
  }

  return { canOrder: true, reason: null, code: "ORDERING_OPEN" };
}

module.exports = { getOrderingAvailability, isSundayInLondon };
