import Image from "next/image";
import React from "react";

type CommentProps = {
  comment: CommentT;
  students?: User[];
};

export default function Comment({ comment, students }: CommentProps) {
  const { user, text } = comment;
  const isAdmin = user.role === "ADMIN";

  const isMember = students?.some(
    (student) => student._id.toString() === user._id.toString()
  );

  return (
    <div
      className={`border border-border rounded-3xl space-y-3 p-5 ${
        isAdmin ? "bg-primary/10 border-primary" : "bg-background"
      }`}
    >
      <div className="flex flex-wrap flex-col sm:flex-nowrap sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-border pb-3">
        <div className="flex-align-center gap-x-3">
          <Image
            width={40}
            height={40}
            src={user.image?.url || "/images/user-no-image.png"}
            alt="user-image"
            className="rounded-full"
          />

          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-sm ${
                  isAdmin ? "text-primary" : "text-foreground"
                }`}
              >
                {user.fullname}
              </span>
            </div>

            <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded-md">
              {isAdmin ? "مدیر" : isMember ? "دانشجوی دوره" : "کاربر"}
            </span>
          </div>
        </div>
      </div>

      <p className="text-muted">{text}</p>

      {comment.replies?.map((rep) => (
        <Comment key={rep._id} comment={rep} students={students} />
      ))}
    </div>
  );
}
