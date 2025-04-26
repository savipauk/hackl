import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import "@/styles/events.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Value } from "react-calendar/src/shared/types.js";
import { EventOutput, SportOutput } from "@/lib/types";
import EventOnDate from "@/components/eventOnDate";

export default function Events() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [upcomingDates, setUpcomingDates] = useState(true);
  const [date, setDate] = useState<Value>(new Date());
  const [events, setEvents] = useState<EventOutput[]>();
  const [sportNames, setSportNames] = useState<string[]>("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events/eventInfo");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: EventOutput[] = await response.json();
        setEvents(data);
        events?.map((event) => {});
      } catch {
        const data: EventOutput[] = [];
        setEvents(data);
      }
    }
    async function fetchSport(id: string) {
      try {
        const response = await fetch("/api/sports/byhash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sportId: id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SportOutput = await response.json();
        setSportTeam(data.sportName);
      } catch {
        setSportTeam("Nema tima");
      }
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
        <div>
          {events?.map((event) => {
            if (
              event.matchDate &&
              date instanceof Date &&
              new Date(event.matchDate).toDateString() === date.toDateString()
            ) {
              return <EventOnDate event={event} />;
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
