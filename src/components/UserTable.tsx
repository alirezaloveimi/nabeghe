import { userscolumns } from "@/data";
import { connectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import DataTable from "./DataTable";

export type UserData = {
  userInfo: { image: string; fullname: string };
  id: number;
  wallet: number;
  action: string;
};

const getUsers = async (search: string): Promise<User[]> => {
  try {
    await connectDB();
    const users = await User.find({ role: "USER" }).sort({
      createdAt: -1,
    });

    const filteredUsers = users.filter((user) =>
      user.fullname.includes(search)
    );

    return filteredUsers;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function UserTable({ search }: { search: string }) {
  const users = await getUsers(search);

  const usersData = users.map((user, index) => ({
    id: index + 1,
    userInfo: {
      fullname: user.fullname,
      image: user.image?.url ?? "/images/user-no-image.png",
    },
    wallet: user.wallet,
    action: user._id,
  }));

  return <DataTable data={usersData} columns={userscolumns} />;
}
