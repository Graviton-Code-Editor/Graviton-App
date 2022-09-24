import { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "themes/dark";

function Theme({ children }: PropsWithChildren<any>) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}

export default Theme;
