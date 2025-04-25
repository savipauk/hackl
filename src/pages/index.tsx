import { GetServerSideProps } from "next";
import { useState } from "react";
import type { FormEvent } from "react"; // Import FormEvent type
import "@/styles/globals.css"; // Assuming you have global styles
import SidebarItem from "@/components/sidebarItem";
import Sidebar from "@/components/sidebar";

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
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex h-[10vh]">{/* header */}</div>
      <div className="flex h-[80vh]">
        {sidebarVisible ? <Sidebar /> : <div>nosidebar</div>}
        {/* content */}
      </div>
      <div className="flex h-[10vh]">{/* footer */}</div>
      <SidebarItem title="test" />

      {/* Display Message/Error Area
      {message && (
        <div
          className={`p-3 mb-4 rounded text-center ${
            error ||
            message.startsWith("Error") ||
            message.startsWith("Failed") ||
            message.startsWith("Adding")
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {message}
        </div>
      )} */}

      {/* Sports List */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Available Sports
          </h2>
        </div>
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
