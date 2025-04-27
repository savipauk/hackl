import { EventOutput, SportOutput } from "@/lib/types";
import "@/styles/eventOnDate.css";

interface EventOnDateProps {
  event: EventOutput;
  name?: string;
  address?: string;
}

export default function EventOnDate({
  event,
  name,
  address,
}: EventOnDateProps) {
  return (
    <div className="eventDateCard p-[10px]">
      <div className="flex ">
        <p className="eventInfo">{event.matchTime}</p>
        <p className="eventInfo">
          {name},{address}
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
