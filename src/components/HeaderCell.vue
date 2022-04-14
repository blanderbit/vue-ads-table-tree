<script>
import { h } from "vue";
import AppIcon from "@/components/AppIcon";
import CSSProcessor from "../services/CSSProcessor";
import sortCell from "../mixins/cell/sortCell";

export default {
  name: "VueAdsHeaderCell",

  mixins: [sortCell],

  props: {
    title: {
      type: String,
      default: "",
    },

    column: {
      type: Object,
      default: () => {
        return {
          title: "",
          direction: null,
        };
      },
    },

    columnIndex: {
      type: Number,
      required: true,
    },

    cssProcessor: {
      type: CSSProcessor,
      required: true,
    },
  },

  computed: {
    headerClasses() {
      return Object.assign(
        {
          "vue-ads-cursor-pointer":
            [null, true, false].includes(this.column.direction) &&
            this.sortable,
        },
        this.cssProcessor.process(null, this.columnIndex),
        this.cssProcessor.process(0, this.columnIndex)
      );
    },

    groupIconClasses() {
      if (!this.column.groupable) {
        return {};
      }

      return {
        "vue-ads-ml-2": true,
      };
    },
  },

  render() {
    let headerContent = [
      h(
        "span",
        {
          class: {
            "vue-ads-flex-grow": true,
          },
        },
        [this.title || this.column.title]
      ),
    ];

    if (this.sortable) {
      headerContent.push(this.sortIcon(h));
    }

    if (this.column.groupable && !this.column.grouped) {
      headerContent.push(
        h(AppIcon, {
          namespace: "fa",
          icon: "stream",
          additionalClass: this.groupIconClasses,
          onClick: (event) => {
            event.stopPropagation();
            this.$emit("group", this.column);
          },
        })
      );
    }

    return h(
      "th",
      {
        class: this.headerClasses,
      },
      [
        h(
          "div",
          {
            class: {
              "vue-ads-flex": true,
            },
          },
          [headerContent]
        ),
      ]
    );
  },
};
</script>
