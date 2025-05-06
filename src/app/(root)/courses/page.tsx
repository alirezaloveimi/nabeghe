import CourseList from "@/components/CourseList";
import FilterCourses from "@/components/FilterCourses";
import SectionLabel from "@/components/SectionLabel";
import Spinner from "@/components/Spinner";
import { Suspense } from "react";

type CoursesPageProps = {
  searchParams: Promise<{ category?: string; type?: string }>;
};

export default async function CoursesPage(props: CoursesPageProps) {
  const searchParams = await props.searchParams;
  const type = searchParams?.type || "";
  const category = searchParams?.category || "";

  return (
    <div className="space-y-12">
      <SectionLabel
        text="دوره ببین، تمرین کن، برنامه نویس شو"
        title="دوره های آموزشی"
      />

      <div className="space-y-10">
        <FilterCourses />

        <Suspense
          key={`${category}-${type}`}
          fallback={
            <div className="grid-center pt-8">
              <Spinner width={50} height={50} />
            </div>
          }
        >
          <CourseList category={category} type={type} />
        </Suspense>
      </div>

    </div>
  );
}
