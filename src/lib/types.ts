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

export interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

export interface Position {
  lat: number;
  lng: number;
  address: string;
=======

export type Sport = {
  id: string;
  sportName: string;
  description: string;
  teamsParticipating: string; // fk
  venuesUsed: string; // fk
  matchesScheduled: string; // fk
  playersInvolved: string;
  tournaments: string; // fk
  officialsAssigned: string;
  statisticsAvailable: string;
  category: string // fk
  createdAt: string;
}

export type LocationByHash = {
  id: string;
  venueName: string;
  address: string;
  createdAt: string;
}

export type TeamInformation = {
  id: string;
  teamName: string;
  category: string;
  sport: string;
  teamLogo?: string;
  members: string;
  wins: string;
  losses: string;
  draws: string;
  totalPoints: string;
  teamRecord: string;
  tournamentsParticipated: string;
  matchesHomeTeam: string;
  matchesAwayTeam: string;
  createdAt: string;
}
