import { Fragment, useEffect, useState, ReactElement } from "react";
import Papa from "papaparse";
import { groupBy } from "./utils/group";
import { CsvRow } from "./types/types";
const CsvFetcher = (): ReactElement => {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);

  useEffect(() => {
    const fetchCsvData = async (): Promise<void> => {
      try {
        const response = await fetch("/resources/adt-events.csv");
        const text = await response.text();

        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const parseDate = (dateString: string): Date => {
              const [month, day, year] = dateString.split("/");
              return new Date(`${year}-${month}-${day}`);
            };
            //sort data in reverse chronological order based on eventData
            const sortedData = (results.data as CsvRow[]).sort((a, b) => {
              const dateA = parseDate(a.eventDate).getTime();
              const dateB = parseDate(b.eventDate).getTime();

              if (dateA < dateB) {
                return 1; //Swap position in the array
              } else if (dateA > dateB) {
                return -1; //Keep positions as is
              } else {
                return 0; //Dates are equal, positions stay the same
              }
            });
            //group data based on first/last name
            const groupedData = groupBy(
              sortedData,
              (row: CsvRow) => `${row.firstName}_${row.lastName}`,
            );

            //Ensure the most recent event for each person is displayed in case of altering dates of the duplicates
            const reducedData = Object.values(groupedData).map(
              (group: unknown) =>
                (group as CsvRow[]).reduce((prev: CsvRow, current: CsvRow) =>
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
          error: (error: Error) => {
            console.error("Error parsing CSV data:", error.message);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };
    fetchCsvData();
  }, []);

  const toggleRow = (nameKey: string) => {
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
