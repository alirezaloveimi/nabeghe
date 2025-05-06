import { connectDB } from "@/lib/config/db";
import Category from "@/lib/models/Category";
import { Role } from "@/lib/models/User";
import { createCategorySchema } from "@/lib/validation/category";
import { getUser } from "@/util/user";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const result = createCategorySchema.safeParse(body);

  if (!result.success) {
    const error = result.error.flatten().fieldErrors;
    return NextResponse.json(error, { status: 400 });
  }

  try {
    const user = await getUser();

    if (!user || (user && user.role !== Role.ADMIN)) {
      return NextResponse.json(
        { error: "اجازه دسترسی وجود ندارد" },
        { status: 403 }
      );
    }

    const { title, name } = result.data;
    await connectDB();
    await Category.create({ title, name });
    return NextResponse.json(
      { message: "دسته بندی شما با موفقیت اضافه شد" },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "مشکل سمت سرور" }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    await connectDB();
    const categories = await Category.find({}, "title name");
    return NextResponse.json(categories, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "مشکلی سمت سرور" });
  }
};
