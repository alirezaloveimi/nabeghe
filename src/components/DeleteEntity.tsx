"use client";

import { IoTrash } from "react-icons/io5";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { useState } from "react";
import { useMountTransition } from "@/hooks/useMountTransition";
import { useRouter } from "next/navigation";
import { IoMdInformationCircle } from "react-icons/io";

type DeleteEntityProps = {
  id: string;
  label: string;
  action: (id: string) => Promise<{ message: string; success: boolean }>;
};

export default function DeleteEntity({ action, id, label }: DeleteEntityProps) {
  const [show, setShow] = useState(false);
  const hasTransitionedIn = useMountTransition(show);
  const { refresh } = useRouter();

  const onDelete = async () => {
    const { message, success } = await action(id);

    if (!success) {
      toast.error(message);
      return;
    }

    toast.success(message, {
      onClose() {
        setShow(false);
        refresh();
      },
    });
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="p-2 rounded-md border border-border hover:bg-input transition"
      >
        <IoTrash className="text-red-600 text-lg" />
      </button>

      {(show || hasTransitionedIn) && (
        <Modal show={show && hasTransitionedIn} onHide={() => setShow(false)}>
          <div className="flex-align-center flex-col gap-3">
            <span className="text-8xl text-primary">
              <IoMdInformationCircle />
            </span>

            <p className="text-center text-sm font-bold">{label}</p>
          </div>

          <div className="mt-5 flex-align-center gap-x-2 [&>*]:flex-1">
            <button
              className="py-2.5 rounded-xl transition-all bg-red-700 hover:bg-red-600 text-white"
              type="button"
              onClick={() => setShow(false)}
            >
              خیر
            </button>

            <button
              onClick={onDelete}
              className="w-full py-2.5 rounded-xl transition-all bg-green-700 hover:bg-green-600 text-white"
            >
              بله
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
