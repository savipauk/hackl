import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import "@/styles/events.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Value } from "react-calendar/src/shared/types.js";
import {
  EventOutput,
  LocationByHash,
  LocationsOutput,
  Sport,
  SportOutput,
  TeamOutput,
} from "@/lib/types";
import EventOnDate from "@/components/eventOnDate";

export default function Events() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [upcomingDates, setUpcomingDates] = useState(true);
  const [date, setDate] = useState<Value>(new Date());
  const [events, setEvents] = useState<EventOutput[]>();
  const [sportNames, setSportNames] = useState<Map<string, string>>(
    () => new Map()
  );
  const [locationMap, setLocationMap] = useState<Map<string, LocationByHash>>(
    () => new Map()
  );
  const [homeTeamMap, setHomeTeamMap] = useState<Map<string, string>>(
    () => new Map()
  );
  const [awayTeamMap, setAwayTeamMap] = useState<Map<string, string>>(
    () => new Map()
  );
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(
    () => new Map()
  );
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events/eventInfo");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: EventOutput[] = await response.json();
        setEvents(data);
        data?.map((event) => {
          if (event.matchDate === "2025-04-27") {
            if (sportNames.has(event.sport)) return;
            fetchSport(event.sport, event.category).catch((error) => {
              console.error("Error fetching sport:", error);
            });
            if (!locationMap.has(event.location)) {
              fetchLocation(event.location);
            }
            if (!homeTeamMap.has(event.homeTeam)) {
              fetchTeam(event.homeTeam, true);
            }
            if (!awayTeamMap.has(event.awayTeam)) {
              fetchTeam(event.awayTeam, false);
            }
          }
        });
      } catch {
        const data: EventOutput[] = [];
        setEvents(data);
      }
    }
    async function fetchSport(sportId: string, categoryId: string) {
      try {
        const response = await fetch("/api/sports/byhash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sportId: sportId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Sport[] = await response.json();
        setSportNames((old) => {
          const next = new Map(old);
          next.set(sportId, data[0].sportName);
          return next;
        });
        setCategoryMap((old) => {
          const next = new Map(old);
          next.set(categoryId, data[0].category);
          return next;
        });
      } catch {}
    }
    async function fetchLocation(locationId: string) {
      try {
        const response = await fetch("/api/events/locationbyhash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationId: locationId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: LocationByHash = await response.json();

        setLocationMap((old) => {
          const next = new Map(old);
          next.set(locationId, data);
          return next;
        });
      } catch (err) {}
    }

    async function fetchTeam(teamId: string, home: boolean = false) {
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
        const data: TeamOutput[] = await response.json();

        if (home) {
          setHomeTeamMap((old) => {
            const next = new Map(old);
            next.set(teamId, data[0].teamName);
            return next;
          });
        } else {
          setAwayTeamMap((old) => {
            const next = new Map(old);
            next.set(teamId, data[0].teamName);
            return next;
          });
        }
      } catch (err) {}
    }

    fetchEvents();
  }, []);

  return (
    <div>
      <div className="flex h-[13vh]">
        <Header
          onMenuToggle={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
      <div className="flex min-h-[87dvh]">
        <div className="cover">
          <h1 className="events flex h-[100%] justify-center items-end">
            DOGAĐAJI
          </h1>
        </div>
      </div>
      <div className="flex flex-col min-h-[95dvh]">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="w-[100%] flex justify-evenly my-[30px]">
          <button
            className={upcomingDates ? "emptyButton" : "selectedButton"}
            onClick={() => setUpcomingDates(false)}
          >
            DOGAĐAJI GRAĐANA
          </button>
          <button
            className={`${upcomingDates ? "selectedButton" : "emptyButton"}`}
            onClick={() => setUpcomingDates(true)}
          >
            DOGAĐAJI SAVEZA
          </button>
        </div>
        {upcomingDates ? (
          <h1 className="dateTitle">Događaji saveza</h1>
        ) : (
          <h1 className="dateTitle">Događaji građana</h1>
        )}
        <div
          style={{ color: "black" }}
          className="flex justify-center py-[20px]"
        >
          <Calendar
            locale="hr"
            value={date}
            onChange={(value) => {
              setDate(value);
            }}
          />
        </div>
        <h1 className="dateTitle">
          DOGAĐAJI
          {date instanceof Date
            ? " " + date.getDate() + "." + (date.getMonth() + 1) + "."
            : "Invalid date"}
        </h1>
        <div className="flex flex-col w-[60%] mx-auto">
          {events?.map((event, index) => {
            if (
              event.matchDate &&
              date instanceof Date &&
              new Date(event.matchDate).toDateString() === date.toDateString()
            ) {
              return (
                <EventOnDate
                  event={event}
                  name={sportNames.get(event.sport)}
                  address={locationMap.get(event.location)?.venueName}
                  homeTeam={homeTeamMap.get(event.homeTeam)}
                  awayTeam={awayTeamMap.get(event.awayTeam)}
                  category={categoryMap.get(event.category)}
                />
              );
            }
          })}
        </div>
      </div>
      <div className="flex h-[8vh]">
        <Footer />
      </div>
    </div>
  );
}
