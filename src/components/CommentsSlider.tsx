"use client";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/autoplay";

export default function CommentsSlider({ comments }: { comments: CommentT[] }) {
  return (
    <div>
      <Swiper
        autoplay={{ delay: 5000 }}
        modules={[EffectCards, Autoplay]}
        cardsEffect={{ slideShadows: false }}
        effect="cards"
        grabCursor={true}
      >
        {comments.map((comment) => (
          <SwiperSlide key={comment._id} className="pb-8">
            <div className="flex-center flex-col bg-background border border-border rounded-2xl space-y-8 p-8 shadow-xl shadow-black/5">
              <div className="font-bold text-lg text-muted text-center break-all h-20 overflow-y-auto pl-3">
                {comment.text}
              </div>

              <div className="flex-align-center gap-x-6">
                <div className="relative size-14">
                  <Image
                    fill
                    className="rounded-full"
                    src={comment.user.image?.url || "/images/user-no-image.png"}
                    alt={comment.user.fullname}
                  />
                </div>

                <div className="space-y-1">
                  <p>{comment.user.fullname}</p>
                  <p>
                    {comment.entityId.title.length > 30
                      ? comment.entityId.title.slice(0, 30) + "..."
                      : comment.entityId.title}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
