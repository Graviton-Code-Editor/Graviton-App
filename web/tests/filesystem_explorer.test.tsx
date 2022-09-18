import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import FakeRoot from "./utils/fake_root";
import FilesystemExplorer, {
  TreeItem,
} from "../src/modules/side_panels/explorer/components/FilesystemExplorer";
import { describe, expect, test, vi } from "vitest";
import { useState } from "react";

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
  })),
);

const folders = [
  { path: "\\", filesystem: "local" },
];

function ExplorerWrapper(){
  const [tree, setTree] = useState<TreeItem>({
    name: "/",
    isFile: false,
    items: {},
  });
  return (
    <FakeRoot>
      <FilesystemExplorer
        folders={folders}
        onSelected={() => {}}
        tree={tree}
        saveTree={(t) => setTree(t)}
      />
    </FakeRoot>
  );
}

describe("<FilesystemExplorer/>", () => {
  test("readme.md exists", async () => {
    act(() => {
      render(<ExplorerWrapper/>);
    });

    await act(async () => {
      expect(screen.queryAllByText("readme.md")).toHaveLength(0);
    });
    await act(async () => {
      expect(screen.getByText("readme.md")).toBeDefined();
    });
  });
});
