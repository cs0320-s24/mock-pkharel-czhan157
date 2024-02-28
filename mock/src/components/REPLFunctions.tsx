import React, { useState, ChangeEvent } from "react";
import CSVLoader from "./CSVLoaderProps"; 

const CSVComponent: React.FC = () => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string[][]>([]);

  const handleLoadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const result = event.target.result;
          if (typeof result === "string") {
            const parsedData: string[][] = parseCSV(result);
            setCsvData(parsedData);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleViewData = () => {
    console.log(csvData);
  };

  const handleSearch = (column: number | string, value: string) => {
    const columnIndex =
      typeof column === "number" ? column : csvData[0].indexOf(column);
    const results = csvData.filter((row) => row[columnIndex] === value);
    setSearchResults(results);
  };

  const parseCSV = (csvData: string): string[][] => {
  return csvData.split('\n').map(row => row.split(','));
  }

  return (
    <div>
      <input type="file" onChange={handleLoadFile} data-testid="file-input" />
      <button onClick={handleViewData}>View</button>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        data-testid="search-input"
      />
      <button onClick={() => handleSearch(0, searchQuery)}>Search</button>
      <table>
        <thead>
          <tr>
            {csvData.length > 0 &&
              csvData[0].map((cell, index) => <th key={index}>{cell}</th>)}
          </tr>
        </thead>
        <tbody>
          {searchResults.length > 0
            ? searchResults.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))
            : csvData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default CSVComponent;
