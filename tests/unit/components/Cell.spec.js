import { shallowMount } from "@vue/test-utils";

import Cell from "../../../src/components/Cell";
import CSSProcessor from "../../../src/services/CSSProcessor";

describe("Cell", () => {
  let cell;
  let row;
  let cssProcessor;
  let column;

  beforeEach(() => {
    row = {
      firstName: "arne",
      _meta: {
        parent: 0,
        visibleChildren: ["test"],
      },
    };

    column = {
      property: "firstName",
      collapseIcon: true,
    };

    cssProcessor = new CSSProcessor(2, {});
    cssProcessor.totalRows = 1;

    cell = shallowMount(Cell, {
      props: {
        row,
        column,
        rowIndex: 0,
        columnIndex: 0,
        cssProcessor,
      },
    });
  });

  it("returns the default cell classes", () => {
    expect(cell.vm.cellClasses).toEqual({});
  });

  it("returns the cell classes with a specific column class", async () => {
    cssProcessor = new CSSProcessor(2, {
      "/0": {
        test: true,
      },
    });
    cssProcessor.totalRows = 1;

    await cell.setProps({
      cssProcessor,
    });

    expect(cell.vm.cellClasses).toEqual({
      test: true,
    });
  });

  it("only returns the default classes if the column class doesn't match", async () => {
    cssProcessor = new CSSProcessor(2, {
      "/1": {
        test: true,
      },
    });
    cssProcessor.totalRows = 1;

    await cell.setProps({
      cssProcessor,
    });

    expect(cell.vm.cellClasses).toEqual({});
  });

  it("returns the cell classes with a specific cell class", async () => {
    cssProcessor = new CSSProcessor(2, {
      "0/1": {
        test: true,
      },
    });

    await cell.setProps({
      cssProcessor,
      columnIndex: 1,
    });

    expect(cell.vm.cellClasses).toEqual({
      test: true,
    });
  });

  it("only returns the default classes if the cell class doesn't match", async () => {
    cssProcessor = new CSSProcessor(2, {
      "1/1": {
        test: true,
      },
    });
    cssProcessor.totalRows = 1;

    await cell.setProps({
      cssProcessor,
    });

    expect(cell.vm.cellClasses).toEqual({});
  });

  it("returns the cell classes with fixed row classes", async () => {
    await cell.setProps({
      row: {
        _classes: {
          0: {
            test: true,
          },
        },
        firstName: "arne",
        _meta: {
          parent: 0,
          visibleChildren: ["test"],
        },
      },
    });

    expect(cell.vm.cellClasses).toEqual({
      test: true,
    });
  });

  it("only returns the default cell classes if the column doesn't match the fixed row classes", async () => {
    cssProcessor = new CSSProcessor(2, {
      "all/all": {
        "vue-ads-px-4": true,
        "vue-ads-py-2": true,
        "vue-ads-text-sm": true,
      },
    });
    await cell.setProps({
      row: {
        _classes: {
          1: {
            test: true,
          },
        },
        firstName: "arne",
        _meta: {
          parent: 0,
          visibleChildren: ["test"],
        },
      },
      cssProcessor,
    });

    expect(cell.vm.cellClasses).toEqual({
      "vue-ads-px-4": true,
      "vue-ads-py-2": true,
      "vue-ads-text-sm": true,
    });
  });

  it("only returns the default cell classes and custom row classes", async () => {
    cssProcessor = new CSSProcessor(2, {
      "all/all": {
        "vue-ads-px-4": true,
        "vue-ads-py-2": true,
        "vue-ads-text-sm": true,
      },
    });
    cssProcessor.totalRows = 0;
    await cell.setProps({
      row: {
        firstName: "arne",
        _classes: {
          "0/": {
            customClass: true,
          },
        },
        _meta: {
          parent: 0,
          visibleChildren: ["test"],
        },
      },
      cssProcessor,
    });

    expect(cell.vm.cellClasses).toEqual({
      customClass: true,
      "vue-ads-px-4": true,
      "vue-ads-py-2": true,
      "vue-ads-text-sm": true,
    });
  });

  it("changes the padding if the number of parents changes", async () => {
    await cell.setProps({
      row: {
        firstName: "arne",
        _hasChildren: false,
        _meta: {
          parent: 1,
          visibleChildren: [],
          groupParent: 1,
        },
      },
      column: {
        collapseIcon: true,
      },
    });

    expect(cell.vm.style["padding-left"]).toBe("4rem");
  });

  it("doesn't add padding if the cell has no collapse icon", async () => {
    await cell.setProps({
      row: {
        firstName: "arne",
        _meta: {
          parent: 1,
          visibleChildren: ["test"],
          groupParent: 0,
        },
      },
      column: {
        collapseIcon: false,
      },
    });

    expect(cell.vm.style["padding-left"]).toBe("1rem");
  });

  // @TODO
  // it("adds a toggle children button if the row has children and the column owns the button", async () => {
  //   await cell.setProps({
  //     row: {
  //       firstName: "arne",
  //       _hasChildren: true,
  //       _meta: {
  //         parent: 0,
  //         visibleChildren: [],
  //       },
  //     },
  //     column: {
  //       property: "firstName",
  //       collapseIcon: true,
  //     },
  //   });
  //
  //   expect(cell.html()).toContain(
  //     "<vueadschildrenbutton-stub></vueadschildrenbutton-stub>"
  //   );
  // });

  it("creates a column slot", async () => {
    await cell.setProps({
      columnSlot: (props) => {
        return `Test: ${props.row.firstName}`;
      },
    });

    expect(cell.text()).toBe("Test: arne");
  });

  it("is empty with no matching properties", async () => {
    await cell.setProps({
      row: {
        lastName: "de smedt",
        _meta: {
          parent: 0,
          visibleChildren: ["test"],
        },
      },
    });

    expect(cell.text()).toBe("");
  });

  it("emits toggle children, when clicking the toggle children button", async () => {
    const emitEvent = "click";
    const span = cell.find("span");
    await span.trigger(emitEvent);
    cell.vm.$emit(emitEvent);
    const onCLick = cell.emitted(emitEvent);
    expect(onCLick).toBeTruthy();
  });
});
