type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string[];
};

export default function InputField({
  label,
  id,
  error,
  ...rest
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm text-muted" htmlFor={id}>
          {label}
        </label>
      )}

      <input
        className="w-full h-11 outline-none bg-secondary rounded-xl text-sm text-foreground px-5"
        id={id}
        {...rest}
      />

      {error && <p className="text-xs font-bold text-red-500">{error[0]}</p>}
    </div>
  );
}
