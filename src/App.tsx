import { createRoot } from "react-dom/client";
import CsvFetcher from "./CsvFetcher";

const App = () => {
  return (
    <div>
      <CsvFetcher />
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Root not found");
}
