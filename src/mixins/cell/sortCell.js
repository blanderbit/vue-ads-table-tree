import AppIcon from "@/components/AppIcon";

export default {
  props: {
    sortIconSlot: {
      type: Function,
      default: null,
    },
  },

  computed: {
    sortable() {
      return [null, true, false].includes(this.column.direction);
    },

    getSortIcon() {
      if (!this.sortable) {
        return "";
      }

      if (this.column.direction === null) {
        return "sort";
      }

      if (this.column.direction === false) {
        return "sort-down";
      }

      if (this.column.direction === true) {
        return "sort-up";
      }
    },
  },

  methods: {
    sortIcon(h) {
      let iconNode = this.sortIconSlot
        ? this.sortIconSlot({
            direction: this.column.direction,
          })
        : h(AppIcon, {
            namespace: "fa",
            icon: this.getSortIcon,
            additionalClass: "vue-ads-ml-2",
          });

      return h(
        "span",
        {
          onClick: (event) => {
            event.stopPropagation();
            this.$emit("sort", this.column);
          },
        },
        [iconNode]
      );
    },
  },
};
