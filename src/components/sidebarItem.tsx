import "@/styles/sidebarItem.css";
import { useEffect, useState } from "react";
import SidebarItemMenu from "./sidebarItemMenu";
import { SportInfoOutput } from "@/lib/types";
import Cookies from 'js-cookie';

interface SidebarItemProps {
  title: string;
  events?: boolean;
  hasMenu?: boolean;
}

function GoToSportCategory(params: SidebarItemProps) {
  console.log(params.title)
  Cookies.set("title", params.title);
  window.location.href = "/sport";
}

export default function SidebarItem({
  title,
  events = false,
  hasMenu = false
}: SidebarItemProps) {
  const [isItemOpen, setIsItemOpen] = useState(false);

  const [sportInfo, setSportInfo] = useState<SportInfoOutput>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSports() {
      try {
        const response = await fetch("/api/sports/sportinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sportName: title,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SportInfoOutput = await response.json();
        setSportInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch sports");
        setSportInfo({} as SportInfoOutput);
      } finally {
        setLoading(false);
      }
    }
    fetchSports();
  }, []);

  return (
    <div>
      <div className="sidebar-item" onClick={() => {
        if (!hasMenu) {
          GoToSportCategory({title});
        } else {
          setIsItemOpen(!isItemOpen)
        }
      }}
      >
        <h2>{title}</h2>
        {!events ? (
          <img
            src="/arrowDown.svg"
            style={{ rotate: `${isItemOpen ? "180deg" : "0deg"}` }}
          />
        ) : (
          <div></div>
        )}
      </div>
      <div>
        {hasMenu && isItemOpen ? (
          <SidebarItemMenu sportInfo={sportInfo} />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
