import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { SearchQuery } from "./MockedJSON";

export interface REPLFunction {
  args: string[]; 
  history: { [key: string]: any };
  setHistory: Dispatch<SetStateAction<{ [key: string]: string }>>;
  mode: number;
  setMode: Dispatch<SetStateAction<number>>;
  currCommand: string;
  setCurrCommand: Dispatch<SetStateAction<string>>;
  currFile: string;
  setCurrFile: Dispatch<SetStateAction<string>>;
  mockedFiles: Record<string, string[][]>;
  mockedSearch: SearchQuery[];
}


  const handleLoadFile = (props: REPLFunction) => {
    
    const [csvData, setCsvData] = useState<string[][]>([]);

    if (props.args.length !== 2) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${props.args.join()}_${Date.now().toString()}`]:
          "File did not load! Ensure correct syntax by using the help command!",
      }));
    } else {
      const filePath = props.args[1]; // Get the second word as the file path
      if (!props.mockedFiles[filePath]) {
        props.setHistory((prevHistory) => ({
          ...prevHistory,
          [`${props.args.join()}_${Date.now().toString()}`]: "File not found!",
        }));
      } else {
        setCsvData(props.mockedFiles[filePath]);
        props.setCurrFile(filePath);
        props.setHistory((prevHistory) => ({
          ...prevHistory,
          [`${props.args.join()}_${Date.now().toString()}`]:
            "File successfully loaded",
          
        }));
      }
    }
  };

  const handleViewData = (props: REPLFunction) => {
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    console.log(csvData);
    console.log(props.history);
    console.log(csvData.length);
    if (csvData.length === 0) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}_${Date.now().toString()}`]: "No CSV data loaded!", 
      }));
    } else {
      const tableRows = csvData
        .map((row) => {
          return `<tr>${row.map((cell) => `<th>${cell}</th>`).join("")}</tr>`;
        })
        .join("");
      const tableHTML = `<table>${tableRows}</table>`;
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}_${Date.now().toString()}`]: tableHTML,
      }));
    }
  };

  const handleSearch = (props: REPLFunction) => {
    const [searchQuery, setSearchQuery] = useState<string[]>([]);
    console.log(searchQuery);
    if (searchQuery.length < 3) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}_${Date.now().toString()}`]:
          "Search syntax invalid! Use 'help' for assistance!",
      }));
    } else {
      const query = searchQuery.slice(2).join(" ");
      const index = searchQuery[1];
      const foundQuery = props.mockedSearch.find(
        (item) => item.query === index + "," + query
      );

      if (foundQuery) {
        let foundMatch = false; // Flag to track if any matching filename is found

        const results = foundQuery.results;
        const tableRows = results
          .filter((result) => result.file === props.currFile) // Filter results for the current file
          .map((result) => {
            const searchData = result.data;
            foundMatch = true; // Set the flag to true if a match is found
            return searchData
              .map((row) => {
                return `<tr>${row
                  .map((cell) => `<td>${cell}</td>`)
                  .join("")}</tr>`;
              })
              .join("");
          })
          .join("");

        if (!foundMatch) {
          props.setHistory((prevHistory) => ({
            ...prevHistory,
            [`${searchQuery}_${Date.now().toString()}`]: "No results found!",
          }));
        } else {
          const tableHTML = `<table>${tableRows}</table>`;
          props.setHistory((prevHistory) => ({
            ...prevHistory,
            [`${searchQuery}_${Date.now().toString()}`]: tableHTML,
          }));
        }
      } else {
        props.setHistory((prevHistory) => ({
          ...prevHistory,
          [`${searchQuery}_${Date.now().toString()}`]: "No results found!",
        }));
      }
    }
  };


  export const defaultCustomCommands = [
    {
      name: "search",
      func: handleSearch,
    },
    {
      name: "view",
      func: handleViewData,
    },
    {
      name: "load_file",
      func: handleLoadFile,
    },
  ];






