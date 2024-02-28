import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  history: { [key: string]: string };
  setHistory: Dispatch<SetStateAction<{ [key: string]: string }>>;
  mode: number;
  setMode: Dispatch<SetStateAction<number>>;
  currCommand: string;
  setCurrCommand: Dispatch<SetStateAction<string>>;
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
    const command = words[0];
    setCommandString(command);

    if (command === "mode") {
      handleMode(words);
    } else if (command === "load_file") {
      props.setCurrCommand(command);
    } else if (command === "view") {
      props.setCurrCommand(command);
    } else if (command === "search") {
      props.setCurrCommand(command);
    } else if (command === "help") {
      handleHelp(words);
    } else if (command === "clear") {
      handleClear(words);
    } else if (command === "check_mode") {
      handleCheckMode(words);
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
        "search [column] [value]: searches the file and returns the rows of the CSV where <value> is present in <column>. Arguments: 3.<br>" +
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
        [`${commandString}_${Date.now().toString()}`]:
          "Invalid syntax! Use 'help' to see the correct syntax!",
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
      <button onClick={handleSubmit}>Run Command!</button>
    </div>
  );
}
