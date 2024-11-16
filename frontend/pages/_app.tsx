import * as React from "react";
import { AppProps } from "next/app";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
        background: {
            default: "#f5f5f5",
        },
    },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalize styles across browsers */}
        <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
