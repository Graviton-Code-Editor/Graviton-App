import * as React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import FakeRoot from "./utils/fake_root";
import FilesystemExplorer from "../src/components/FilesystemExplorer";
import { test, describe, expect, vi } from "vitest";

global.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("react-virtualized-auto-sizer", () => {
  return {
    default: ({ children }) => children({ height: 200, width: 200 }),
  };
});

vi.stubGlobal(
  "XMLHttpRequest",
  vi.fn(() => ({
    open: vi.fn(),
    send: vi.fn(),
    setRequestHeader: vi.fn(),
  }))
);

describe("<FilesystemExplorer/>", () => {
  test("readme.md exists", async () => {
    act(() => {
      render(
        <FakeRoot>
          <FilesystemExplorer
            initialRoute="/tests"
            onSelected={() => {}}
            filesystem_name="local"
          />
        </FakeRoot>
      );
    });

    await act(async () => {
      expect(screen.queryAllByText("readme.md")).toHaveLength(0);
    });
    await act(async () => {
      expect(screen.getByText("readme.md")).toBeDefined();
    });
  });
});
