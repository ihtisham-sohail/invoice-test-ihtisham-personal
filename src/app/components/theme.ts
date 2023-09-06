import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    regular: "#3498db",
    dark: "#2980b9",
  },
};

const styles = {
  global: {
    "html, body": {
      background: "gray.50",
    },
    th: {
      position: "sticky",
      left: 0,
      top: 0,
      zIndex: 1,
      bg: "white",
    },
    "th:first-child": {
      zIndex: 2,
    },
    "td:first-child": {
      position: "sticky",
      left: 0,
      top: 0,
      zIndex: 1,
      bg: "white",
    },
  },
};

export const theme = extendTheme({ colors, styles });
