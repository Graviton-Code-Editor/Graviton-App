import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { ITheme, Terminal } from "xterm";
import { TerminalShellBuilderInfo } from "../../services/clients/client.types";
import { clientState } from "../../state/state";
import { TerminalShellUpdated } from "../../types/messaging";
import { newId } from "../../utils/id";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";
import styled, { ThemeContext } from "styled-components";
import { TerminalData } from "../../tabs/terminal/terminal";
import { TerminalShellPicker } from "./ShellPicker";

const StyledTerminalContainer = styled.div`
  height: 100%;
  padding: 18px;
  & > div {
    height: calc(100% - 9px);
  }
`;

interface TerminalTabOptions extends TerminalData {
  saveTerminal: (
    data: TerminalData,
  ) => void;
}

export function TerminalTabContainer(
  { saveTerminal, terminal, id, fit }: TerminalTabOptions,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setMounted] = useState(false);
  const [terminalBuilders, setTerminalBuilders] = useState<
    TerminalShellBuilderInfo[]
  >([]);
  const client = useRecoilValue(clientState);
  const themeContext = useContext(ThemeContext);

  // Load registered Shell builders
  useEffect(() => {
    client.get_terminal_shell_builders().then((list) => {
      if (list.Ok) {
        setTerminalBuilders(list.Ok);
      }
    });
  }, []);

  // Handle read and write events
  useEffect(() => {
    if (terminal && id && isMounted && containerRef.current) {
      // Render latest changes from the shell
      /* eslint-disable no-inner-declarations */
      function shellListener(ev: TerminalShellUpdated) {
        if (ev.terminal_shell_id === id) {
          terminal?.write(ev.data);
        }
      }

      client.on("TerminalShellUpdated", shellListener);

      // Write to the shell
      const dataListener = terminal.onData(async (data) => {
        await client.write_to_terminal_shell(id, data);
      });

      // Resize the shell when the terminal is resized
      const resizeListener = terminal.onResize(async ({ cols, rows }) => {
        console.log(cols, rows)
        await client.resize_terminal_shell(id, cols, rows);
      });

      const resizeObserver = new ResizeObserver(() => {
        fit?.fit();
      });

      // Fit the terminal when the container is resized
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();

        dataListener.dispose();
        resizeListener.dispose();
        client.off("TerminalShellUpdated", shellListener);
      };
    }
  }, [isMounted, containerRef.current, fit]);

  // Render the terminal when mounted
  useEffect(() => {
    if (!isMounted && containerRef.current) {
      terminal?.open(containerRef.current);
      setTimeout(() => {
        fit?.fit();
      }, 1);
      setMounted(true);
    }
  }, [terminal, containerRef.current, fit]);

  // Create a terminal shell from a builder
  async function createTerminal(builder_id: string) {
    const id = newId();
    await client.create_terminal_shell(builder_id, id);

    const terminal = new Terminal({
      windowsMode: true,
      fontFamily: "JetBrains Mono",
      theme: themeForTerminal(themeContext),
    });
    const fit = new FitAddon();
    terminal.loadAddon(fit);

    saveTerminal({ terminal, id, fit });
  }

  return (
    terminal
      ? (
        <StyledTerminalContainer>
          <div ref={containerRef} />
        </StyledTerminalContainer>
      )
      : (
        <TerminalShellPicker
          terminalBuilders={terminalBuilders}
          selectBuilder={createTerminal}
        />
      )
  );
}

function themeForTerminal(themeContext: any): ITheme {
  return {
    background: themeContext.elements.terminal.background,
  };
}
