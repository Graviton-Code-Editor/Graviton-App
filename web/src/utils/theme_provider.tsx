import { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";

const theme = {
  tones: {
    dark1: "#191919",
    dark2: "#222222",
  },
  elements: {
    textEditor: {
      background: "transparent",
      color: "#f8f8f2",
      activeLine: {
        background: "rgba(255, 255, 255, 0.1)",
      },
      variable: {
        color: "#fdbd5d",
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
    primaryButton: {
      background: "#222222",
      color: "rgb(255,255,255)",
    },
    primaryButtonBordered: {
      background: "#2c2c2c",
      color: "rgb(255,255,255)",
      hover: {
        background: "#3a3a3a",
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
    prompt: {
      option: {
        background: "transparent",
        hover: {
          background: "rgb(40,40,40)",
        },
        selected: {
          background: "rgb(40,40,40)",
        },
      },
      container: {
        border: "#222222",
        background: "#191919",
      },
    },
    tab: {
      list: {
        background: "#222222",
      },
      button: {
        fill: "rgb(255,255,255)",
        hover: {
          fill: "rgb(180,180,180)",
        },
        focused: {
          background: "#191919",
        },
      },
      container: {
        background: "#191919",
      },
      text: {
        color: "rgb(255,255,255)",
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
    sidebar: {
      button: {
        background: "transparent",
        fill: "white",
        hover: {
          background: "rgb(40,40,40)",
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
  },
};

function Theme({ children }: PropsWithChildren<any>) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Theme;
