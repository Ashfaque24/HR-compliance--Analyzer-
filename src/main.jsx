import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./styles/theme";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App/>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
