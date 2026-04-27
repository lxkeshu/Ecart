import { Outlet } from "react-router-dom";
import { CustomerNavbar } from "../customer/common/desktop-navbar";
import { ScrollToTop } from "../common/ScrollToTop";

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollToTop />
      {/* navbar */}
      <CustomerNavbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
