import Spinner from "./Spinner";

type SelectProps<T> = React.SelectHTMLAttributes<HTMLSelectElement> & {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  label: string;
  pendign?: boolean;
  error?: string[];
};

export default function Select<T>({
  data,
  renderItem,
  label,
  pendign = false,
  error,
  ...rest
}: SelectProps<T>) {
  return (
    <div className="space-y-1.5">
      <div className="flex-align-center gap-x-3">
        <label className="block text-sm text-muted">{label}</label>
        {pendign && <Spinner width={20} height={20} />}
      </div>

      <select
        {...rest}
        disabled={pendign}
        className="w-full outline-none bg-secondary h-11 rounded-xl px-2"
      >
        <option value="-1">یک گزینه رو انتخاب کنید</option>
        {data.map(renderItem)}
      </select>

      {error && <p className="text-sm text-red-500">{error[0]}</p>}
    </div>
  );
}
