import "server-only";

import { connectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import "@/lib/models/Category";
import "@/lib/models/Teacher";
import "@/lib/models/Course";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export async function getUser(): Promise<User | undefined> {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    await connectDB();
    const user = await User.findOne(
      { phone: session?.userPhone },
      "-createdAt -updatedAt -__v"
    ).populate({ path: "cart", populate: ["teacher", "category"] });

    return user;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
