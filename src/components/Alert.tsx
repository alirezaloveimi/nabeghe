import { PropsWithChildren } from "react";

type AlertProps = {
  icon?: React.ReactNode;
  colorIcon?: string;
};

export default function Alert({
  icon,
  colorIcon,
  children,
}: PropsWithChildren<AlertProps>) {
  return (
    <div className="bg-secondary p-3 border border-border flex-align-center gap-x-3">
      {icon && (
        <span style={{ color: colorIcon }} className="text-4xl">
          {icon}
        </span>
      )}
      <span className="text-muted text-sm md:text-base">{children}</span>
    </div>
  );
}
