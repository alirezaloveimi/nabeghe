import Aside from "@/components/Aside";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Header />
      <main className="container py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-5">
          <Aside />
          <div className="lg:col-span-8 xl:col-span-9">{children}</div>
        </div>
      </main>
    </div>
  );
}
