import { useState } from "react";

import "@/styles/globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";

type Sport = {
  id: string;
  sportName: string;
  description: string;
  createdAt: string;
};

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex h-[15vh]">
        <Header
          onMenuToggle={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
      <div className="flex h-[75vh]">
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      <div className="flex h-[10vh]">
        <Footer />
      </div>
    </div>
  );
}
