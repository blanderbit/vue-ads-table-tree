<script>
import { h } from "vue";
import AppIcon from "@/components/AppIcon";

export default {
  name: "VueAdsChildrenButton",
  props: {
    expanded: {
      type: Boolean,
      required: true,
    },

    loading: {
      type: Boolean,
      required: true,
    },

    iconSlot: {
      type: Function,
      default: null,
    },
  },

  computed: {
    classes() {
      return {
        "vue-ads-pr-2": true,
        "vue-ads-cursor-pointer": true,
      };
    },

    childrenButtonIcon() {
      if (this.loading) {
        return "ellipsis-h";
      }
      return this.expanded ? "minus-square" : "plus-square";
    },
  },

  render() {
    if (this.iconSlot) {
      return h("span", {}, [
        this.iconSlot({
          expanded: this.expanded,
          loading: this.loading,
        }),
      ]);
    }

    return h(AppIcon, {
      namespace: "fa",
      icon: this.childrenButtonIcon,
      additionalClass: this.classes,
    });
  },
};
</script>
