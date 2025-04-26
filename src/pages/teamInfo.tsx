import { useEffect, useState } from "react";

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

export default function TeamPage({ teamId }: { teamId: string }) {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch("/api/teams/getteambyhash", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              teamId: "rec1BQcDN5fesvwUA"
            })
          });

        if (!response.ok) {
          throw new Error("Neuspješno dohvaćanje podataka.");
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setTeamData(data[0]);
        } else {
          setError("Tim nije pronađen.");
        }
      } catch (err) {
        console.error(err);
        setError("Greška pri dohvaćanju tima.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="team-page">
      {teamData && (
        <>
          <img src={teamData.teamLogo} alt={teamData.teamName} className="team-logo" />
          <h1>{teamData.teamName}</h1>
          <p>Kategorija: {teamData.category}</p>
          <p>Sport: {teamData.sport}</p>
          <p>Članova: {teamData.members}</p>
          <p>Pobjede: {teamData.wins || "0"}</p>
          <p>Porazi: {teamData.losses || "0"}</p>
          <p>Neriješeno: {teamData.draws || "0"}</p>
          <p>Ukupno bodova: {teamData.totalPoints || "0"}</p>
        </>
      )}
    </div>
  );
}
