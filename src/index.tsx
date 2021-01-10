import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@material-ui/core/styles";
import { App } from "front-end/features/App";
import store from "front-end/features/redux";
import reportWebVitals from "front-end/reportWebVitals";
import { muiTheme } from "front-end/styles/mui-theme";

export const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider theme={muiTheme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
