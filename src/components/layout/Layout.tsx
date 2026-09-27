import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg)">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export function BareLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg)">
      <Outlet />
    </div>
  );
}
