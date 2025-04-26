import "@/styles/eventCard.css";

interface EventsCardProps {
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  homeTeamImage?: string;
  awayTeamImage?: string;
  homeTeam?: string;
  awayTeam?: string;
}

export default function EventsCard({ date, time, location, category, homeTeamImage, awayTeamImage, homeTeam, awayTeam }: EventsCardProps) {
  return (
    <div className="card">
      <div className="info">
        <>{date}, {time}, {location}</>
      </div>
      <div className="team">
        <img className="photo" src={homeTeamImage} />
        <div className="name">{homeTeam}</div>
      </div>
      <div className="team">
        <img className="photo" src={homeTeamImage} />
        <div className="name">{awayTeam}</div>
      </div>
    </div>
  );
}
