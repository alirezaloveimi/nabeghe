type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string[];
};

export default function Textarea({ label, error, id, ...rest }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm text-muted" htmlFor={id}>
          {label}
        </label>
      )}

      <textarea
        className="w-full px-5 py-3 outline-none bg-secondary rounded-xl text-sm text-foreground resize-none"
        id={id}
        {...rest}
      ></textarea>

      {error && <p className="text-xs font-bold text-red-500">{error[0]}</p>}
    </div>
  );
}
