export type SportOutput = {
  id: string;
  sportName: string;
  createdAt: string;
};

export type TeamOutput = {
  id: string;
  teamName: string;
  sport: string;
  totalPoints: number;
  logoUrl?: string;
  category: string;
  createdAt: string;
};

export type CategoryOutput = {
  id: string;
  category: string;
  createdAt: string;
};

export type EventOutput = {
  id: string;
  matchTime: string;
  matchDate: string;
  sport: string;
  category: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamScore: number;
  awayTeamScore: number;
  createdAt: string;
}

export type TournamentOutput = {
  id: string;
  tournament: string;
  createdAt: string;
};

export type SportInfoOutput = {
  categories: CategoryOutput[];
  tournaments: TournamentOutput[];
};
