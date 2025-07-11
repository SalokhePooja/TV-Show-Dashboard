import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ShowDetail from "./ShowDetail.vue";

// Create mocks BEFORE vi.mock
const pushMock = vi.fn();
const routeParams = { id: "123" };

// Mock vue-router
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: pushMock }),
  useRoute: () => ({ params: routeParams }),
}));

// Mock service
vi.mock("../services/tvMazeService", () => ({
  fetchShowById: vi.fn(),
  fetchEpisodes: vi.fn(),
}));

import { fetchShowById, fetchEpisodes } from "../services/tvMazeService";

describe("ShowDetail.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routeParams.id = "123";
  });

  it("shows loading initially", async () => {
    (fetchShowById as any).mockResolvedValue({ id: 123 });
    (fetchEpisodes as any).mockResolvedValue([]);
    const wrapper = mount(ShowDetail);
    expect(wrapper.find(".center").text()).toContain("Loading");
    await flushPromises();
  });

  it("shows show details when show and episodes are loaded", async () => {
    const mockShow = {
      id: 123,
      name: "Test Show",
      genres: ["Drama", "Comedy"],
      rating: { average: 8.5 },
      summary: "<p>Summary of show</p>",
      image: { medium: "someimage.jpg" },
    };
    const mockEpisodes = [
      {
        id: 1,
        name: "Episode 1",
        image: { medium: "ep1.jpg" },
      },
    ];
    (fetchShowById as any).mockResolvedValue(mockShow);
    (fetchEpisodes as any).mockResolvedValue(mockEpisodes);

    const wrapper = mount(ShowDetail);
    await flushPromises();
    expect(wrapper.find("h1").text()).toBe("Test Show");
    expect(wrapper.find(".genres").text()).toContain("Drama, Comedy");
    expect(wrapper.find(".rating").text()).toContain("⭐ 8.5");
    expect(wrapper.find(".summary").html()).toContain("Summary of show");
    expect(wrapper.findAll(".episode-card")).toHaveLength(1);
    expect(wrapper.find(".ep-name").text()).toBe("Episode 1");
  });

  it("shows no episodes message when episodes list is empty", async () => {
    const mockShow = {
      id: 123,
      name: "Test Show",
      genres: [],
      rating: { average: null },
      summary: "<p>No episodes summary</p>",
      image: { medium: "" },
    };
    (fetchShowById as any).mockResolvedValue(mockShow);
    (fetchEpisodes as any).mockResolvedValue([]);
    const wrapper = mount(ShowDetail);
    await flushPromises();
    expect(wrapper.find(".no-episodes").text()).toBe("No episodes found.");
  });

  it("shows error if show not found", async () => {
    (fetchShowById as any).mockResolvedValue(null);
    (fetchEpisodes as any).mockResolvedValue([]);
    const wrapper = mount(ShowDetail);
    await flushPromises();
    expect(wrapper.find(".no-episodes").text()).toBe(
      "No result found for this show.",
    );
  });

  it("shows error if id is NaN", async () => {
    routeParams.id = "not-a-number";
    (fetchShowById as any).mockResolvedValue(null);
    (fetchEpisodes as any).mockResolvedValue([]);
    const wrapper = mount(ShowDetail);
    await flushPromises();
    expect(wrapper.find(".no-episodes").text()).toBe(
      "No result found for this show.",
    );
  });

  it("navigates back when back button is clicked", async () => {
    const mockShow = {
      id: 123,
      name: "Test Show",
      genres: [],
      rating: { average: null },
      summary: "",
      image: { medium: "" },
    };
    (fetchShowById as any).mockResolvedValue(mockShow);
    (fetchEpisodes as any).mockResolvedValue([]);
    const wrapper = mount(ShowDetail);
    await flushPromises();
    await wrapper.find(".back").trigger("click");
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
