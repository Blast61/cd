import React, { useState } from "react";
import Papa from "papaparse";
import { createRoot } from "react-dom/client";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Client from "./Client";

const App = () => {
  const [data, setData] = useState([]);
  const [columnArray, setColumn] = useState([]);
  const [values, setValues] = useState([]);

  const handleFile = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result) {
        const columnArray = [];
        const valuesArray = [];

        result.data.map((d) => {
          columnArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        setData(result.data);
        setColumn(columnArray[0]);
        setValues(valuesArray);
      },
    });
  };

  return (
    <div>
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={handleFile}
        style={{ display: "block", margin: "10px auto" }}
      />

      <br />
      <table
        className="clientData"
        style={{
          borderCollapse: "collapse",
          border: "1px solid black",
          margin: "5px auto",
        }}
      >
        <thead>
          <tr>
            {columnArray.map((col, i) => {
              <th key={i}>{col}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {values.map((v, i) => (
            <tr key={i}>
              {v.map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
