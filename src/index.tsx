import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { I18nextProvider } from "react-i18next";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Spin } from "antd";
// import "services/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      retry: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <React.Suspense fallback={<h1 className="text-blue-700 flex justify-center items-center h-full "><Spin spinning={true} tip={"Verifying"} /></h1>}>
      <BrowserRouter children={<App />} />
    </React.Suspense>
  </QueryClientProvider>
  //  </React.StrictMode>
);
