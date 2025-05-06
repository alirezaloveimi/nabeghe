import { PropsWithChildren } from "react";
import Alert from "./Alert";

type RenderListProps<T> = {
  items: T[];
  alternative: string;
};

export default function RenderList<T>({
  items,
  alternative,
  children,
}: PropsWithChildren<RenderListProps<T>>) {
  if (!(items.length > 0)) {
    return <Alert>{alternative}</Alert>;
  }

  return children;
}
