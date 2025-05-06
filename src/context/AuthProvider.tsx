"use client";

import { useState, useEffect, useContext, createContext, useMemo } from "react";

export type UserInfo = {
  fullname: string;
  phone: string;
};

type AuthContextType = {
  otp: string[];
  showOtp: boolean;
  timer: string;
  phone: string;
  isNewUser: boolean;
  userInfo: UserInfo;
  phoneInputChange: (value: string) => void;
  updateUserInfo: (name: string, value: string) => void;
  updateOtp: (newOtp: string[]) => void;
  toggleUserForm: (show: boolean) => void;
  toggleOtpSignup: (show: boolean, time?: number) => void;
  toggleOtpLogin: (show: boolean, time?: number) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const OTP_LENGTH = 5;

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [expTime, setExpTime] = useState<number>(0);

  const [showOtp, setShowOtp] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullname: "",
    phone: "",
  });

  const timer = useMemo(() => {
    if (!expTime) return "0";
    const timeLeft = expTime - Date.now();
    const min = Math.floor((timeLeft / 60 / 1000) % 60);
    const sec = Math.floor((timeLeft / 1000) % 60);
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  }, [expTime]);

  useEffect(() => {
    if (expTime - new Date().getTime() > 1000) {
      const interval = setInterval(() => setExpTime((e) => e - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [expTime]);

  const phoneInputChange = (value: string) => setPhone(value);

  const updateUserInfo = (name: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const updateOtp = (newOtp: string[]) => setOtp(newOtp);

  const toggleUserForm = (show: boolean) => {
    setIsNewUser(show);
    setPhone("");
    if (!show) {
      setUserInfo({ fullname: "", phone: "" });
    }
  };

  const toggleOtpSignup = (show: boolean, time?: number) => {
    setShowOtp(show);
    setIsNewUser(!show);
    setOtp(Array(OTP_LENGTH).fill(""));
    if (show && time) setExpTime(time);
  };

  const toggleOtpLogin = (show: boolean, time?: number) => {
    setShowOtp(show);
    setIsNewUser(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    if (show && time) setExpTime(time);
  };

  return (
    <AuthContext.Provider
      value={{
        phone,
        showOtp,
        isNewUser,
        otp,
        timer,
        userInfo,
        phoneInputChange,
        toggleOtpLogin,
        toggleOtpSignup,
        toggleUserForm,
        updateOtp,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
