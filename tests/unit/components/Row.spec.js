import { shallowMount } from "@vue/test-utils";

import Row from "../../../src/components/Row";
import CSSProcessor from "../../../src/services/CSSProcessor";

describe("Row", () => {
  let row;
  let columnA;
  let columnB;
  let cssProcessor;

  beforeEach(() => {
    columnA = {
      property: "firstName",
    };
    columnB = {
      property: "lastName",
    };

    cssProcessor = new CSSProcessor(2, {});
    cssProcessor.totalRows = 1;

    row = shallowMount(Row, {
      props: {
        row: {
          _id: "arne",
          firstName: "Arne",
          lastName: "De Smedt",
          _meta: {},
        },
        columns: [columnA, columnB],
        rowIndex: 0,
        cssProcessor,
      },
    });
  });

  it("generates classes via the row index", async () => {
    cssProcessor = new CSSProcessor(2, {
      "1/": {
        test: true,
      },
    });
    cssProcessor.totalRows = 1;

    await row.setProps({
      cssProcessor,
    });

    expect(row.vm.rowClasses).toEqual({
      test: true,
    });
  });

  it("generates classes via the fixed row classes attribute", async () => {
    await row.setProps({
      row: {
        firstName: "Arne",
        lastName: "De Smedt",
        _classes: {
          row: {
            test: true,
          },
        },
        _meta: {},
      },
    });

    expect(row.vm.rowClasses).toEqual({
      test: true,
    });
  });

  it("selects the correct column slot", async () => {
    await row.setProps({
      slots: {
        firstName: "test",
        lastName: "test2",
      },
    });

    const columnSlotSpy = jest.spyOn(row.vm, "columnSlot");
    row.vm.columnSlot(columnA);
    expect(columnSlotSpy).toHaveBeenCalledWith(columnA);
    expect(columnSlotSpy).toHaveBeenCalledTimes(1);
    expect(columnSlotSpy).toReturnWith("test");
  });

  it("selects the correct cell slot", async () => {
    await row.setProps({
      slots: {
        firstName_arne: "testcell",
        firstName: "test",
      },
    });

    const columnSlotSpy = jest.spyOn(row.vm, "columnSlot");
    row.vm.columnSlot(columnA);
    expect(columnSlotSpy).toHaveBeenCalledWith(columnA);
    expect(columnSlotSpy).toHaveBeenCalledTimes(1);
    expect(columnSlotSpy).toReturnWith("testcell");
  });
});
