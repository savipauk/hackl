import "@/styles/eventCard.css";
import Cookies from 'js-cookie';

interface EventsCardProps {
  idHome?: string;
  idAway?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  homeTeamImage?: string;
  awayTeamImage?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeResult?: number;
  awayResult?: number;
}

export default function EventsCard({ idHome,idAway,date, time, location, category, homeTeamImage, awayTeamImage, homeTeam, awayTeam , homeResult, awayResult}: EventsCardProps) {
  const handleTeamClick = (teamType: 'home' | 'away') => {
    const teamName = teamType === 'home' ? idHome : idAway;
    if(teamName) {
      Cookies.set('teamId', teamName);
      window.location.href = "/teamInfo";
    }
  };
  
  return (
    <div className="card">
      <div className="info">
        <>
          {date}, {time}, {location}
        </>
      </div>
      <div className="flex items-center justify-around">
        <div className="team">
        <img className="photo" src={homeTeamImage} />
        <a className="link" onClick={() => handleTeamClick('home')}>
          <div className="name">{homeTeam}</div>
        </a>
      </div>
      <p>:</p>
      <div className="team">
        <img className="photo" src={awayTeamImage} />
        <a className="link" onClick={() => handleTeamClick('away')}>
          <div className="name">{awayTeam}</div>
        </a>
      </div>
    </div>
    </div>
  );
}