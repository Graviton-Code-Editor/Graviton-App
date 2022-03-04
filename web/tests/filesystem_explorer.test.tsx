import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import FakeRoot from "./utils/fake_root";
import FilesystemExplorer from "../src/components/FilesystemExplorer";
import { act } from "@testing-library/react";
import { test, describe, expect, vi } from "vitest";

vi.mock("react-virtualized-auto-sizer", () => {
  return {
    default: ({ children }) => children({ height: 200, width: 200 }),
  };
});

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
      await waitFor(() => {
        expect(screen.getByText("readme.md"));
      });
    });
  });
});
