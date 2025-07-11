import { describe, it, expect } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import App from "./App.vue";

describe("App.vue", () => {
  it("renders the header with logo and router-link to home", () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    const header = wrapper.find("header.app-header");
    expect(header.exists()).toBe(true);

    const logoLink = header.findComponent(RouterLinkStub);
    expect(logoLink.exists()).toBe(true);
    expect(logoLink.text()).toContain("TV Show Dashboard");
    expect(logoLink.props("to")).toBe("/");
  });

  it("renders router-view", () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
    // router-view renders as a comment node when not in a real router context,
    // but we can check its existence by querying for it as a selector.
    expect(wrapper.html()).toContain("router-view");
  });
});
