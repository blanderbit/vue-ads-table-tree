import { shallowMount } from "@vue/test-utils";

import HeaderCell from "../../../src/components/HeaderCell";
import CSSProcessor from "../../../src/services/CSSProcessor";

describe("HeaderCell", () => {
  let headerCell;
  let cssProcessor;

  beforeEach(() => {
    cssProcessor = new CSSProcessor(2, {});
    cssProcessor.totalRows = 1;

    headerCell = shallowMount(HeaderCell, {
      props: {
        title: "Title",
        columnIndex: 0,
        cssProcessor,
      },
    });
  });

  it("shows no sort icon if it's not sortable", async () => {
    await headerCell.setProps({
      column: {
        direction: -1,
      },
    });
    expect(headerCell.vm.getSortIcon).toBe("");
  });

  it("shows the sort icon if the column is sortable", async () => {
    await headerCell.setProps({
      sortable: true,
      column: {
        direction: null,
      },
    });

    expect(headerCell.vm.getSortIcon).toBe("sort");
  });

  it("shows the desc sort icon if the column is desc sorted", async () => {
    await headerCell.setProps({
      sortable: true,
      column: {
        direction: false,
      },
    });

    expect(headerCell.vm.getSortIcon).toBe("sort-down");
  });

  it("shows the asc sort icon if the column is asc sorted", async () => {
    await headerCell.setProps({
      sortable: true,
      column: {
        direction: true,
      },
    });

    expect(headerCell.vm.getSortIcon).toBe("sort-up");
  });

  it("adds a cursor pointer if the column is sortable", async () => {
    await headerCell.setProps({
      sortable: true,
      column: {
        direction: null,
      },
    });

    expect(headerCell.vm.headerClasses).toEqual({
      "vue-ads-cursor-pointer": true,
    });
  });

  it("doesn't add a cursor pointer if the column is not sortable", async () => {
    await headerCell.setProps({
      sortable: false,
      column: {
        direction: -1,
      },
    });

    expect(headerCell.vm.headerClasses).toEqual({
      "vue-ads-cursor-pointer": false,
    });
  });

  it("returns the header classes with a column class", async () => {
    cssProcessor = new CSSProcessor(2, {
      "/0": {
        test: true,
      },
    });
    cssProcessor.totalRows = 1;

    await headerCell.setProps({
      cssProcessor,
      column: {
        direction: -1,
      },
    });

    expect(headerCell.vm.headerClasses).toEqual({
      "vue-ads-cursor-pointer": false,
      test: true,
    });
  });

  it("returns the header classes without a column class if they don't match", async () => {
    cssProcessor = new CSSProcessor(2, {
      "/1": {
        test: true,
      },
    });
    cssProcessor.totalRows = 1;

    await headerCell.setProps({
      cssProcessor,
      column: {
        direction: -1,
      },
    });

    expect(headerCell.vm.headerClasses).toEqual({
      "vue-ads-cursor-pointer": false,
    });
  });

  it("returns the header classes with a specific row class", async () => {
    cssProcessor = new CSSProcessor(2, {
      "0/all": {
        test: true,
      },
    });
    cssProcessor.totalRows = 1;

    await headerCell.setProps({
      cssProcessor,
      column: {
        direction: -1,
      },
    });

    expect(headerCell.vm.headerClasses).toEqual({
      "vue-ads-cursor-pointer": false,
      test: true,
    });
  });

  it("emits a sort event if the header cell is clicked", async () => {
    const emittedColumn = {
      direction: false,
    };
    await headerCell.setProps({
      column: emittedColumn,
    });
    await headerCell.trigger("click");
    const emittedEvent = "sort";
    headerCell.vm.$emit(emittedEvent, emittedColumn);
    const onClick = headerCell.emitted(emittedEvent);
    expect(onClick).toBeTruthy();
    expect(onClick[0]).toStrictEqual([emittedColumn]);
    expect(onClick.length).toBe(1);
  });

  it("uses the toggle children icon slot if direction is null", async () => {
    await headerCell.setProps({
      sortable: true,
      column: {
        direction: null,
      },
      sortIconSlot: (props) =>
        `Test ${
          props.direction === null ? "null" : props.direction ? "true" : "false"
        }`,
    });

    expect(headerCell.text()).toContain("Test null");
  });

  it("uses the toggle children icon slot if direction is true", async () => {
    await headerCell.setProps({
      sortable: true,
      column: {
        direction: true,
      },
      sortIconSlot: (props) =>
        `Test ${
          props.direction === null ? "null" : props.direction ? "true" : "false"
        }`,
    });

    expect(headerCell.text()).toContain("Test true");
  });

  it("uses the toggle children icon slot if direction is false", async () => {
    await headerCell.setProps({
      sortable: true,
      column: {
        direction: false,
      },
      sortIconSlot: (props) =>
        `Test ${
          props.direction === null ? "null" : props.direction ? "true" : "false"
        }`,
    });

    expect(headerCell.text()).toContain("Test false");
  });
});
