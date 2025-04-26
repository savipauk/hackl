import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

import { EventOutput, Sport, TeamInformation } from "@/lib/types";

import "@/styles/globals.css";
import "@/styles/sport.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Carousel from "@/components/carousel";
import Card from "@/components/card";

export default function SportPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [sportName, setSportName] = useState("");
  const [sports, setSports] = useState<Sport[]>([]);
  const [events, setEvents] = useState<EventOutput[]>([]);

  const [teamMap, setTeamMap] = useState<Map<string, TeamInformation>>(
    () => new Map()
  );

  useEffect(() => {
    const local_category = Cookies.get("title");

    if (!local_category) {
      window.location.href = "/";
      return;
    }

    async function fetchTeams(teamId: string) {
      try {
        const response = await fetch("/api/teams/getteambyhash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamId: teamId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TeamInformation[] = await response.json();
        console.log("TEAMS", data);

        setTeamMap(old => {
          const next = new Map(old);
          next.set(teamId, data[0]);
          return next;
        });

        console.log("Setting ", teamId, " with data", data[0]);
      } catch (err) {
        setTeamMap(new Map());
      } finally {
        setLoading(false);
        console.log(sports);
      }
    }

    async function fetchEventInfo(category: string, sportName: string) {
      try {
        const response = await fetch("/api/events/eventInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: category,
            sport: sportName,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: EventOutput[] = await response.json();
        console.log("EVENTS", data);
        setEvents(data);

        data.map((event) => {
          if (!teamMap.has(event.homeTeam)) {
            fetchTeams(event.homeTeam);
          }
          if (!teamMap.has(event.awayTeam)) {
            fetchTeams(event.awayTeam);
          }
        });
      } catch (err) {
        setEvents([] as EventOutput[]);
      } finally {
        setLoading(false);
        console.log(sports);
      }
    }

    async function fetchEverything(category: string) {
      try {
        const response = await fetch("/api/sports/sportbycategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: category,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Sport[] = await response.json();
        console.log("DATA", data);
        setSports(data);
        fetchEventInfo(category, data[0].sportName);
      } catch (err) {
        setSports([] as Sport[]);
      } finally {
        setLoading(false);
        console.log(sports);
      }
    }

    setCategory(local_category);
    fetchEverything(local_category);
  }, []);

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
      <div className="flex min-h-[77vh]">
        <Sidebar isOpen={isSidebarOpen} />
        {sports.map((sport) => (
          <div>
            <div className="sportPageDiv">
              {sport.sportName}
            </div>
            <div className="sportPageDiv">
              {category}
            </div>
            <div>
              {events.map((event) => (
                <div className="sportPageDiv">
                  {teamMap.get(event.homeTeam)?.teamName} vs &nbsp;
                  {teamMap.get(event.awayTeam)?.teamName} 
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex h-[8vh]">
        <Footer />
      </div>
    </div>
  );
}
