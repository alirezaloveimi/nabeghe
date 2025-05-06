import Spinner from "@/components/Spinner";

export default function RootLoading() {
  return (
    <div className="h-screen grid-center">
      <Spinner height={50} width={50} />
    </div>
  );
}
