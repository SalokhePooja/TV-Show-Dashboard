import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import SearchBar from "../../src/components/SearchBar.vue";

describe("SearchBar.vue", () => {
  it("renders input and buttons", () => {
    const wrapper = mount(SearchBar);
    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("emits search event with trimmed query", async () => {
    const wrapper = mount(SearchBar);
    await wrapper.find("input").setValue("  Friends ");
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.emitted("search")![0]).toEqual(["Friends"]);
  });

  it("clears input and emits search event", async () => {
    const wrapper = mount(SearchBar);
    await wrapper.find("input").setValue("Lost");
    await wrapper.find('button[type="button"]').trigger("click");
    expect(wrapper.find("input").element.value).toBe("");
    expect(wrapper.emitted("search")![0]).toEqual([""]);
  });
});
