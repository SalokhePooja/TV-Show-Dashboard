import { mount } from "@vue/test-utils";
import ShowHorizontalList from "../../src/components/ShowHorizontalList.vue";
import ShowCard from "../../src/components/ShowCard.vue";

describe("ShowHorizontalList.vue", () => {
  const shows = [
    {
      id: 1,
      name: "Show1",
      genres: ["Drama"],
      image: null,
      rating: { average: 9 },
      summary: "",
    },
    {
      id: 2,
      name: "Show2",
      genres: ["Comedy"],
      image: null,
      rating: { average: 7 },
      summary: "",
    },
  ];

  it("renders ShowCard for each show", () => {
    const wrapper = mount(ShowHorizontalList, { props: { shows } });
    const cards = wrapper.findAllComponents(ShowCard);
    expect(cards).toHaveLength(2);
    expect(cards[0].text()).toContain("Show1");
    expect(cards[1].text()).toContain("Show2");
  });
});
