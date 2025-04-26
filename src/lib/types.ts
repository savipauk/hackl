export type SportOutput = {
  id: string;
  sportName: string;
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

// Unused but leave we might need it
export type AddEventOutputFields = {
  matchTime: string;
  sport: string; // fk
  category: string; // fk
  matchDate: string;
  location: string; // fk
  homeTeam: string; // fk
  awayTeam: string; // fk
  homeTeamScore: string;
  awayTeamScore: string;
  matchResult: string;
  officials: string;
  statistics: string;
  tournaments: string; // fk
}

// Unused but leave we might need it
export type AddEventOutput = {
  id: string;
  fields: AddEventOutputFields;
  createdAt: string;
}

export type StatusOutput = {
  status: string;
}


export type LocationsOutput  = {
  id: string;
  venueName: string;
  address: string;
  capacity: string;
  facilities: string;
  photo: string;
  matchesHosted: string;
  tournamentsHosted: string;
  sport: string;
  createdAt: string;
}
