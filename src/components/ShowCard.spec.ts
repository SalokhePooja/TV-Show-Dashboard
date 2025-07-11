import { mount } from "@vue/test-utils";
import ShowCard from "../../src/components/ShowCard.vue";

describe("ShowCard.vue", () => {
  const show = {
    id: 1,
    name: "Test Show",
    genres: ["Drama", "Comedy"],
    image: {
      medium: "https://via.placeholder.com/210x295",
      original: "https://via.placeholder.com/210x295",
    },
    rating: { average: 8.5 },
    summary: "A summary",
  };

  it("displays show info", () => {
    const wrapper = mount(ShowCard, { props: { show } });
    expect(wrapper.text()).toContain("Test Show");
    expect(wrapper.text()).toContain("Drama, Comedy");
    expect(wrapper.text()).toContain("⭐ 8.5");
    expect(wrapper.find("img").attributes("src")).toBe(show.image.medium);
  });

  it("shows fallback image when missing", () => {
    const wrapper = mount(ShowCard, {
      props: { show: { ...show, image: null } },
    });
    expect(wrapper.find("img").attributes("src")).toMatch(/No\+Image/);
  });
});
