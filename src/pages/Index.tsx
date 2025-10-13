import Navbar from "@/components/Navbar";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
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
  );
};

export default Index;