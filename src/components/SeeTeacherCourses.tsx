"use client";
import { useState } from "react";
import { useMountTransition } from "@/hooks/useMountTransition";

import Modal from "./Modal";
import RenderList from "./RenderList";
import Image from "next/image";

export default function SeeTeacherCourses({ courses }: { courses: Course[] }) {
  const [show, setShow] = useState(false);
  const hasTransitionedIn = useMountTransition(show);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        type="button"
        className="text-center py-2 text-sm rounded-md border border-border hover:bg-input transition"
      >
        مشاهده دوره ها
      </button>

      {(show || hasTransitionedIn) && (
        <Modal
          title="دورهای استاد"
          show={show && hasTransitionedIn}
          onHide={() => setShow(false)}
        >
          <RenderList items={courses} alternative="مدرس دوره ایی ثبت نکرده است">
            <ul className="space-y-4 max-h-64 overflow-y-auto">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="flex-align-center gap-x-3 border border-border rounded-lg p-3"
                >
                  <div className="relative w-20 h-16 flex-shrink-0">
                    <Image
                      src={course.cover.url}
                      alt={course.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <span className="text-sm font-medium">{course.title}</span>
                </li>
              ))}
            </ul>
          </RenderList>
        </Modal>
      )}
    </>
  );
}
