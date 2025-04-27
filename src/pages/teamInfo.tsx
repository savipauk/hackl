import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import "@/styles/teamInfo.css";
import Cookies from 'js-cookie';

interface TeamData {
  id: string;
  teamName: string;
  category: string;
  sport: string;
  teamLogo: string;
  members: string;
  wins: string;
  losses: string;
  draws: string;
  totalPoints: string;
  teamRecord: string;
  tournamentsParticipated: string;
  matchesHomeTeam: string;
  matchesAwayTeam: string;
}

export default function TeamInfoPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [sportName, setSportName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const teamId = Cookies.get("teamId");

  useEffect(() => {

    const fetchTeamData = async () => {
      try {
        const response = await fetch("/api/teams/getteambyhash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            teamId: teamId
          })
        });

        if (!response.ok) {
          throw new Error("Neuspješno dohvaćanje podataka.");
        }

        const data = await response.json();
        if (data && data.length > 0) {
          const team = data[0];
          setTeamData(team);
          fetchSportName(team.sport);
        } else {
          setError("Tim nije pronađen.");
        }
      } catch (err) {
        console.error(err);
        console.log(teamId);
        setError("Greška pri dohvaćanju tima.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSportName = async (sportId: string) => {
      try {
        const response = await fetch("/api/sports/byhash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            sportId: sportId
          })
        });

        if (!response.ok) {
          console.log(sportId);
          throw new Error("Neuspješno dohvaćanje sporta.");
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setSportName(data[0].sportName); 
        }
      } catch (err) {
        console.log(sportId);
        console.error(err);
        setSportName("Nepoznato");
      }
    };

    fetchTeamData();
  }, [teamId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex h-[15vh]">
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
      <div className="flex min-h-[77vh]">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="content">
          <div className="team-page">
            {teamData && (
              <>
                <div className="team-profile">
                  <img src={teamData.teamLogo} alt={teamData.teamName} className="team-logo" />
                  <h1 className="team-name">{teamData.teamName}</h1>
                </div>

                <div className="team-details">
                  <p><strong>Sport:</strong> {sportName}</p>
                </div>

                <h2 className="team-page-title">Statistika</h2>
                <table className="team-stats-table">
                  <thead>
                    <tr>
                      <th>Članova</th>
                      <th>Pobjede</th>
                      <th>Porazi</th>
                      <th>Neriješeno</th>
                      <th>Ukupno bodova</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{teamData.members || "0"}</td>
                      <td>{teamData.wins || "0"}</td>
                      <td>{teamData.losses || "0"}</td>
                      <td>{teamData.draws || "0"}</td>
                      <td>{teamData.totalPoints || "0"}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
            <h2 className="team-page-title">Treninzi</h2>
                <table className="team-stats-table">
                  <thead>
                    <tr>
                      <th>Dan</th>
                      <th>Vrijeme</th>
                      <th>Kategorija</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>PON</td>
                      <td>17:00</td>
                      <td>Seniori</td>
                    </tr>
                    <tr>
                      <td>PON</td>
                      <td>18:00</td>
                      <td>Juniori</td>
                    </tr>
                  </tbody>
                </table>
          </div>
        </div>
      </div>
      <div className="flex h-[8vh]">
        <Footer />
      </div>
    </div>
  );
}
