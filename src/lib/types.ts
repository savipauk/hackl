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
  createdAt: string;
};

export type CategoryOutput = {
  id: string;
  category: string;
  createdAt: string;
};

export type TournamentOutput = {
  id: string;
  tournament: string;
  createdAt: string;
};

export type SportInfoOutput = {
  categories: CategoryOutput[];
  tournaments: TournamentOutput[];
};
