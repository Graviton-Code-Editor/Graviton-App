import * as React from "react";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FakeRoot from "./utils/fake_root";
import FilesystemExplorer from "../src/components/FilesystemExplorer";
import { act } from "@testing-library/react";

describe("<FilesystemExplorer/>", () => {
  jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(200);
  jest.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(200);

  it("readme.md exists", async () => {
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
        expect(screen.getByText("readme.md")).toBeInTheDocument();
      });
    });
  });
});
