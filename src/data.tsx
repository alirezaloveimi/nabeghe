import { BsFillClockFill, BsPersonWorkspace } from "react-icons/bs";
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaDollarSign,
  FaFire,
  FaPhone,
  FaRegComment,
  FaRegHeart,
  FaEye,
  FaBloggerB,
} from "react-icons/fa";

import { FiUsers } from "react-icons/fi";
import {
  IoChatbubbles,
  IoDocument,
  IoHomeOutline,
  IoPlayForward,
  IoVideocam,
} from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { RiPuzzle2Fill } from "react-icons/ri";
import { CommentData } from "./app/(panel)/p-admin/comments/page";
import CommentAction from "./components/CommentAction";
import { UserData } from "./components/UserTable";
import Image from "next/image";
import { priceWithDots } from "./util/price";
import Link from "next/link";

export const navItems = [
  { id: 1, title: "تمامی دوره ها", href: "/courses", icon: <PiStudent /> },
  { id: 2, title: "مقالات آموزشی", href: "/blogs", icon: <IoDocument /> },
];

export const websiteInfos = [
  { id: 1, label: "شماره تلفن", title: "021-44231519", icon: <FaPhone /> },
  {
    id: 2,
    label: "ساعت کاری",
    title: "18:00-09:00",
    icon: <BsFillClockFill />,
  },
];

export const usefulLinks = [
  { id: 1, title: "قوانین و مقررات" },
  { id: 2, title: "مدرسان" },
  { id: 3, title: "درباره نابغه" },
  { id: 4, title: "ارتباط با ما" },
];

export const mainFeatures = [
  { id: 1, title: "چالش برانگیز", icon: <RiPuzzle2Fill />, color: "#10b981" },
  { id: 2, title: "پروژه محور", icon: <FaFire />, color: "#eab308" },
  { id: 3, title: "جامع", icon: <FaBookOpen />, color: "#3b82f6" },
  { id: 4, title: "به روز", icon: <IoPlayForward />, color: "#22c55e" },
  { id: 5, title: "ویدیویی", icon: <IoVideocam />, color: "#ef4444" },
  { id: 6, title: "منتورشیپ", icon: <IoChatbubbles />, color: "#06b6d4" },
];

export const asideLinks = {
  USER: [
    { id: 1, title: "پیشخوان", href: "/p-user", icon: <IoHomeOutline /> },
    {
      id: 2,
      title: "دوره های من",
      href: "/p-user/courses",
      icon: <BsPersonWorkspace />,
    },
    {
      id: 3,
      title: "وبلاگ های مورد علاقه",
      href: "/p-user/likedblogs",
      icon: <FaRegHeart />,
    },
    {
      id: 4,
      title: "کیف پول",
      href: "/p-user/wallet",
      icon: <FaDollarSign />,
    },
    {
      id: 5,
      title: "ویرایش پروفایل",
      href: "/p-user/profile",
      icon: <MdOutlineModeEdit />,
    },
  ],

  ADMIN: [
    {
      id: 1,
      title: "پیشخوان",
      href: "/p-admin",
      icon: <IoHomeOutline />,
    },
    {
      id: 2,
      title: "کاربران",
      href: "/p-admin/users",
      icon: <FiUsers />,
    },
    {
      id: 3,
      title: "دوره ها",
      href: "/p-admin/courses",
      icon: <BsPersonWorkspace />,
    },
    {
      id: 4,
      title: "وبلاگ ها",
      href: "/p-admin/blogs",
      icon: <FaBloggerB />,
    },
    {
      id: 5,
      title: "کامنت ها",
      href: "/p-admin/comments",
      icon: <FaRegComment />,
    },
    {
      id: 6,
      title: "مدرسین",
      href: "/p-admin/teachers",
      icon: <FaChalkboardTeacher />,
    },
    {
      id: 7,
      title: "ویرایش پروفایل",
      href: "/p-admin/profile",
      icon: <MdOutlineModeEdit />,
    },
  ],
};

export const typeValues = [
  { id: 1, value: "free", title: "رایگان" },
  { id: 2, value: "cash", title: "نقدی" },
];

export const commentcolumns: Array<{
  key: keyof CommentData;
  header: string;
  render?: (value: CommentData[keyof CommentData]) => React.ReactNode;
}> = [
  {
    key: "id",
    header: "ردیف",
  },
  {
    key: "name",
    header: "کاربر",
  },
  {
    key: "entity",
    header: "کامنت گزاشته شده برای",
  },
  {
    key: "accept",
    header: "وضعیت",
  },
  {
    key: "action",
    header: "عملیات ها",
    render(value) {
      return <CommentAction {...JSON.parse(JSON.stringify(value))} />;
    },
  },
];

export const userscolumns: Array<{
  key: keyof UserData;
  header: string;
  render?: (value: UserData[keyof UserData]) => React.ReactNode;
}> = [
  { key: "id", header: "ردیف" },
  {
    key: "userInfo",
    header: "کاربر",
    render: (value) => {
      if (typeof value === "object") {
        return (
          <div className="flex-align-center gap-x-3">
            <Image
              src={value.image}
              alt="user-image-profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <p>{value.fullname}</p>
          </div>
        );
      }
    },
  },
  {
    key: "wallet",
    header: "کیف پول",
    render: (value) => <>{priceWithDots(Number(value))} تومان</>,
  },
  {
    key: "action",
    header: "عملیات ها",
    render: (value) => (
      <Link
        className="grid-center size-10 rounded-md border border-border hover:bg-input transition"
        href={`/p-admin/users/${value.toString()}`}
      >
        <FaEye className="text-foreground text-lg" />
      </Link>
    ),
  },
];
