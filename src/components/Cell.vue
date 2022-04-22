<script>
import cell from "../mixins/cell/cell";
import { h } from "vue";

export default {
  name: "VueAdsCell",

  mixins: [cell],

  render() {
    return h(
      "td",
      {
        class: this.cellClasses,
        style: this.style,
      },
      [
        h(
          "span",
          {
            class: this.titleClasses,
            onClick: this.clickEvents,
          },
          [this.value(h)]
        ),
      ]
    );
  },
};
</script>

<style scoped>
td.selectedAndExactMatch {
  background-color: #eff8c7;
}
</style>
