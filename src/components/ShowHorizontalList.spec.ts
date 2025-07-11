import { mount } from "@vue/test-utils";
import ShowHorizontalList from "../components/ShowHorizontalList.vue";
import ShowCard from "../components/ShowCard.vue";
import { describe, it, expect } from "vitest";

describe("ShowHorizontalList.vue", () => {
  const shows = [
    {
      id: 1,
      name: "Show1",
      genres: ["Drama"],
      image: null,
      rating: { average: 9 },
      summary: "",
      premiered: "",
    },
    {
      id: 2,
      name: "Show2",
      genres: ["Comedy"],
      image: null,
      rating: { average: 7 },
      summary: "",
      premiered: "",
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
