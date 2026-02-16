import { createTheme } from "@mui/material/styles";

export const EDUBA_THEME = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f9ecdf",
      paper: "#ebdfd2",
    },
    primary: {
      main: "#5d3136",
      light: "#916669",
      dark: "#4a0a11",
      contrastText: "#fefbf6",
    },
    secondary: {
      main: "#7d5658",
      light: "#a2777a",
      dark: "#5d3136",
      contrastText: "#fefbf6",
    },
    text: {
      primary: "#5d3136",
      secondary: "#7d5658",
    },
    divider: "rgba(93, 49, 54, 0.32)",
  },
  typography: {
    fontFamily: '"Diatype", "Helvetica Neue", Arial, sans-serif',
    h2: {
      fontFamily: '"Diatype", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1,
    },
    body1: {
      fontFamily: '"Diatype", "Helvetica Neue", Arial, sans-serif',
      lineHeight: 1.3,
    },
    caption: {
      fontFamily: '"IBM Plex Mono", monospace',
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    button: {
      fontFamily: '"IBM Plex Mono", monospace',
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
});
