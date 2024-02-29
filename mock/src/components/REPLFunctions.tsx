import React, { useState, useEffect } from "react";

interface REPLFunctionsProps {
  history: { [key: string]: string };
  setHistory: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  currCommand: string;
  setCurrCommand: React.Dispatch<React.SetStateAction<string>>;
}

const REPLFunctions: React.FC<REPLFunctionsProps> = (props) => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string[][]>([]);

  const mockedFiles: Record<string, string[][]> = {
    "example.csv": [
      ["header1", "header2"],
      ["data1", "data2"],
      ["data3", "data4"],
    ],
    // Add more
  };

  useEffect(() => {
    console.log("Current command:", props.currCommand);
    handleCommands();
  }, [props.currCommand, searchQuery]);

  const handleCommands = () => {
    const command = props.currCommand;
    if (command === "load_file") {
      handleLoadFile();
    } else if (command === "view") {
      handleViewData();
    } else if (command === "search") {
      handleSearch();
    }
  };

  const handleLoadFile = () => {
    const words = searchQuery.split(" ");
    console.log(words);
    if (words.length !== 2) {
      
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}_${Date.now().toString()}`]:
          "File did not load! Ensure correct syntax by using the help command!",
      }));
    } else {
      const filePath = words[1]; // Get the second word as the file path
      if (!mockedFiles[filePath]) {
        props.setHistory((prevHistory) => ({
          ...prevHistory,
          [`${searchQuery}_${Date.now().toString()}`]: "File not found!",
        }));
      } else {
        setCsvData(mockedFiles[filePath]);
      }
    }
  };

  const handleViewData = () => {
    if (csvData.length === 0 || !props.history.hasOwnProperty("load_file")) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}_${Date.now().toString()}`]: "No CSV data loaded!",
      }));
    } else {
      const dataString = csvData.map((row) => row.join(", ")).join("\n");
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}`]: dataString,
      }));
    }
  };

  const handleSearch = () => {
    console.log(searchQuery);
    if (searchQuery.length !== 3) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}_${Date.now().toString()}`]:
          "Search syntax invalid! Use 'help' for assistance!",
      }));
    } else {
      const columnIndex = isNaN(parseInt(searchQuery[1]))
        ? csvData[0].indexOf(searchQuery[1])
        : parseInt(searchQuery[1]);
      const valueIndex = searchQuery[2];
      const results = csvData.filter((row) => {
        const columnValue = row[columnIndex];
        return columnValue === valueIndex;
      });
      setSearchResults(results);
      const resultString = results.map((row) => row.join(", ")).join("\n");
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}`]: resultString,
      }));
    }
  };

  return null;
};

export default REPLFunctions;
