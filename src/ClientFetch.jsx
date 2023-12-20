import { useEffect, useState } from "react";
import Papa from "papaparse";

const CsvFetcher = () => {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch("/adt-events.csv");
        const text = await response.text();

        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            //sort data in reverse chronological order based on eventData
            const sortedData = results.data.sort(
              (a, b) => new Date(b.eventDate) - new Date(a.eventDate),
            );
            setCsvData(sortedData);
          },
          error: (error) => {
            console.error("Error parsing CSV data:", error.message);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };
    fetchCsvData();
  }, []);
  return (
    <div>
      <h1 className="page-title">Clients</h1>
      <table className="content-table">
        <thead>
          <tr>
            {csvData.length > 0 &&
              Object.keys(csvData[0]).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {csvData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, columnIndex) => (
                <td key={columnIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CsvFetcher;
