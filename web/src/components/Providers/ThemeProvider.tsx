import { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";

const theme = {
  tones: {
    dark1: "#191919",
    dark2: "#222222",
  },
  elements: {
    terminal: {
      background: "#191919",
    },
    titleBar: {
      background: "#191919",
      controls: {
        color: "white",
        background: "transparent",
        hover: {
          background: "#2d2d2d",
          closeButton: {
            background: "red",
            color: "white",
          },
        },
      },
    },
    textEditor: {
      background: "transparent",
      color: "#f8f8f2",
      activeLine: {
        background: "rgba(255, 255, 255, 0.1)",
      },
      variable: {
        color: "#ca9feb",
      },
      keyword: {
        color: "#9969ff",
      },
      def: {
        color: "#ff6666",
      },
      string: {
        color: "#a5e572",
      },
      property: {
        color: "#69a5ff",
      },
      number: {
        color: "#bd93f9",
      },
      atom: {
        color: "#fdbd5d",
      },
      comment: {
        color: "#858a99",
      },
      gutters: {
        background: "#191919",
        gutter: {
          color: "#6d8a88",
          active: {
            color: "rgb(255,255,255)",
          },
        },
      },
      matchingBracket: {
        background: "rgba(255, 255, 255, 0.2)",
      },
      selection: {
        background: "rgba(255, 255, 255, 0.1)",
      },
    },
    card: {
      background: "rgb(30, 30, 30);",
      hover: {
        border: "rgb(70, 70, 70);",
      },
      focus: {
        border: "rgb(95, 95, 95);",
      },
    },
    primaryButton: {
      background: "#222222",
      color: "rgb(255,255,255)",
    },
    secondaryButton: {
      background: "#2c2c2c",
      color: "rgb(255,255,255)",
      hover: {
        background: "#3a3a3a",
        border: "rgb(70, 70, 70)",
      },
      focus: {
        border: "rgb(95, 95, 95)",
      },
    },
    windowButton: {
      background: "#242424",
      color: "rgb(255,255,255)",
      hover: {
        background: "#2a2a2a",
      },
    },
    primaryTitle: {
      color: "rgb(255,255,255)",
    },
    link: {
      color: "rgb(200, 200, 200)",
      hover: {
        color: "rgb(180, 180, 180)",
      },
    },
    list: {
      item: {
        color: "rgb(255,255,255)",
      },
    },
    contextMenu: {
      background: "rgb(40, 40, 40)",
      menus: {
        hover: {
          background: "rgb(55, 55, 55)",
        },
      },
    },
    prompt: {
      option: {
        background: "transparent",
        hover: {
          background: "rgb(40,40,40)",
          border: "rgb(55, 55, 55)",
        },
        selected: {
          background: "rgb(40,40,40)",
          border: "rgb(55, 55, 55)",
        },
      },
      container: {
        border: "#222222",
        background: "#191919",
      },
      input: {
        background: "rgb(40,40,40)",
        color: "white",
      },
    },
    tab: {
      list: {
        background: "#222222",
      },
      button: {
        hover: {
          background: "#2e2e2e",
        },
        indicator: {
          fill: "rgb(255,255,255)",
          hover: {
            fill: "rgb(180,180,180)",
          },
          focus: {
            border: "rgb(70, 70, 70);",
          },
        },
        focused: {
          background: "#191919",
          border: "rgb(150,150,150)",
        },
      },
      container: {
        background: "#191919",
      },
      text: {
        color: "rgb(255,255,255)",
        unfocused: {
          color: "rgb(185,185,185)",
        },
      },
      unSavedIndicator: {
        background: "rgb(255,255,255)",
      },
    },
    view: {
      background: "#222222",
    },
    explorer: {
      item: {
        arrow: {
          fill: "rgba(255, 255, 255)",
        },
        background: "transparent",
        text: {
          color: "white",
        },
        hover: {
          background: "rgba(150,150,150,0.3)",
        },
        selected: {
          background: "rgba(150,150,150,0.3)",
        },
      },
    },
    notification: {
      background: "rgb(35, 35, 35);",
      text: {
        color: "white",
      },
      close: {
        fill: "white",
        hover: {
          fill: "rgb(180,180,180)",
        },
      },
    },
    sidepanel: {
      border: {
        color: "rgba(48, 48, 48)",
      },
    },
    sidebar: {
      border: {
        color: "rgba(48, 48, 48)",
      },
      button: {
        background: "transparent",
        fill: "white",
        hover: {
          background: "rgb(40,40,40)",
          border: "rgb(70, 70, 70)",
        },
        focus: {
          border: "rgb(95, 95, 95)",
        },
        selected: {
          background: "rgb(50,50,50)",
        },
      },
    },
    statusbar: {
      background: "#191919",
      item: {
        color: "rgb(255,255,255)",
        hover: {
          background: "rgb(80, 80, 80)",
        },
      },
    },
    routedSideBar: {
      button: {
        background: "#222222",
        hover: {
          background: "#2c2c2c",
          border: "rgb(70, 70, 70)",
        },
        focus: {
          border: "rgb(95, 95, 95)",
        },
      },
    },
  },
};

function Theme({ children }: PropsWithChildren<any>) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Theme;
