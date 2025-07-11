import { mount, flushPromises } from "@vue/test-utils";
import Home from "../../src/views/Home.vue";
import * as api from "../../src/services/tvMazeService";

vi.mock("../../src/services/tvMazeService");

const showsMock = [
  {
    id: 1,
    name: "DramaShow",
    genres: ["Drama"],
    image: null,
    rating: { average: 9 },
    summary: "",
  },
  {
    id: 2,
    name: "ComedyShow",
    genres: ["Comedy"],
    image: null,
    rating: { average: 8 },
    summary: "",
  },
  {
    id: 3,
    name: "MixedShow",
    genres: ["Drama", "Comedy"],
    image: null,
    rating: { average: 7 },
    summary: "",
  },
];

describe("Home.vue", () => {
  beforeEach(() => {
    (api.fetchAllShows as any)
      .mockResolvedValue(showsMock)(api.searchShows as any)
      .mockResolvedValue([showsMock[0]]);
  });

  it("groups shows by genres and sorts by rating", async () => {
    const wrapper = mount(Home);
    await flushPromises();
    // Should show Drama and Comedy genres
    expect(wrapper.text()).toContain("Drama");
    expect(wrapper.text()).toContain("Comedy");
    // Sorted by rating
    const dramaShows = wrapper.vm.showsByGenre["Drama"];
    expect(dramaShows[0].name).toBe("DramaShow");
  });

  it("searches and groups search results by genre", async () => {
    const wrapper = mount(Home);
    await flushPromises();
    await wrapper.find("input").setValue("DramaShow");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(wrapper.text()).toContain("Search Results");
    expect(wrapper.text()).toContain("Drama");
    expect(wrapper.text()).toContain("DramaShow");
  });

  it('shows "No search found" if search is empty', async () => {
    (api.searchShows as any).mockResolvedValue([]);
    const wrapper = mount(Home);
    await flushPromises();
    await wrapper.find("input").setValue("something");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    expect(wrapper.text()).toContain("No search found.");
  });
});
