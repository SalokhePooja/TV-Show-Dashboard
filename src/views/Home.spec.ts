import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Home from "./Home.vue";

// Mock subcomponents so tests don't depend on their internals
vi.mock("../components/ShowHorizontalList.vue", () => ({
  default: {
    name: "ShowHorizontalList",
    props: ["shows"],
    template: "<div class='show-horizontal-list'></div>",
  },
}));
vi.mock("../components/SearchBar.vue", () => ({
  default: {
    name: "SearchBar",
    emits: ["search"],
    template: "<div class='search-bar'></div>",
  },
}));

// Mock service
vi.mock("../services/tvMazeService", () => ({
  fetchAllShows: vi.fn(),
  searchShows: vi.fn(),
}));

import { fetchAllShows, searchShows } from "../services/tvMazeService";

const mockShows = [
  {
    id: 1,
    name: "Show A",
    genres: ["Drama", "Comedy"],
    rating: { average: 8.5 },
    image: { medium: "a.jpg" },
    summary: "Show A summary",
  },
  {
    id: 2,
    name: "Show B",
    genres: ["Drama"],
    rating: { average: 7.1 },
    image: { medium: "b.jpg" },
    summary: "Show B summary",
  },
  {
    id: 3,
    name: "Show C",
    genres: ["Action"],
    rating: { average: 6.2 },
    image: { medium: "c.jpg" },
    summary: "Show C summary",
  },
];

describe("Home.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    (fetchAllShows as any).mockResolvedValue(mockShows);
    const wrapper = mount(Home);
    expect(wrapper.find(".center").text()).toContain("Loading");
    await flushPromises();
  });

  it("renders genre sections with correct genres and sorts shows by rating", async () => {
    (fetchAllShows as any).mockResolvedValue(mockShows);
    const wrapper = mount(Home);
    await flushPromises();

    // Genres should be Drama, Comedy, Action (sorted)
    const genreHeadings = wrapper
      .findAll(".genre-section h2")
      .map((h) => h.text());
    expect(genreHeadings.sort()).toEqual(["Action", "Comedy", "Drama"]);
    // There should be a ShowHorizontalList for each genre
    expect(wrapper.findAll(".show-horizontal-list")).toHaveLength(3);
  });

  it("groups and sorts search results by genre", async () => {
    (fetchAllShows as any).mockResolvedValue(mockShows);
    const wrapper = mount(Home);
    await flushPromises();

    // Mock searchShows to return two shows in search
    (searchShows as any).mockResolvedValue([mockShows[0], mockShows[2]]);
    // Simulate a search
    const searchBar = wrapper.findComponent({ name: "SearchBar" });
    await searchBar.vm.$emit("search", "test");

    await flushPromises();

    // Search Results heading should be present
    expect(wrapper.html()).toContain("Search Results");
    // Genre sections in search should be Action and Comedy and Drama
    const genreHeadings = wrapper
      .findAll(".genre-section h3")
      .map((h) => h.text());
    expect(genreHeadings.sort()).toEqual(["Action", "Comedy", "Drama"]);
    // There should be a ShowHorizontalList for each genre in search
    expect(wrapper.findAll(".show-horizontal-list")).toHaveLength(3);
  });

  it("shows 'No search found.' if search results are empty", async () => {
    (fetchAllShows as any).mockResolvedValue(mockShows);
    const wrapper = mount(Home);
    await flushPromises();

    (searchShows as any).mockResolvedValue([]);
    const searchBar = wrapper.findComponent({ name: "SearchBar" });
    await searchBar.vm.$emit("search", "empty");

    await flushPromises();

    expect(wrapper.find(".no-search-found").exists()).toBe(true);
  });

  it("restores default genre sections when search is cleared", async () => {
    (fetchAllShows as any).mockResolvedValue(mockShows);
    const wrapper = mount(Home);
    await flushPromises();

    (searchShows as any).mockResolvedValue([mockShows[0]]);
    const searchBar = wrapper.findComponent({ name: "SearchBar" });
    await searchBar.vm.$emit("search", "Drama");
    await flushPromises();

    // Clear search
    await searchBar.vm.$emit("search", "");
    await flushPromises();

    // Should show default genre sections (headings h2)
    const genreHeadings = wrapper
      .findAll(".genre-section h2")
      .map((h) => h.text());
    expect(genreHeadings.sort()).toEqual(["Action", "Comedy", "Drama"]);
  });

  it("handles shows with missing genres and ratings gracefully", async () => {
    const incompleteShows = [
      {
        id: 4,
        name: "Show D",
        genres: [],
        rating: {},
        image: { medium: "d.jpg" },
        summary: "Show D summary",
      },
      {
        id: 5,
        name: "Show E",
        genres: undefined,
        rating: undefined,
        image: { medium: "e.jpg" },
        summary: "Show E summary",
      },
    ];
    (fetchAllShows as any).mockResolvedValue(incompleteShows);
    const wrapper = mount(Home);
    await flushPromises();

    // Should not throw and should not render any genre sections
    expect(wrapper.findAll(".genre-section")).toHaveLength(0);
  });
});
