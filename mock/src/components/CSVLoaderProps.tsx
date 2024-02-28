import React from "react";


interface CSVLoaderProps {
  filePath: string;
}

const CSVLoader: React.FC<CSVLoaderProps> = ({ filePath }) => {

  const exampleCSV1: string[][] = [
    ["header1", "header2"],
    ["data1", "data2"],
    ["data3", "data4"],
  ];


  const mockedFiles: Record<string, string[][]> = {
    "example.csv": exampleCSV1,
  };


  const data: string[][] = mockedFiles[filePath] || [];


  return (
    <div>
      {/* Render the data */}
      {data.map((row, index) => (
        <div key={index}>
          {row.map((cell, cellIndex) => (
            <span key={cellIndex}>{cell}&nbsp;&nbsp;</span>
          ))}
        </div>
      ))}
    </div>
  );
};


export default CSVLoader;
