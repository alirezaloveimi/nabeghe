type SpinnerProps = {
  width: number;
  height: number;
};

export default function Spinner({ height, width }: SpinnerProps) {
  return (
    <span
      style={{ width, height }}
      className="border-4 border-border rounded-full border-t-primary animate-spin"
    ></span>
  );
}
