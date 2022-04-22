import { shallowMount } from "@vue/test-utils";
import ChildrenButton from "../../../src/components/ChildrenButton";

describe("ChildrenButton", () => {
  it("show the + sign by default", () => {
    const childrenButton = shallowMount(ChildrenButton, {
      propsData: {
        expanded: false,
        loading: false,
      },
    });

    expect(childrenButton.vm.childrenButtonIcon).toBe("plus-square");
  });

  it("shows the - sign if the component is expanded", () => {
    const childrenButton = shallowMount(ChildrenButton, {
      propsData: {
        expanded: true,
        loading: false,
      },
    });

    expect(childrenButton.vm.childrenButtonIcon).toBe("minus-square");
  });

  it("shows the loading sign if the component is loading", () => {
    const childrenButton = shallowMount(ChildrenButton, {
      propsData: {
        expanded: false,
        loading: true,
      },
    });

    expect(childrenButton.vm.childrenButtonIcon).toBe("ellipsis-h");
  });

  it("uses the slot icon if the component is expanded", () => {
    const childrenButton = shallowMount(ChildrenButton, {
      propsData: {
        expanded: true,
        loading: false,
        iconSlot: (props) => {
          return `Test ${props.expanded ? "open" : "closed"}`;
        },
      },
    });

    expect(childrenButton.text()).toBe("Test open");
  });

  it("uses the slot icon if the component is closed", () => {
    const childrenButton = shallowMount(ChildrenButton, {
      propsData: {
        expanded: false,
        loading: false,
        iconSlot: (props) => {
          return `Test ${props.expanded ? "open" : "closed"}`;
        },
      },
    });

    expect(childrenButton.text()).toBe("Test closed");
  });
});
