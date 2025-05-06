"use client";
import { useState } from "react";
import { IoIosLogOut, IoMdInformationCircle } from "react-icons/io";

import { useMountTransition } from "@/hooks/useMountTransition";
import { logout } from "@/actions/auth";

import Modal from "./Modal";

export default function LogoutBtn() {
  const [show, setShow] = useState(false);
  const hasTransitionedIn = useMountTransition(show);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        type="button"
        className="flex-align-center gap-x-2 w-full text-red-500 transition-colors hover:text-red-700 py-2"
      >
        <IoIosLogOut className="text-xl" />
        <span className="font-bold text-xs">خروج از حساب</span>
      </button>

      {(show || hasTransitionedIn) && (
        <Modal show={show && hasTransitionedIn} onHide={() => setShow(false)}>
          <div className="flex-align-center flex-col gap-3">
            <span className="text-8xl text-primary">
              <IoMdInformationCircle />
            </span>

            <p className="text-center text-sm font-bold">
              آیا مایل به خروج از حساب کاربری خود هستید؟
            </p>
          </div>

          <div className="mt-5 flex-align-center gap-x-2 [&>*]:flex-1">
            <button
              className="py-2.5 rounded-xl transition-all bg-red-700 hover:bg-red-600 text-white"
              type="button"
              onClick={() => setShow(false)}
            >
              خیر
            </button>
            <form action={logout}>
              <button className="w-full py-2.5 rounded-xl transition-all bg-green-700 hover:bg-green-600 text-white">
                بله
              </button>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}
