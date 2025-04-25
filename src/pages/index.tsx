import { GetServerSideProps } from "next";
import { useState } from "react";
import type { FormEvent } from "react"; // Import FormEvent type
import "@/styles/globals.css"; // Assuming you have global styles
import SidebarItem from "@/components/sidebarItem";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Define the type for a Sport based on the API response
// Matches the SportOutput type from the API route
type Sport = {
  id: string; // Airtable IDs are strings
  sportName: string;
  description: string;
  createdAt: string; // ISO date string from Airtable
};

// Define the props for the Home component
interface HomeProps {
  initialSports: Sport[];
  error?: string; // Optional error message from server-side fetch
}

export default function Home({ initialSports, error }: HomeProps) {
  // // State to hold the list of sports
  // const [sportsList, setSportsList] = useState<Sport[]>(initialSports);
  // // State to manage loading status for form submission
  // const [isLoading, setIsLoading] = useState(false);
  // // State to manage feedback messages
  // const [message, setMessage] = useState<string | null>(error || null); // Display initial error if any

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

// Fetch initial data on the server
// export const getServerSideProps: GetServerSideProps<HomeProps> = async (
//   context
// ) => {
//   const protocol = context.req.headers["x-forwarded-proto"] || "http";
//   const host = context.req.headers.host || "localhost:3000";

//   try {
//     // Fetch data from your API route
//     const res = await fetch(`${process.env.BASE_URL_LOCAL}/api/sports`); // Use the correct API endpoint

//     if (!res.ok) {
//       // If the API returns an error, pass it to the page
//       const errorData = await res
//         .json()
//         .catch(() => ({ error: `API responded with status ${res.status}` }));
//       console.error(
//         `SSR Fetch Error (${res.status}):`,
//         errorData.error || res.statusText
//       );
//       return {
//         props: {
//           initialSports: [],
//           error: `Failed to load sports: ${errorData.error || res.statusText}`,
//         },
//       };
//     }

//     const initialSports: Sport[] = await res.json();

//     // Pass data to the page via props
//     return { props: { initialSports } };
//   } catch (error) {
//     console.error("SSR Fetch failed:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown server error";
//     // Return empty data and an error message if fetch fails
//     return {
//       props: { initialSports: [], error: `Server error: ${errorMessage}` },
//     };
//   }
// };
