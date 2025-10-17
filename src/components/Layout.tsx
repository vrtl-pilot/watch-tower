import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-grow overflow-auto">
          <Outlet />
        </main>
        <footer className="py-4 border-t">
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Layout;