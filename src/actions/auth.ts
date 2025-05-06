"use server";

import { connectDB } from "@/lib/config/db";
import { createSession, deleteSession } from "@/lib/session";
import {
  loginSchema,
  registerSchema,
  verifyCodeSchema,
} from "@/lib/validation/auth";

import Otp from "@/lib/models/Otp";
import User, { Role } from "@/lib/models/User";
import { redirect } from "next/navigation";

async function sendOtp(
  phone: string
): Promise<{ expTime: number; message?: string } | undefined> {
  const now = Date.now();
  const expTime = now + 60_000;

  try {
    await connectDB();
    const otps = await Otp.find({ phone }).lean();
    const notExpired = otps.find((otp) => otp.expTime > now);

    if (notExpired) {
      return {
        expTime: notExpired.expTime,
        message: "کد قبلی هنوز منقضی نشده",
      };
    }

    const code = Math.floor(10000 + Math.random() * 90000);
    const otpBodyOptions = JSON.stringify({
      op: "pattern",
      user: process.env.FARAZ_SMS_USER,
      pass: process.env.FARAZ_SMS_PASSWORD,
      fromNum: "3000505",
      toNum: phone,
      patternCode: "55omy5a2fy8zjaj",
      inputData: [{ "verification-code": code }],
    });

    const sendOtpRes = await fetch("http://ippanel.com/api/select", {
      method: "POST",
      body: otpBodyOptions,
    });

    if (!sendOtpRes.ok && sendOtpRes.status !== 200) {
      const errorText = await sendOtpRes.text();

      throw new Error(
        `Failed to send OTP. Status: ${sendOtpRes.status}, Error: ${errorText}`
      );
    }

    await Otp.create({ phone, code, expTime });
    return { expTime };
  } catch (e) {
    console.log(e);
  }
}

export async function sendOtpLogin(_: unknown, formData: FormData) {
  const inputs = {
    phone: formData.get("phone") as string,
  };

  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      message: "لطفا خطاهای فرم را رفع کنید",
      errors: result.error.flatten().fieldErrors,
      inputs,
    };
  }

  const { phone } = result.data;

  try {
    await connectDB();
    const user = await User.findOne({ phone });

    if (!user) {
      return {
        message: "کاربری یافت نشد لطفا اول ثبت نام کنید",
        success: false,
        inputs,
      };
    }
    const otpResult = await sendOtp(phone);

    if (!otpResult) {
      return {
        success: false,
        message: "مشکل در ارسال کد",
        inputs,
      };
    }

    if (otpResult.expTime && otpResult.message) {
      return {
        success: true,
        message: otpResult.message,
        expTime: otpResult.expTime,
      };
    }

    return {
      success: true,
      message: "کد با موفقیت ارسال شد",
      expTime: otpResult.expTime,
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور", inputs };
  }
}

export async function sendOtpRegister(_: unknown, formData: FormData) {
  const inputs = {
    fullname: formData.get("fullname") as string,
    phone: formData.get("phone") as string,
  };

  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      message: "لطفا خطاهای فرم را رفع کنید",
      errors: result.error.flatten().fieldErrors,
      inputs,
    };
  }

  const { phone } = result.data;

  try {
    await connectDB();
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return {
        success: false,
        message: "ین شماره قبلاً ثبت شده است",
        inputs,
      };
    }

    const otpResult = await sendOtp(phone);

    if (!otpResult) {
      return {
        success: false,
        message: "مشکل در ارسال کد",
        inputs,
      };
    }

    if (otpResult.expTime && otpResult.message) {
      return {
        success: true,
        message: otpResult.message,
        expTime: otpResult.expTime,
      };
    }

    return {
      success: true,
      message: "کد با موفقیت ارسال شد",
      expTime: otpResult.expTime,
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور", inputs };
  }
}

export async function verifyCode(_: unknown, formData: FormData) {
  const result = verifyCodeSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      message: "لطفا خطاهای فرم رو رفع کنید",
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { code, info } = result.data;
  const isUserNew = typeof info !== "string";
  const phone = isUserNew ? info.phone : info;

  const now = Date.now();

  try {
    await connectDB();
    const otpRecord = await Otp.findOne({ code, phone });

    if (!otpRecord) {
      return {
        success: false,
        message: "کد مورد نظر اشتباه است",
      };
    }

    if (otpRecord.expTime < now) {
      return {
        success: false,
        message: "کد مورد نظر منقضی شده است",
      };
    }

    const user = await User.findOne({ phone });
    let role = user?.role;

    if (isUserNew) {
      const users = await User.find();
      const newRole = users.length > 0 ? Role.USER : Role.ADMIN;

      await User.create({
        fullname: info.fullname,
        role: newRole,
        phone,
      });

      role = newRole;
    }

    await createSession(phone, role);
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور" };
  }

  return { success: true, message: "با موفقیت وارد شدی" };
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
