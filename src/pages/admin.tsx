import { useState } from "react";

import "@/styles/globals.css";
import AdminHeader from "@/components/adminHeader";
import Footer from "@/components/footer";

export default function Admin() {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex h-[15vh]">
        <AdminHeader onLogoutToggle={() => {}} />
      </div>
      <div className="flex h-[75vh]"></div>
      <div className="flex h-[10vh]">
        <Footer />
      </div>
    </div>
  );
}
