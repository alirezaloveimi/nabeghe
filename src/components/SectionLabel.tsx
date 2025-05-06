import { PiStudent } from "react-icons/pi";

type SectionLabelProps = {
  title: string;
  text: string;
  styles?: string;
};

export default function SectionLabel({
  text,
  title,
  styles,
}: SectionLabelProps) {
  return (
    <div className={`flex-align-center gap-5 ${styles ? styles : ""}`}>
      <span className="grid-center size-12 bg-primary text-primary-foreground rounded-full shrink-0">
        <PiStudent className="text-3xl" />
      </span>
      <div className="space-y-3">
        <h4 className="font-black text-lg md:text-2xl text-primary">{title}</h4>
        <p className="font-bold text-muted">{text}</p>
      </div>
    </div>
  );
}
