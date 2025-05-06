import Logo from "./Logo";
import BulletLabel from "./BulletLabel";

import { websiteInfos, usefulLinks } from "@/data";
import GoTop from "./GoTop";

export default function Footer() {
  return (
    <footer className="pt-20">
      <div className="container">
        <div className="flex-align-center gap-x-3">
          <div className="flex-grow border-t border-border border-dashed"></div>
          <GoTop />
        </div>

        <div className="flex lg:flex-nowrap flex-wrap gap-8 py-10">
          <div className="md:w-5/12 w-full">
            <Logo />
          </div>

          <div className="md:w-7/12 w-full">
            <div className="flex-align-center gap-10">
              {websiteInfos.map((item) => (
                <div key={item.id} className="flex-align-center gap-x-5">
                  <span className="grid-center size-10 bg-secondary rounded-full text-muted text-lg">
                    {item.icon}
                  </span>

                  <div className="font-black space-y-2 text-sm">
                    <p className="text-primary">{item.label}</p>
                    <p className="text-foreground">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex md:flex-nowrap flex-wrap gap-8">
          <div className="md:w-5/12 w-full">
            <div className="bg-secondary rounded-3xl space-y-5 p-8">
              <BulletLabel label="درباره ما" />

              <p className="font-bold text-sm text-muted leading-6 text-justify">
                نابغه یکی از پرتلاش‌ترین و بروزترین وبسایت های آموزشی در سطح
                ایران است که همیشه تلاش کرده تا بتواند جدیدترین و بروزترین
                مقالات و دوره‌های آموزشی را در اختیار علاقه‌مندان ایرانی قرار
                دهد. تبدیل کردن برنامه نویسان ایرانی به بهترین برنامه نویسان
                جهان هدف ماست.
              </p>
            </div>
          </div>

          <div className="md:w-7/12 w-full">
            <div className="sm:col-span-2 space-y-5">
              <BulletLabel label="لینک های مفید" />

              <ul className="flex flex-col space-y-2">
                {usefulLinks.map((item) => (
                  <li
                    key={item.id}
                    className="font-bold text-sm text-muted hover:text-primary"
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex-align-center gap-3 py-5">
          <p className="text-xs text-muted">© کليه حقوق محفوظ است</p>
          <div className="flex-grow border-t border-border border-dashed"></div>
        </div>
      </div>
    </footer>
  );
}
