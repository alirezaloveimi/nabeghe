type Role = "ADMIN" | "USER";
type EntityType = "Blog" | "Course";
type CourseStatus = "PRESALE" | "COMPLATE" | "INPROGRESS";

type ImageT = {
  path: string;
  url: string;
};

type User = {
  _id: string;
  fullname: string;
  phone: string;
  wallet: number;
  image?: ImageT;
  role: Role;
  cart?: Course[];
};

type Teacher = {
  _id: string;
  name: string;
  title: string;
  about: string;
  image: ImageT;
  courses: Course[];
};

type Category = {
  _id: string;
  name: string;
  title: string;
};

type CommentT = {
  _id: string;
  text: string;
  isAccept: boolean;
  parentId: string;
  entityId: Course | Blog;
  isAnswer: boolean;
  user: User;
  entityType: EntityType;
  replies?: CommentT[];
};

type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  time: number;
  html: string;
  cover: ImageT;
  category: Category;
  teacher: Teacher;
  status: CourseStatus;
  students: User[];
};

type Blog = {
  _id: string;
  title: string;
  description: string;
  author: string;
  cover: ImageT;
  html: string;
  likes: User[];
  createdAt: Date;
};
