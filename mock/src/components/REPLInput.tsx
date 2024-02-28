import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  history: { [key: string]: string };
  setHistory: Dispatch<SetStateAction<{ [key: string]: string }>>;
  mode: number;
  setMode: Dispatch<SetStateAction<number>>;
}

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");

  const validCommands: string[] = [
    "mode",
    "load_file",
    "view",
    "search",
    "help",
    "clear",
    "check_mode",
  ];

  const handleSubmit = () => {
    const timestamp = Date.now().toString();
    if (validCommands.includes(commandString.split(" ")[0])) {
      handleCommands(commandString.split(" "), timestamp);
    } else {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [timestamp]:
          "Not a valid command! Use 'help' to see a list of valid commands!",
      }));
    }
    setCommandString("");
  };

  const handleCommands = (words: string[], timestamp: string) => {
    const command = words[0];

    if (command === "mode") {
      handleMode(words, timestamp);
    } else if (command === "load_file") {
      handleLoadFile(words, timestamp);
    } else if (command === "view") {
      handleView(words, timestamp);
    } else if (command === "search") {
      handleSearch(words, timestamp);
    } else if (command === "help") {
      handleHelp(words, timestamp);
    } else if (command === "clear") {
      handleClear(words, timestamp);
    } else if (command === "check_mode") {
      handleCheckMode(words, timestamp);
    }
  };

  const handleMode = (words: string[], timestamp: string) => {
    if (words.length !== 2) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [timestamp]: "Invalid syntax! Use 'help' to see the correct syntax!",
      }));
    } else if (words[1] === "brief") {
      props.setMode(0);
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [timestamp]: "Success! Now in brief mode!",
      }));
    } else if (words[1] === "verbose") {
      props.setMode(1);
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [timestamp]: "Success! Now in verbose mode!",
      }));
    }
  };

  const handleLoadFile = (words: string[], timestamp: string) => {};

  const handleView = (words: string[], timestamp: string) => {};

  const handleSearch = (words: string[], timestamp: string) => {};

  const handleHelp = (words: string[], timestamp: string) => {
    if (words.length !== 1) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [timestamp]: "Invalid syntax! Use 'help' to see the correct syntax!",
      }));
    } else {
      const helpLines = {
        line1:
          "Syntax guide: All the commands should be lowercase, and the arguments should be separated by a space. Make sure commands are given the correct amount of arguments. Make sure there aren't any unnecessary spaces. Here are the commands you can use:",
        line2:
          "mode [brief/verbose]: changes the mode of displaying results of the program. Arguments: 2.",
        line3:
          "load_file [filename]: loads a file into the program. You will need to run this before running view or search. Arguments: 2.",
        line4:
          "view [filename]: displays the contents of the file. Arguments: 1.",
        line5:
          "search [column] [value]: searches the file and returns the rows of the CSV where <value> is present in <column>. Arguments: 3.",
        line6: "help: displays this helpful message! Arguments: 1.",
        line7: "check_mode: checks the current mode. Arguments: 1.",
        line8:
          "clear: clears search history. Will not display verbose output, will simply rid the screen of past output.  Arguments: 1.",
      };
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        ...helpLines,
      }));
    }
  };

  const handleClear = (words: string[], timestamp: string) => {
    if (words.length !== 1) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [timestamp]: "Invalid syntax! Use 'help' to see the correct syntax!",
      }));
    } else {
      props.setHistory({});
    }
  };

  const handleCheckMode = (words: string[], timestamp: string) => {
    if (words.length !== 1) {
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [timestamp]: "Invalid syntax! Use 'help' to see the correct syntax!",
      }));
    } else {
      const modeMessage =
        props.mode === 0
          ? "Currently in brief mode!"
          : "Currently in verbose mode!";
      props.setHistory((prevHistory) => ({
        ...prevHistory,
        [timestamp]: modeMessage,
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
      <button onClick={handleSubmit}>Run Command!</button>
    </div>
  );
}
