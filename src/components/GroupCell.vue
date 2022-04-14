<script>
import cell from "../mixins/cell/cell";
import sortCell from "../mixins/cell/sortCell";
import { h } from "vue";
import AppIcon from "@/components/AppIcon";

export default {
  name: "VueAdsGroupCell",

  mixins: [cell, sortCell],

  computed: {
    containerClasses() {
      return {
        "vue-ads-flex": true,
      };
    },

    groupTitleClasses() {
      return Object.assign(this.titleClasses, {
        "vue-ads-flex-grow": true,
      });
    },

    disableGroupIconClasses() {
      return {
        "vue-ads-m-auto": true,
        "vue-ads-cursor-pointer": true,
      };
    },

    disableGroupClickEvents() {
      return {
        click: this.disableGroup,
      };
    },
  },

  methods: {
    disableGroup(event) {
      event.stopPropagation();
      this.$emit("disable-group", this.column);
    },

    groupValue(h) {
      let elements = this.value(h);

      if (this.sortable) {
        elements.push(this.sortIcon(h));
      }

      return elements;
    },
  },

  render() {
    return h(
      "td",
      {
        class: this.cellClasses,
        style: this.style,
      },
      [
        h(
          "div",
          {
            class: this.containerClasses,
          },
          [
            h(
              "span",
              {
                class: this.groupTitleClasses,
                onClick: this.clickEvents,
              },
              [this.groupValue(h)]
            ),
            h(AppIcon, {
              namespace: "fa",
              icon: "times-circle",
              additionalClass: this.disableGroupIconClasses,
              onClick: this.disableGroupClickEvents,
            }),
          ]
        ),
      ]
    );
  },
};
</script>
