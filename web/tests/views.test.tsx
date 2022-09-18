import { act, renderHook, RenderHookResult } from "@testing-library/react";
import FakeRoot from "./utils/fake_root";
import { beforeAll, describe, expect, test } from "vitest";
import { useViews, useTabs } from "../src/hooks";
import { useRecoilValue } from "recoil";
import { Tab } from "../src/features";
import { TextEditorTab } from "../src/modules/tabs";
import { openedViewsAndTabs, Views } from "../src/state/views_tabs";

interface HookResult extends ReturnType<typeof useViews>  {
  views: Views<Tab>[];
  openTab: (newTab: Tab) => void;
}

describe("Views, ViewPanels and Tabs", () => {
  let hook: RenderHookResult<HookResult, any>;

  beforeAll(() => {
    hook = renderHook(() => {
      return { views: useRecoilValue(openedViewsAndTabs), ...useViews(), openTab: useTabs().openTab };
    }, {
      wrapper: FakeRoot,
    });
  });

  test("Create and close 2 view", async () => {

    //  [     1     ]
    expect(hook.result.current.views).toHaveLength(1);

    act(() => {
      hook.result.current.newViewInFocused();
    });

    act(() => {
      hook.result.current.newViewInFocused();
    });

    //  [  1  |  2  ]
    expect(hook.result.current.views).toHaveLength(3);

    act(() => {
      hook.result.current.closeFocusedView();
    });
    act(() => {
      hook.result.current.closeFocusedView();
    });
    

    //  |     1     |
    expect(hook.result.current.views).toHaveLength(1);
  });

  test("Create and close 2 view panels", async () => {

    //  |     1     |
    expect(hook.result.current.views).toHaveLength(1);
    expect(hook.result.current.views[0].view_panels).toHaveLength(1);

    // Split 2 times vertically
    act(() => {
      hook.result.current.newViewPanelInFocused();
      hook.result.current.newViewPanelInFocused();
    });

    //  |     1     |
    //  |-----------|
    //  |     2     |
    //  |-----------|
    //  |     3     |
    expect(hook.result.current.views).toHaveLength(1);
    expect(hook.result.current.views[0].view_panels).toHaveLength(3);

    // Close the last 2 view panels created from before
    act(() => {
      hook.result.current.closeFocusedViewPanel();
    });
    act(() => {
      hook.result.current.closeFocusedViewPanel();
    });

    //  |     1     |
    expect(hook.result.current.views).toHaveLength(1);
    expect(hook.result.current.views[0].view_panels).toHaveLength(1);
  });

  test("Not close a view panel with edited tabs", async () => {

    //  |     1     |
    expect(hook.result.current.views).toHaveLength(1);
    expect(hook.result.current.views[0].view_panels).toHaveLength(1);

    // Split 1 time vertically
    act(() => {
      hook.result.current.newViewPanelInFocused();
    });

    //  |     1     |
    //  |-----------|
    //  |     2     |
    expect(hook.result.current.views).toHaveLength(1);
    expect(hook.result.current.views[0].view_panels).toHaveLength(2);

    // Open a fake edited file
    act(() => {
      const textTab = new TextEditorTab("readme.md", "/readme.md", Promise.resolve("Hello World"), "Unknown") as unknown as Tab;
      textTab.edited = true;
      hook.result.current.openTab(textTab)
    });

    // Try to close the last view panel created from before
    act(() => {
      const canBeClosed = hook.result.current.closeFocusedViewPanel();
      expect(canBeClosed).toEqual(false);
    });

    //  |     1     |
    //  |-----------|
    //  |     2     |
    expect(hook.result.current.views).toHaveLength(1);
    expect(hook.result.current.views[0].view_panels).toHaveLength(2);
  });
});
