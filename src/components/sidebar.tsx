import { SportOutput } from "@/lib/types";
import SidebarItem from "./sidebarItem";
import { useEffect, useState } from "react";
import "@/styles/sidebar.css";

export default function Sidebar() {
  const [sports, setSports] = useState<SportOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSports() {
      try {
        const response = await fetch("/api/sports");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SportOutput[] = await response.json();
        setSports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch sports");
        setSports([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSports();
  }, []);

  if (loading) {
    return <div>Loading sports...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="sidebar">
      {sports.map((sport) => (
        <SidebarItem key={sport.id} title={sport.sportName} />
      ))}
    </div>
  );
}
