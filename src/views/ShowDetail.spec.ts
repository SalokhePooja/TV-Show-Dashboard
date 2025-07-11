import { mount, flushPromises } from "@vue/test-utils";
import ShowDetail from "../../src/views/ShowDetail.vue";
import * as api from "../../src/services/tvMazeService";
import { createRouter, createWebHistory } from "vue-router";

vi.mock("../../src/services/tvMazeService");

const showMock = {
  id: 1,
  name: "TestShow",
  genres: ["Drama"],
  image: { original: "img.jpg", medium: "img.jpg" },
  rating: { average: 8 },
  summary: "Show summary",
};
const episodesMock = [
  {
    id: 1,
    name: "Ep1",
    image: { medium: "epimg.jpg", original: "epimg.jpg" },
    season: 1,
    number: 1,
    airdate: "2023-01-01",
  },
  {
    id: 2,
    name: "Ep2",
    image: null,
    season: 1,
    number: 2,
    airdate: "2023-01-08",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/show/:id", component: ShowDetail }],
});

describe("ShowDetail.vue", () => {
  beforeEach(() => {
    (api.fetchShowById as any)
      .mockResolvedValue(showMock)(api.fetchEpisodes as any)
      .mockResolvedValue(episodesMock);
  });

  it("renders show details and episode horizontal list", async () => {
    router.push("/show/1");
    await router.isReady();
    const wrapper = mount(ShowDetail, {
      global: { plugins: [router] },
    });
    await flushPromises();
    expect(wrapper.text()).toContain("TestShow");
    expect(wrapper.text()).toContain("Drama");
    expect(wrapper.text()).toContain("Show summary");
    // Episodes
    expect(wrapper.text()).toContain("Ep1");
    expect(wrapper.text()).toContain("Ep2");
    // Episode image
    expect(wrapper.findAll(".episode-card img")[0].attributes("src")).toBe(
      "epimg.jpg",
    );
    // Fallback image for missing
    expect(wrapper.findAll(".episode-card img")[1].attributes("src")).toMatch(
      /No\+Image/,
    );
  });

  it('shows "No episodes found" if empty', async () => {
    (api.fetchEpisodes as any).mockResolvedValue([]);
    router.push("/show/1");
    await router.isReady();
    const wrapper = mount(ShowDetail, {
      global: { plugins: [router] },
    });
    await flushPromises();
    expect(wrapper.text()).toContain("No episodes found.");
  });
});
