"use client";

type SwitchProps = {
  onChange: () => void;
  isChecked: boolean;
  label?: string;
};

export default function Switch({ isChecked, onChange, label }: SwitchProps) {
  return (
    <label className="relative w-full flex-between-center cursor-pointer">
      {label && (
        <span className="font-bold text-sm text-foreground">{label}</span>
      )}

      <input
        checked={isChecked}
        onChange={onChange}
        type="checkbox"
        className="sr-only peer"
      />
      <div className="w-11 h-5 relative bg-background border-2 border-border peer-focus:outline-none rounded-full peer peer-checked:after:left-[26px] peer-checked:after:bg-background after:content-[''] after:absolute after:left-0.5 after:top-0.5 after:bg-border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
    </label>
  );
}
