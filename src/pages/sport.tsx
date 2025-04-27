import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

import { EventOutput, Sport, TeamInformation, LocationByHash } from "@/lib/types";

import "@/styles/globals.css";
import "@/styles/sport.css";
import "@/styles/eventsManager.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Carousel from "@/components/carousel";
import Card from "@/components/card";
import EventsCard from "@/components/eventsCard";
import dynamic from 'next/dynamic';
import MapErrorBoundary from '../components/mapErrorBoundary'


const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

type ActiveTab =
  "events" |
  "results" |
  "teams" |
  "locations" |
  "table";

export default function SportPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [sportName, setSportName] = useState("");
  const [sports, setSports] = useState<Sport[]>([]);
  const [events, setEvents] = useState<EventOutput[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("events");
  const [teamMap, setTeamMap] = useState<Map<string, TeamInformation>>(
    () => new Map()
  );
  const [locationMap, setLocationMap] = useState<Map<string, LocationByHash>>(
    () => new Map
  );
  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    const local_category = Cookies.get("title");

    if (!local_category) {
      window.location.href = "/";
      return;
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

        setLocationMap(old => {
          const next = new Map(old);
          next.set(locationId, data);
          return next;
        });
        const address: string = "Zagreb, " + data.address; // + ", " + data.venueName;
        const new_addresses: string[] = addresses.concat([address]);
        setAddresses(new_addresses);
      } catch (err) {
        setLocationMap(new Map());
      } finally {
        setLoading(false);
        // console.log(sports);
      }
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
        // console.log("TEAMS", data);

        setTeamMap(old => {
          const next = new Map(old);
          next.set(teamId, data[0]);
          return next;
        });

        // console.log("Setting ", teamId, " with data", data[0]);
      } catch (err) {
        setTeamMap(new Map());
      } finally {
        setLoading(false);
        // console.log(sports);
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
        // console.log("EVENTS", data);
        setEvents(data);

        data.map((event) => {
          if (!teamMap.has(event.homeTeam)) {
            fetchTeams(event.homeTeam);
          }
          if (!teamMap.has(event.awayTeam)) {
            fetchTeams(event.awayTeam);
          }
          if (!locationMap.has(event.location)) {
            fetchLocation(event.location);
          }
        });
      } catch (err) {
        setEvents([] as EventOutput[]);
      } finally {
        setLoading(false);
        // console.log(sports);
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
        // console.log("DATA", data);
        setSports(data);
        fetchEventInfo(category, data[0].sportName);
      } catch (err) {
        setSports([] as Sport[]);
      } finally {
        setLoading(false);
        // console.log(sports);
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
        <div className="content-area">
          {sports.map((sport) => (
            <div>
              <div className="sportPageDiv flex justify-center">
                {sport.sportName}
              </div>
              <div className="sportPageDiv flex justify-center">
                {category}
              </div>

              <div className="tab-section">
                <div className="tab-buttons">
                  <button
                    className={`tab-button ${activeTab === "events" ? "active" : ""}`}
                    onClick={() => setActiveTab("events")}
                  >
                    DOGAĐAJI
                  </button>
                  <button
                    className={`tab-button ${activeTab === "results" ? "active" : ""}`}
                    onClick={() => setActiveTab("results")}
                  >
                    REZULTATI
                  </button>
                  <button
                    className={`tab-button ${activeTab === "teams" ? "active" : ""}`}
                    onClick={() => setActiveTab("teams")}
                  >
                    MOMČADI
                  </button>
                  <button
                    className={`tab-button ${activeTab === "locations" ? "active" : ""}`}
                    onClick={() => setActiveTab("locations")}
                  >
                    LOKACIJE
                  </button>
                  <button
                    className={`tab-button ${activeTab === "table" ? "active" : ""}`}
                    onClick={() => setActiveTab("table")}
                  >
                    POREDAK
                  </button>
                </div>
              </div>


              <div className="form-card">
                {activeTab === "events" && (
                  <>
                    {events.map((event) => (
                      <EventsCard date={event.matchDate} time={event.matchTime} location={locationMap.get(event.location)?.venueName} homeTeam={teamMap.get(event.homeTeam)?.teamName} awayTeam={teamMap.get(event.awayTeam)?.teamName} homeTeamImage={teamMap.get(event.homeTeam)?.teamLogo} awayTeamImage={teamMap.get(event.awayTeam)?.teamLogo} />
                    ))}
                  </>
                )}
                {activeTab === "events" && (
                  <>
                  </>
                )}
                {activeTab === "locations" && (
                  <>
                    <MapErrorBoundary>
                      <MapView />
                    </MapErrorBoundary>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-[8vh]">
        <Footer />
      </div>
    </div >
  );
}
