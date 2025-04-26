import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import "@/styles/events.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Value } from "react-calendar/src/shared/types.js";

export default function Events() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [upcomingDates, setUpcomingDates] = useState(true);
  const [date, setDate] = useState<Value>(new Date());

  function getDate() {
    let parsedDate = new Date();
    return parsedDate + "." + (parsedDate.getMonth() + 1) + ".";
  }

  //   useEffect(() => {
  //       async function fetchSports() {
  //         try {
  //           const response = await fetch("/api/sports");

  //           if (!response.ok) {
  //             throw new Error(`HTTP error! status: ${response.status}`);
  //           }

  //           const data: SportOutput[] = await response.json();
  //           setSports(data);
  //         } catch (err) {
  //           setError(err instanceof Error ? err.message : "Failed to fetch sports");
  //           setSports([]);
  //         } finally {
  //           setLoading(false);
  //         }
  //       }

  //       fetchSports();
  //     }, []);

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
            PROŠLI DOGAĐAJI
          </button>
          <button
            className={`${upcomingDates ? "selectedButton" : "emptyButton"}`}
            onClick={() => setUpcomingDates(true)}
          >
            NADOLAZEĆI DOGAĐAJI
          </button>
        </div>
        {upcomingDates ? (
          <h1 className="dateTitle">Nadolazeći sportski događaji</h1>
        ) : (
          <h1 className="dateTitle">Prošli sportski događaji</h1>
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
          DOGAĐAJI {date?.toLocaleString().slice(0, 7)}
        </h1>
      </div>
      <div className="flex h-[8vh]">
        <Footer />
      </div>
    </div>
  );
}
