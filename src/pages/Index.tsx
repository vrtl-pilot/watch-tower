import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-grow p-6 overflow-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Welcome to WatchTower
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your all-in-one solution for monitoring systems and applications with ease and precision.
            </p>
          </div>
        </main>
        <footer className="py-4">
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Index;