"use client";

import { useAuth } from "@/context/AuthProvider";

import UserDetailsForm from "./UserDetailsForm";
import VerifyOtp from "./VerifyOtp";
import PhoneInput from "./PhoneInput";

export default function AuthStepForm() {
  const { showOtp, isNewUser } = useAuth();
  return isNewUser ? <UserDetailsForm /> : showOtp ? <VerifyOtp /> : <PhoneInput />;
}
