import React from "react";

type BulletLabelProps = {
  label: string;
};

export default function BulletLabel({ label }: BulletLabelProps) {
  return (
    <div className="flex-align-center gap-3">
      <div className="flex-align-center gap-x-1">
        <div className="size-1 bg-foreground rounded-full"></div>
        <div className="size-2 bg-foreground rounded-full"></div>
      </div>
      <h4 className="font-black text-foreground">{label}</h4>
    </div>
  );
}
