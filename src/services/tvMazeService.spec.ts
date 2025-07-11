import {
  fetchAllShows,
  fetchShowById,
  fetchEpisodes,
  searchShows,
} from "../../src/services/tvMazeService";
import { describe, it, expect, vi, afterEach } from "vitest";

global.fetch = vi.fn();

describe("tvmazeApi service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetchAllShows returns show array", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, name: "Test", genres: [], rating: { average: null } },
      ],
    });
    const shows = await fetchAllShows();
    expect(shows).toHaveLength(1);
    expect(shows[0].name).toBe("Test");
  });

  it("fetchShowById returns show object", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        name: "Test",
        genres: [],
        rating: { average: null },
      }),
    });
    const show = await fetchShowById(1);
    expect(show.id).toBe(1);
  });

  it("fetchEpisodes returns episode array", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, name: "Ep1" }],
    });
    const eps = await fetchEpisodes(1);
    expect(eps[0].name).toBe("Ep1");
  });

  it("searchShows returns mapped show array", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          show: { id: 1, name: "Test", genres: [], rating: { average: null } },
        },
      ],
    });
    const results = await searchShows("Test");
    expect(results[0].name).toBe("Test");
  });

  it("throws on fetch error", async () => {
    (fetch as any).mockResolvedValue({ ok: false });
    await expect(fetchAllShows()).rejects.toThrow();
  });
});
