import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { SearchQuery } from "./MockedJSON";
import { REPLFunction } from "./REPLFunction";
interface REPLInputProps {
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
  customCommands: {
    name: string;
    func: (props: REPLFunction) => void;
  }[];
}


export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string[][]>([]);
  const [currFile, setCurrFile] = useState<string>("");
  

  const validCommands: string[] = [
    "mode",
    "load_file",
    "view",
    "search",
    "help",
    "clear",
    "check_mode",
    ...props.customCommands.map((cmd) => cmd.name),
  ];

  const handleSubmit = () => {
    console.log(commandString);
    if (validCommands.includes(commandString.split(" ")[0])) {
      handleCommands(commandString.split(" "));
    } else {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        // Append timestamp
        [`${commandString}_${Date.now().toString()}`]:
          "Not a valid command! Use 'help' to see a list of valid commands!",
      }));
    }
    setCommandString("");
  };

  


  const handleCommands = (words: string[]) => {
    const inputProps: REPLFunction = {
    args: words,
    history: props.history,
    setHistory: props.setHistory,
    mode: props.mode,
    setMode: props.setMode,
    currCommand: props.currCommand,
    setCurrCommand: props.setCurrCommand,
    currFile: props.currFile,
    setCurrFile: props.setCurrFile,
    mockedFiles: props.mockedFiles,
    mockedSearch: props.mockedSearch,
  };

    const command = words[0];
    setCommandString(command);
    console.log(command);
    console.log(words);
    if (command === "mode") {
      handleMode(words);
    } else if (command === "load_file" && props.customCommands.some(cmd => cmd.name === "load_file")) {
       props.setCurrCommand(command);
       handleLoadFile(words);
     } else if (command === "view" && props.customCommands.some(cmd => cmd.name === "view")) {
       props.setCurrCommand(command);
       handleViewData(words);
     } else if (
       command === "search" &&
       props.customCommands.some((cmd) => cmd.name === "search")
     ) {
       props.setCurrCommand(command);
       handleSearch(words);
     } else if (command === "help") {
       handleHelp(words);
     } else if (command === "clear") {
       handleClear(words);
     } else if (command === "check_mode") {
       handleCheckMode(words);
     } else {
       const customCommand = props.customCommands.find(
         (cmd) => cmd.name === command
       );
       if (customCommand) {
         console.log(customCommand);
         const result = customCommand.func(inputProps);
         props.setCurrCommand(command);
         console.log(result);
       }
     }
  };

  const handleLoadFile = (words: string[]) => {
    if (words.length !== 2) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${words.join()}_${Date.now().toString()}`]:
          "File did not load! Ensure correct syntax by using the help command!",
      }));
    } else {
      const filePath = words[1]; // Get the second word as the file path
      if (!props.mockedFiles[filePath]) {
        props.setHistory((prevHistory) => ({
          ...prevHistory,
          [`${words.join()}_${Date.now().toString()}`]: "File not found!",
        }));
      } else {
        setCsvData(props.mockedFiles[filePath]);
        props.setCurrFile(filePath);
        props.setHistory((prevHistory) => ({
          ...prevHistory,
          [`${words.join()}_${Date.now().toString()}`]:
            "File successfully loaded",
          
        }));
      }
    }
  };

  const handleViewData = (words: string[]) => {
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

  const handleSearch = (searchQuery: string[]) => {
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
        let foundMatch = false; 

        const results = foundQuery.results;
        const tableRows = results
          .filter((result) => result.file === props.currFile) 
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

  const handleMode = (words: string[]) => {
    if (words.length !== 2) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}_${Date.now().toString()}`]:
          "Invalid syntax! Use 'help' to see the correct syntax!",
      }));
    } else if (words[1] === "brief") {
      props.setMode(0);
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}_${Date.now().toString()}`]:
          "Success! Now in brief mode!",
      }));
    } else if (words[1] === "verbose") {
      props.setMode(1);
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}_${Date.now().toString()}`]:
          "Success! Now in verbose mode!",
      }));
    }
  };

  const handleHelp = (words: string[]) => {
    if (words.length !== 1) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}_${Date.now().toString()}`]:
          "Invalid syntax! Use 'help' to see the correct syntax!",
      }));
    } else {
      const helpMessage =
        "Syntax guide: All the commands should be lowercase, and the arguments should be separated by a space. Make sure commands are given the correct amount of arguments. Make sure there aren't any unnecessary spaces. Here are the commands you can use:<br><br>" +
        "mode [brief/verbose]: changes the mode of displaying results of the program. Arguments: 2.<br>" +
        "load_file [filename]: loads a file into the program. You will need to run this before running view or search. Arguments: 2.<br>" +
        "view [filename]: displays the contents of the file. Arguments: 1.<br>" +
        "search [value] [column]: searches the file and returns the rows of the CSV where <value> is present in <column>. Arguments: 3.<br>" +
        "help: displays this helpful message! Arguments: 1.<br>" +
        "check_mode: checks the current mode. Arguments: 1.<br>" +
        "clear: clears search history. Will not display verbose output, will simply rid the screen of past output.  Arguments: 1.";

      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}_${Date.now().toString()}`]: helpMessage,
      }));
    }
  };

  const handleClear = (words: string[]) => {
    if (words.length !== 1) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}`]: `${Date.now().toString()}: Invalid syntax! Use help to see the correct syntax! Date.now().toString()`,
      }));
    } else {
      props.setHistory({});
    }
  };

  const handleCheckMode = (words: string[]) => {
    if (words.length !== 1) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}_${Date.now().toString()}`]:
          "Invalid syntax! Use 'help' to see the correct syntax!",
      }));
    } else {
      const modeMessage =
        props.mode === 0
          ? "Currently in brief mode!"
          : "Currently in verbose mode!";
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}_${Date.now().toString()}`]: modeMessage,
      }));
    }
  };

  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button aria-label="Run Command!" onClick={handleSubmit}>
        Run Command!
      </button>
    </div>
  );
}
