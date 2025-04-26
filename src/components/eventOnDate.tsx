import { EventOutput, SportOutput } from "@/lib/types";
import "@/styles/eventOnDate.css";
import { useEffect, useState } from "react";

interface EventOnDateProps {
  event: EventOutput;
}

export default function EventOnDate({ event }: EventOnDateProps) {
  const [sportName, setSportTeam] = useState("");

  useEffect(() => {
    async function fetchSport() {
      try {
        const response = await fetch("/api/sports/byhash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sportId: event.sport }),
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

    fetchSport();
  }, []);

  return (
    <div className="eventDateCard p-[10px]">
      <div className="flex ">
        <p className="eventInfo">{event.matchTime}</p>
        <p className="eventInfo">
          {sportName},{event.location}
        </p>
      </div>
      <div className="flex flex-col px-[20px]">
        <p>
          {event.homeTeam}&nbsp;:&nbsp;{event.awayTeam}
        </p>
        <p>{event.category}</p>
        {event.homeTeamScore && event.awayTeamScore ? (
          <p>
            REZULTAT&nbsp;{event.homeTeamScore}&nbsp;:&nbsp;
            {event.awayTeamScore}
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
