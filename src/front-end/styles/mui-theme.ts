import { createMuiTheme } from "@material-ui/core/styles";
import { C } from "front-end/styles/C";

export const muiTheme = createMuiTheme({
  palette: {
    common: {
      black: "#000",
      white: "#f2f2f2"
    },
    primary: {
      light: "#C3DCFA",
      main: "#60A5FA",
      dark: "#2886FA"
    },
    secondary: {
      light: "#0066ff",
      main: "#f2f2f2",
      dark: "#f2f2f2",
      contrastText: "#fff"
    },
    error: {
      light: "#FCD0D0",
      main: "#f24545",
      dark: "#f24545"
    },
    success: {
      light: "#DDF9F5",
      main: "#4CBFAC",
      dark: "#0C6761"
    },
    warning: {
      light: "#FFF1E2",
      main: "#FE8A13",
      dark: "#6B410C"
    },
    info: {
      light: "#DDF7FF",
      main: "#2BC4F3",
      dark: "#0C3F67"
    },
    contrastThreshold: 3
  },
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif`
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none"
      }
    },
    MuiTypography: {
      h1: {
        color: C.text_primary,
        fontWeight: 800,
        fontSize: "48px"
      },
      h2: {
        color: C.text_primary,
        fontWeight: 600,
        fontSize: "36px"
      },
      h3: {
        color: C.text_primary,
        fontWeight: 500
      },
      h4: {
        color: C.text_primary,
        fontWeight: 400
      },
      h5: {
        color: C.text_primary,
        fontWeight: 300
      },
      h6: {
        color: C.text_primary,
        fontWeight: 300
      },
      body1: {
        color: C.text_primary
      },
      body2: {
        color: C.text_secondary
      },
      caption: {
        color: "#fff"
      },
      button: {
        color: "#00ff00"
      }
    },
    MuiLink: {
      root: {
        color: C.text_secondary,
        cursor: "pointer"
      }
    },
    MuiOutlinedInput: {
      root: {
        backgroundColor: "white"
      }
    },
    MuiInputAdornment: {
      root: {}
    }
  }
});
