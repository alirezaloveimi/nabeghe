"use client";
import { useActionState, useState } from "react";
import { createComment, toggleCommentAccept } from "@/actions/comment";
import { toastCallback } from "@/util/toast";
import { useMountTransition } from "@/hooks/useMountTransition";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";

import { IoIosSend } from "react-icons/io";
import { IoCheckmark, IoClose, IoEye } from "react-icons/io5";

import Modal from "./Modal";
import InputField from "./InputField";
import Button from "./Button";

type CommentActionProps = {
  adminId: string;
  comment: CommentT;
};

export default function CommentAction({
  adminId,
  comment,
}: CommentActionProps) {
  const { refresh } = useRouter();

  const [showInfoModal, setShowInfoModal] = useState(false);
  const infoTransition = useMountTransition(showInfoModal);

  const [showReplayModal, setShowReplayModal] = useState(false);
  const replayTransition = useMountTransition(showReplayModal);

  const [state, action, pending] = useActionState(
    toastCallback(createComment, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        toast.success(result.message, {
          onClose() {
            setShowReplayModal(false);
            refresh();
          },
        });
      },
    }),
    undefined
  );

  const toggleAccept = async () => {
    const { message, success } = await toggleCommentAccept(
      comment._id,
      comment.isAccept
    );

    if (success) {
      toast.success(message, { onClose: () => refresh() });
      return;
    }

    toast.error(message);
  };

  return (
    <>
      <div className="flex-align-center gap-x-3">
        <button
          className="p-2 rounded-md border border-border hover:bg-input transition text-xl"
          onClick={() => setShowInfoModal(true)}
          type="button"
        >
          <IoEye />
        </button>

        <button
          onClick={toggleAccept}
          className="p-2 rounded-md border border-border hover:bg-input transition text-xl"
          type="button"
        >
          {comment.isAccept ? <IoClose /> : <IoCheckmark />}
        </button>

        <button
          onClick={() => setShowReplayModal(true)}
          className="p-2 rounded-md border border-border hover:bg-input transition text-xl"
          type="button"
        >
          <IoIosSend />
        </button>
      </div>

      {(showInfoModal || infoTransition) && (
        <Modal
          show={showInfoModal && infoTransition}
          onHide={() => setShowInfoModal(false)}
        >
          <h3 className="font-bold text-xl mb-3">
            کامنت ارسال شده : {comment.text}
          </h3>
          <p className="font-bold textxl">
            پاسخ نظر :
            {comment.replies && comment.replies.length > 0
              ? comment.replies[0].text
              : "پاسخی داده نشد"}
          </p>
        </Modal>
      )}

      {(showReplayModal || replayTransition) && (
        <Modal
          title="جواب دادن به نظر کاربر"
          show={showReplayModal && replayTransition}
          onHide={() => setShowReplayModal(false)}
        >
          <form action={action} className="space-y-3">
            <InputField
              name="text"
              error={state?.errors?.text}
              defaultValue={
                state?.inputs?.text ||
                (comment.replies && comment.replies.length > 0
                  ? comment.replies[0].text
                  : "")
              }
            />

            <input type="hidden" name="parentId" value={comment._id} />
            <input type="hidden" name="userId" value={adminId} />
            <input type="hidden" name="entityType" value={comment.entityType} />
            <input type="hidden" name="entityId" value={comment.entityId._id} />

            <Button type="submit" pending={pending}>
              ثبت پاسخ
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
