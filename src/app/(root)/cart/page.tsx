import Button from "@/components/Button";
import PriceContent from "@/components/PriceContent";
import SectionLabel from "@/components/SectionLabel";
import RemoveFromCartBtn from "@/components/RemoveFromCartBtn";
import BulletLabel from "@/components/BulletLabel";

import { getUser } from "@/util/user";
import { RiArrowLeftUpLine } from "react-icons/ri";
import Image from "next/image";
import RegisterUserInCourseBtn from "@/components/RegisterUserInCourseBtn";

type CartItemProps = {
  course: Course;
  userId: string;
};

export default async function CartPage() {
  const user = await getUser();
  const cart = user?.cart || [];

  const totalPrice = cart.reduce((sum, course) => sum + course.price, 0);
  const totalDiscount = cart.reduce(
    (sum, course) => sum + (course.price * course.discount) / 100,
    0
  );

  const finalPrice = totalPrice - totalDiscount;
  const hasCartItems = cart.length > 0;

  return (
    <div className="flex flex-wrap md:flex-nowrap items-start gap-5">
      <section className={hasCartItems ? "w-full md:w-8/12" : "w-full"}>
        <CartHeader cartCount={cart.length} />

        <div>
          {hasCartItems ? (
            cart.map((course) => (
              <CartItem
                key={course._id}
                userId={user?._id as string}
                course={course}
              />
            ))
          ) : (
            <EmptyCart />
          )}
        </div>
      </section>

      {hasCartItems && user && (
        <aside className="w-full md:w-4/12 md:sticky md:top-24">
          <PaymentSummary
            totalPrice={totalPrice}
            wallet={user.wallet}
            totalDiscount={totalDiscount}
            finalPrice={finalPrice}
          />

          <RegisterUserInCourseBtn
            userId={`${user._id}`}
            cartPrice={finalPrice}
          />
        </aside>
      )}
    </div>
  );
}

function CartHeader({ cartCount }: { cartCount: number }) {
  return (
    <div className="flex-between-center gap-8 bg-gradient-to-l from-secondary to-background rounded-2xl p-5">
      <SectionLabel
        title="سبد خرید شما"
        text={`${cartCount} دوره به سبد اضافه کرده اید`}
      />
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="grid-center p-5">
      <Image
        width={500}
        height={500}
        quality={100}
        alt="empty cart"
        src="/images/empty-cart.png"
      />
      <p className="text-center md:text-lg my-6 md:my-8">
        سبد خرید شما خالی است برای مشاهده لیست دوره ها کلیک کنید
      </p>
      <div className="flex justify-center">
        <Button width={200} isLink href="/courses">
          لیست دوره ها
        </Button>
      </div>
    </div>
  );
}

function PaymentSummary({
  totalPrice,
  wallet,
  totalDiscount,
  finalPrice,
}: {
  totalPrice: number;
  wallet: number;
  totalDiscount: number;
  finalPrice: number;
}) {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-b from-secondary to-background rounded-2xl px-5 pb-5">
        <div className="bg-background rounded-b-3xl space-y-2 p-5 mb-5">
          <BulletLabel label="اطلاعات پرداخت" />
        </div>

        <div className="space-y-5">
          <SummaryRow label="جمع کل" value={totalPrice} />
          <SummaryRow label="موجودی کیف پول" value={wallet} />
          <SummaryRow label="تخفیف" value={totalDiscount} isDiscount />
          <div className="h-px bg-secondary" />
          <SummaryRow label="مبلغ قابل پرداخت" value={finalPrice} isFinal />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  isDiscount = false,
  isFinal = false,
}: {
  label: string;
  value: number;
  isDiscount?: boolean;
  isFinal?: boolean;
}) {
  const valueClass = isDiscount
    ? "text-red-600"
    : isFinal
    ? "text-green-600 text-xl"
    : "text-foreground";

  const labelClass = isDiscount
    ? "text-red-600 font-bold text-xs"
    : isFinal
    ? "text-green-600 font-bold text-sm"
    : "text-foreground font-bold text-xs";

  return (
    <div className="flex-between-center">
      <div className={labelClass}>{label}</div>
      <div className="flex items-center gap-2">
        <span className={`font-black ${valueClass}`}>
          {value.toLocaleString()}
        </span>
        <span className="text-xs text-muted">تومان</span>
      </div>
    </div>
  );
}

function CartItem({ course, userId }: CartItemProps) {
  const { price, discount, cover, teacher, title, _id } = course;

  return (
    <div className="flex flex-wrap items-start gap-8 relative py-6 sm:flex-nowrap">
      <div className="w-full sm:w-4/12 relative z-10">
        <Image
          width={500}
          height={500}
          quality={100}
          src={cover.url}
          alt={title}
          className="max-w-full rounded-3xl"
        />

        <RemoveFromCartBtn courseId={`${_id}`} userId={`${userId}`} />
      </div>

      <div className="w-full sm:w-8/12">
        <div className="bg-gradient-to-b from-secondary to-background rounded-3xl">
          <div className="bg-background rounded-b-3xl space-y-2 p-5 mx-5">
            <h2 className="font-bold text-sm">{course.title}</h2>
          </div>

          <div className="space-y-3 p-5">
            <div className="flex-between-center">
              <div className="flex-align-center gap-x-3">
                <Image
                  width={50}
                  height={50}
                  src={teacher.image.url}
                  className="object-cover rounded-full"
                  alt={teacher.name}
                />

                <div className="space-y-1 text-xs">
                  <p className="text-muted">مدرس دوره :</p>
                  <p className="font-bold text-foreground">{teacher.title}</p>
                </div>
              </div>

              <PriceContent price={price} discount={discount} />
            </div>

            <Button
              href={`/courses/${_id}`}
              isLink
              icon={<RiArrowLeftUpLine className="text-xl" />}
            >
              مشاهده دوره
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
