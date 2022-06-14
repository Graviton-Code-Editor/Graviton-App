import { act, renderHook, RenderHookResult } from "@testing-library/react";
import FakeRoot from "./utils/fake_root";
import { beforeAll, describe, expect, test } from "vitest";
import useViews from "../src/hooks/useViews";
import { useRecoilValue } from "recoil";
import { openedViewsAndTabs } from "../src/utils/state";
import { TabsViews } from "../src/utils/state/tabs";
import { Tab } from "../src/modules/tab";
import useTabs from "../src/hooks/useTabs";
import TextEditorTab from "../src/tabs/text_editor/text_editor";

interface HookResult extends ReturnType<typeof useViews>, ReturnType<typeof useTabs>  {
  views: TabsViews<Tab>[];
}

describe("Views, ViewPanels and Tabs", () => {
  let hook: RenderHookResult<HookResult, any>;

  beforeAll(() => {
    hook = renderHook(() => {
      return { views: useRecoilValue(openedViewsAndTabs), ...useViews(), ...useTabs() };
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
    expect(hook.result.current.views[0]).toHaveLength(1);

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
    expect(hook.result.current.views[0]).toHaveLength(3);

    // Close the last 2 view panels created from before
    act(() => {
      hook.result.current.closeFocusedViewPanel();
    });
    act(() => {
      hook.result.current.closeFocusedViewPanel();
    });

    //  |     1     |
    expect(hook.result.current.views).toHaveLength(1);
    expect(hook.result.current.views[0]).toHaveLength(1);
  });

  test("Not close a view panel with edited tabs", async () => {

    //  |     1     |
    expect(hook.result.current.views).toHaveLength(1);
    expect(hook.result.current.views[0]).toHaveLength(1);

    // Split 1 time vertically
    act(() => {
      hook.result.current.newViewPanelInFocused();
    });

    //  |     1     |
    //  |-----------|
    //  |     2     |
    expect(hook.result.current.views).toHaveLength(1);
    expect(hook.result.current.views[0]).toHaveLength(2);

    // Open a fake edited file
    act(() => {
      const textTab = new TextEditorTab("readme.md", "/readme.md", Promise.resolve("Hello World"), "Unknown");
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
    expect(hook.result.current.views[0]).toHaveLength(2);
  });
});
