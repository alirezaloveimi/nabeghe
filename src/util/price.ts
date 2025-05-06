export function calculatePrice(price: number, discount: number = 0) {
  const isFree = price === 0;
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price - (price * discount) / 100 : price;

  return { isFree, hasDiscount, finalPrice };
}

export function priceWithDots(price: number) {
  const regex = /\B(?=(\d{3})+(?!\d))/g;
  return price.toString().replace(regex, ",");
}
