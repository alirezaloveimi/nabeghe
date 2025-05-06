import { calculatePrice, priceWithDots } from "@/util/price";

type PriceContentProps = {
  price: number;
  discount: number;
};

export default function PriceContent({ discount, price }: PriceContentProps) {
  const { isFree, hasDiscount, finalPrice } = calculatePrice(price, discount);

  let content;

  if (isFree) {
    content = <span className="text-green-500 text-lg font-bold">رایگان</span>;
  } else if (hasDiscount) {
    content = (
      <>
        <span className="line-through text-gray-500">
          {priceWithDots(price)} تومان
        </span>
        <span className="text-green-500 font-bold text-lg">
          {finalPrice === 0 ? "رایگان" : priceWithDots(finalPrice) + " تومان"}
        </span>
      </>
    );
  } else {
    content = (
      <span className="text-lg font-bold">{priceWithDots(price)} تومان</span>
    );
  }

  return (
    <div className="flex flex-col items-end justify-center h-14">{content}</div>
  );
}
