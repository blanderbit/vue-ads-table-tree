import { shallowMount } from "@vue/test-utils";
import AppIcon from "@/components/AppIcon";

const shallowMountHelper = (props) => {
  return shallowMount(AppIcon, {
    ...props,
    global: {
      stubs: ["font-awesome-icon"],
    },
  });
};

describe("AppIcon.vue", () => {
  const defaultIcon = "lock";

  describe("renders props", () => {
    it("props.namespace when passed", () => {
      const namespace = "fas";
      const wrapper = shallowMountHelper({
        props: { namespace, icon: defaultIcon },
      });
      expect(wrapper.props().namespace).toMatch(namespace);
    });

    it("props.icon when passed", () => {
      const icon = "fa-angle";
      const wrapper = shallowMountHelper({
        props: { icon },
      });
      expect(wrapper.props().icon).toMatch(icon);
    });

    it("props.hidden when passed", () => {
      const hidden = "area-hidden";
      const wrapper = shallowMountHelper({
        props: { hidden, icon: defaultIcon },
      });
      expect(wrapper.props().hidden).toMatch(hidden);
    });

    it("props.title when passed", () => {
      const title = "span title";
      const wrapper = shallowMountHelper({
        props: { title, icon: defaultIcon },
      });
      expect(wrapper.props().title).toMatch(title);
    });

    it("props.additionalClass when passed", () => {
      const additionalClass = "test-icon-class";
      const wrapper = shallowMountHelper({
        props: { additionalClass, icon: defaultIcon },
      });
      expect(wrapper.props().additionalClass).toMatch(additionalClass);
    });

    it("props.containerClass when passed", () => {
      const containerClass = "test-container-icon-class";
      const wrapper = shallowMountHelper({
        props: { containerClass, icon: defaultIcon },
      });
      expect(wrapper.props().containerClass).toMatch(containerClass);
    });

    it("props.styles when passed", () => {
      const styles = {
        "some-style": true,
      };
      const wrapper = shallowMountHelper({
        props: { styles, icon: defaultIcon },
      });
      expect(wrapper.props().styles).toEqual(styles);
    });
  });

  it("test icon classes, the additionalClass prop is string", () => {
    const additionalClass = "some-additional-class";
    const wrapper = shallowMountHelper({
      props: { additionalClass, icon: defaultIcon },
    });
    expect(wrapper.find("font-awesome-icon-stub").classes()).toContain(
      additionalClass
    );
  });

  it("test icon classes, the additionalClass prop is an object", () => {
    const additionalClass = {
      "some-additional-class": true,
      "some-class-to-ignore": false,
    };
    const wrapper = shallowMountHelper({
      props: { additionalClass, icon: defaultIcon },
    });
    expect(wrapper.find("font-awesome-icon-stub").classes()).toContain(
      "some-additional-class"
    );
  });

  it("test icon container classes, the containerClass prop is string", () => {
    const containerClass = "some-container-class";
    const wrapper = shallowMountHelper({
      props: { containerClass, icon: defaultIcon },
    });
    expect(wrapper.find("span").classes()).toContain(containerClass);
  });

  it("test icon container classes, the containerClass prop is an object", () => {
    const containerClass = {
      "some-container-class": true,
      "some-class-to-ignore": false,
    };
    const wrapper = shallowMountHelper({
      props: { containerClass, icon: defaultIcon },
    });
    expect(wrapper.find("span").classes()).toContain("some-container-class");
  });
});
