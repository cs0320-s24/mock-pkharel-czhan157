import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { SearchQuery } from "./MockedJSON";
import { REPLFunction } from "./REPLFunction";

/**
 * Represents the properties required for the REPL input.
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
 * @returns - Object containing the REPL input properties
 */
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

  // Keep track of valid commands
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

  // Checks if input is a valid command, and processes it if it is
  const handleSubmit = () => {
    if (validCommands.includes(commandString.split(" ")[0])) {
      handleCommands(commandString.split(" "));
    } else {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        // Append timestamp to prevent duplicate keys
        [`${commandString}~${Date.now().toString()}`]:
          "Not a valid command! Use 'help' to see a list of valid commands!",
      }));
    }
    setCommandString(""); // reset command box for user experience
  };

  /**
   * Handles the execution of commands based on the input words array.
   * It checks the command and calls the corresponding function to execute it.
   * If the command is a custom command, it looks up the command in the customCommands array
   * and executes its associated function with the inputProps.
   * @param words - Array of strings representing the command and its arguments
   */
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
    if (command === "mode") {
      handleMode(words);
    } else if (
      command === "load_file" &&
      props.customCommands.some((cmd) => cmd.name === "load_file")
    ) {
      props.setCurrCommand(command);
      handleLoadFile(words);
    } else if (
      command === "view" &&
      props.customCommands.some((cmd) => cmd.name === "view")
    ) {
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
        const result = customCommand.func(inputProps);
        props.setCurrCommand(command);
      }
    }
  };

  /**
   * Function to handle loading a file based on the command input
   * It checks if the command has correct syntax and if the file exists in mockedFiles
   * Updates history with appropriate messages based on the outcome
   * @param words - The command input split into an array of words
   */
  const handleLoadFile = (words: string[]) => {
    if (words.length !== 2) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${words.join()}~${Date.now().toString()}`]:
          "File did not load! Ensure correct syntax by using the help command!",
      }));
    } else {
      const filePath = words[1]; // Get the second word as the file path
      if (!props.mockedFiles[filePath]) {
        props.setHistory((prevHistory) => ({
          ...prevHistory,
          [`${words.join()}~${Date.now().toString()}`]: "File not found!",
        }));
      } else {
        setCsvData(props.mockedFiles[filePath]);
        props.setCurrFile(filePath);
        props.setHistory((prevHistory) => ({
          ...prevHistory,
          [`${words.join()}~${Date.now().toString()}`]:
            "File successfully loaded",
        }));
      }
    }
  };

  /**
   * Function to handle viewing the data of a file based on the command input
   * It checks if the command has correct syntax and if the file has been loaded
   * Updates history with appropriate messages based on the outcome
   * @param words - The command input split into an array of words
   */
  const handleViewData = (words: string[]) => {
    if (csvData.length === 0) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}~${Date.now().toString()}`]: "No CSV data loaded!",
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
        [`${commandString}~${Date.now().toString()}`]: tableHTML,
      }));
    }
  };

  /**
   * Function to handle searching the data of a file based on the command input
   * It checks if the command has correct syntax and if the file has been loaded
   * Updates history with appropriate messages based on the outcome
   * @param searchQuery - The command input split into an array of words
   */
  const handleSearch = (searchQuery: string[]) => {
    if (searchQuery.length < 3) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${searchQuery}~${Date.now().toString()}`]:
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
            [`${searchQuery}~${Date.now().toString()}`]: "No results found!",
          }));
        } else {
          const tableHTML = `<table>${tableRows}</table>`;
          props.setHistory((prevHistory) => ({
            ...prevHistory,
            [`${searchQuery}~${Date.now().toString()}`]: tableHTML,
          }));
        }
      } else {
        props.setHistory((prevHistory) => ({
          ...prevHistory,
          [`${searchQuery}~${Date.now().toString()}`]: "No results found!",
        }));
      }
    }
  };

  /**
   * Function to handle changing the mode of the output based on the command input
   * It checks if the command has correct syntax and if the mode is valid
   * Updates history with appropriate messages based on the outcome
   * @param words - The command input split into an array of words
   */
  const handleMode = (words: string[]) => {
    if (words.length !== 2) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}~${Date.now().toString()}`]:
          "Invalid syntax! Use 'help' to see the correct syntax!",
      }));
    } else if (words[1] === "brief") {
      props.setMode(0);
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}~${Date.now().toString()}`]:
          "Success! Now in brief mode!",
      }));
    } else if (words[1] === "verbose") {
      props.setMode(1);
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}~${Date.now().toString()}`]:
          "Success! Now in verbose mode!",
      }));
    }
  };

  /**
   * Function to display a helpful message based on the command input
   * It checks if the command has correct syntax
   * Updates history with appropriate messages based on the outcome
   * @param words - The command input split into an array of words
   */
  const handleHelp = (words: string[]) => {
    if (words.length !== 1) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}~${Date.now().toString()}`]:
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
        [`${commandString}~${Date.now().toString()}`]: helpMessage,
      }));
    }
  };

  /**
   * Function to handle clearing the history based on the command input
   * It checks if the command has correct syntax
   * Updates history with appropriate messages based on the outcome
   * @param words - The command input split into an array of words
   */
  const handleClear = (words: string[]) => {
    if (words.length !== 1) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}~${Date.now().toString()}`]:
          "Invalid syntax! Use help to see the correct syntax!",
      }));
    } else {
      props.setHistory({});
    }
  };

  /**
   * Function to handle checking the mode based on the command input
   * It checks if the command has correct syntax
   * Updates history with appropriate messages based on the outcome
   * @param words - The command input split into an array of words
   */
  const handleCheckMode = (words: string[]) => {
    if (words.length !== 1) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}~${Date.now().toString()}`]:
          "Invalid syntax! Use 'help' to see the correct syntax!",
      }));
    } else {
      const modeMessage =
        props.mode === 0
          ? "Currently in brief mode!"
          : "Currently in verbose mode!";
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [`${commandString}~${Date.now().toString()}`]: modeMessage,
      }));
    }
  };

  // Render the input box and the submit button
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
