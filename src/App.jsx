import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import CsvFetcher from "./ClientFetch";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Client from "./Client";

const App = () => {
  return (
    <div>
      <h1>App</h1>
      <CsvFetcher />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
