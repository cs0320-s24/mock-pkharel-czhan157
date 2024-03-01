import { Dispatch, SetStateAction, useState } from "react";
import { SearchQuery } from "./MockedJSON";

/**
 * Represents the properties required for REPL functions.
 * @param args - Array of strings representing the arguments of the command
 * @param history - Dictionary of strings representing the command and its output
 * @param setHistory - Function to set the history state
 * @param mode - Number representing the mode of the REPL
 * @param setMode - Function to set the mode state
 * @param currCommand - String representing the current command
 * @param setCurrCommand - Function to set the current command state
 * @param currFile - String representing the current file
 * @param setCurrFile - Function to set the current file state
 * @param mockedFiles - Dictionary of strings representing the mocked files
 * @param mockedSearch - Array of SearchQuery objects
 * @param customCommands - Array of custom commands
 * @returns - Object containing the REPL function properties
 */
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

/**
 * Handles the loading of the CSV file.
 * @param props - Object containing the REPL function properties
 */
const handleLoadFile = (props: REPLFunction) => {
  const [csvData, setCsvData] = useState<string[][]>([]);

  if (props.args.length !== 2) {
    props.setHistory((prevHistory) => ({
      ...prevHistory,
      [`${props.args.join()}_${Date.now().toString()}`]:
        "File did not load! Ensure correct syntax by using the help command!",
    }));
  } else {
    const filePath = props.args[1];
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

/**
 * Views CSV data as a 2D table.
 * @param props - Object containing the REPL function properties
 */
const handleViewData = (props: REPLFunction) => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
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

/**
 * Parses CSV table based on column and value search input.
 * @param props - Object containing the REPL function properties
 */
const handleSearch = (props: REPLFunction) => {
  const [searchQuery, setSearchQuery] = useState<string[]>([]);
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
      let foundMatch = false;

      const results = foundQuery.results;
      const tableRows = results
        .filter((result) => result.file === props.currFile)
        .map((result) => {
          const searchData = result.data;
          foundMatch = true;
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
