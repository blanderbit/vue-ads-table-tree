<template>
  <span
    class="icon"
    :class="[containerClass]"
    :title="title"
    :aria-hidden="hidden"
  >
    <font-awesome-icon
      :icon="[namespace, icon]"
      :class="[additionalClass, 'app-icon']"
      :style="styles"
      :spin="isSpin"
    />
    <slot></slot>
  </span>
</template>

<script>
import { FontAwesomeIcon } from "@/plugins/font-awesome";

export default {
  name: "AppIcon",
  components: { FontAwesomeIcon },
  props: {
    namespace: {
      type: String,
      default: "fas",
      note: "Default namespace",
    },
    icon: {
      type: String,
      required: true,
      note: 'the name of the fontAwesome icon to display ie. "cross" for "fa-cross"',
    },
    hidden: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    additionalClass: {
      type: [String, Object],
      default: "",
    },
    containerClass: {
      type: [String, Object],
      default: "",
    },
    styles: {
      type: Object,
      default: () => {},
    },
    isSpin: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
