// date format -------------------------

function formatMovementDate(date, locale) {
  const calcDaysPassed = (now, date) =>
    Math.round(Math.abs(date - now) / (1000 * 60 * 60 * 24));

  const passedDays = calcDaysPassed(new Date(), date);

  if (passedDays === 0) return 'today';
  if (passedDays === 1) return 'yesterday';
  if (passedDays <= 7) return `${passedDays} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
}

// currency format ------------------------

function formatCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}


export {formatMovementDate, formatCurrency}