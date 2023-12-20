import { Fragment, useEffect, useState } from "react";
import Papa from "papaparse";
import { groupBy } from "./utils/group";

const CsvFetcher = () => {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch("/resources/adt-events.csv");
        const text = await response.text();

        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            //sort data in reverse chronological order based on eventData
            const sortedData = results.data.sort(
              (a, b) => new Date(b.eventDate) - new Date(a.eventDate),
            );
            //group data based on first/last name
            const groupedData = groupBy(
              sortedData,
              (row) => `${row.firstName}_${row.lastName}`,
            );

            //Ensure the most recent event for each person is displayed in case of altering dates of the duplicates
            const reducedData = Object.values(groupedData).map((group) =>
              group.reduce((prev, current) =>
                new Date(prev.eventDate) > new Date(current.eventDate)
                  ? prev
                  : current,
              ),
            );

            //Add an indicator to id rows with duplicates
            const clientDuplicates = reducedData.map((row) => ({
              ...row,
              hasDuplicates:
                groupBy(
                  sortedData,
                  (item) => `${item.firstName}_${item.lastName}`,
                )[`${row.firstName}_${row.lastName}`]?.length > 1,
            }));

            setCsvData(clientDuplicates);
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

  const toggleRow = (nameKey) => {
    setCsvData((prevData) =>
      prevData.map((row) =>
        `${row.firstName}_${row.lastName}` === nameKey
          ? { ...row, expanded: !row.expanded }
          : row,
      ),
    );
  };

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {csvData.map((row, rowIndex) => (
            <Fragment key={rowIndex}>
              <tr>
                {Object.values(row).map((value, columnIndex) => (
                  <td key={columnIndex}>{value}</td>
                ))}
                <td>
                  {row.hasDuplicates && (
                    <button
                      onClick={() =>
                        toggleRow(`${row.firstName}_${row.lastName}`)
                      }
                    >
                      {row.expanded ? "(-)" : "(+)"}
                    </button>
                  )}
                </td>
              </tr>
              {row.expanded &&
                csvData
                  .filter(
                    (subRow) =>
                      `${subRow.firstName}_${subRow.lastName}` ===
                      `${row.firstName}_${row.lastName}`,
                  )
                  .map((subRow, subRowIndex) => (
                    <tr key={`sub_${subRowIndex}`}>
                      {Object.values(subRow).map((value, columnIndex) => (
                        <td key={columnIndex}>{value}</td>
                      ))}
                      <td></td>
                    </tr>
                  ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CsvFetcher;
