export interface Show {
  id: number;
  name: string;
  genres: string[];
  rating: { average: number | null };
  image: { medium: string; original: string } | null;
  summary: string;
  premiered: string;
  [key: string]: any;
}

export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
}

export interface ShowDetails extends Show {
  _embedded?: {
    episodes: Episode[];
  };
}

export interface EpisodeWithImage extends Episode {
  image?: { medium: string; original: string } | null;
}
