import type { Episode, Show } from "../types/tv-show";

const BASE_URL = "https://api.tvmaze.com";

export async function fetchAllShows(): Promise<Show[]> {
  const res = await fetch(`${BASE_URL}/shows`);
  return res.json();
}

export async function searchShows(query: string): Promise<Show[]> {
  const res = await fetch(`${BASE_URL}/search/shows?q=${query}`);
  const data = await res.json();
  return data.map((item: any) => item.show);
}

export async function fetchShowById(id: number): Promise<Show> {
  const res = await fetch(`${BASE_URL}/shows/${id}`);
  return res.json();
}

export async function fetchEpisodes(showId: number): Promise<Episode[]> {
  const res = await fetch(`${BASE_URL}/shows/${showId}/episodes`);
  if (!res.ok) throw new Error("Failed to fetch episodes");
  return res.json();
}
