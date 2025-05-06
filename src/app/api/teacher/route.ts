import { connectDB } from "@/lib/config/db";
import Teacher from "@/lib/models/Teacher";
import { Role } from "@/lib/models/User";
import { getUser } from "@/util/user";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await getUser();

    if (!user || (user && user.role !== Role.ADMIN)) {
      return NextResponse.json(
        { error: "اجازه دسترسی وجود ندارد" },
        { status: 403 }
      );
    }

    await connectDB();
    const teachers = await Teacher.find({}, "name about title image");
    return NextResponse.json(teachers, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "مشکلی سمت سرور" });
  }
};
