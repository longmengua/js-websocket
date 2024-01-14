import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ReduxStore } from "./redux";

import { LoginPage } from "./pages/LoginPage";
import NotFound from "./pages/NotFoundPage";
import { IMPage } from "./pages/IMPage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
    // loader: rootLoader,
    children: [],
  },
  {
    path: "/",
    element: <LoginPage />,
    // loader: rootLoader,
    // children: [],
  },
  {
    path: "/im",
    element: <IMPage />,
    // loader: rootLoader,
    // children: [],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={ReduxStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
