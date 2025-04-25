import SidebarItem from "./sidebarItem";

type Sport = {
  id: string; // Airtable IDs are strings
  sportName: string;
  description: string;
  createdAt: string; // ISO date string from Airtable
};

export default function Sidebar() {
  function getSports(): Array<Sport> {
    fetch("/api/sports").then((res) => {
      if (!res.ok) {
        return [];
      }
      res.json().then((data) => {
        return data;
      });
    });
    return [];
  }

  let sports = getSports();

  return (
    <div className="sidebar">
      {sports.map((sport: Sport) => (
        <SidebarItem key={sport.id} title={sport.sportName} />
      ))}
    </div>
  );
}
