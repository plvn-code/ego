const uah = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });

export function formatPrice(value: number) {
  return `${uah.format(value)} ₴`;
}

export function pluralItems(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} товар`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} товари`;
  return `${n} товарів`;
}
