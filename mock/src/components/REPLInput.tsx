import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
  mode: number;
  setMode: Dispatch<SetStateAction<number>>;
}

export function REPLInput(props: REPLInputProps) {
  // Remember: let React manage state in your webapp.
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const validCommands: string[] = [
    "mode",
    "load_file",
    "view",
    "search",
    "help",
    "clear",
  ];
  const words = commandString.split(" ");

  const handleSubmit = () => {
    setCount(count + 1);
    if (validCommands.includes(words[0])) {
      handleCommands(words);
    } else {
      props.setHistory([
        ...props.history,
        "Not a valid command! Use 'help' to see a list of valid commands!",
      ]);
    }
    setCommandString("");
  };

  const handleMode = (words: string[]) => {
    if (words.length != 2) {
      props.setHistory([
        ...props.history,
        "Invalid syntax! Use 'help' to see the correct syntax!",
      ]);
    } else if (words[1] === "brief") {
      props.setMode(0);
    } else if (words[1] === "verbose") {
      props.setMode(1);
    }
  };

  const handleCommands = (words: string[]) => {
    const command = words[0];

    if (command === "mode") {
      handleMode(words);
    } else if (command === "load_file") {
      handleLoadFile(words);
    } else if (command === "view") {
      handleView(words);
    } else if (command === "search") {
      handleSearch(words);
    } else if (command === "help") {
      handleHelp(words);
    } else if (command === "clear") {
      handleClear(words);
    }
  };

  const handleLoadFile = (words: string[]) => {};

  const handleView = (words: string[]) => {};

  const handleSearch = (words: string[]) => {};

  const handleClear = (words: string[]) => {
    if (words.length != 1) {
      props.setHistory([
        ...props.history,
        "Invalid syntax! Use 'help' to see the correct syntax!",
      ]);
    } else {
      props.setHistory([]);
    }
  };

  const handleHelp = (words: string[]) => {
    if (words.length != 1) {
      props.setHistory([
        ...props.history,
        "Invalid syntax! Use 'help' to see the correct syntax!",
      ]);
    } else {
      props.setHistory([
        ...props.history,
        "Syntax guide: All the commands should be lowercase, and the arguments should be separated by a space. Make sure commands are given the correct amount of arguments.",
        "mode [brief/verbose]: changes the mode of displaying results of the program. Arguments: 2.",
        "load_file [filename]: loads a file into the program. You will need to run this before running view or search. Arguments: 2.",
        "view [filename]: displays the contents of the file. Arguments: 1.",
        "search [column] [value]: searches the file and returns the rows of the CSV where <value> is present in <column>. Arguments: 3.",
        "help: displays this helpful message! Arguments: 1.",
        "clear: clears search history. Arguments: 1.",
      ]);
    }
  };

  return (
    <div className="repl-input">
      {/* This is a comment within the JSX. Notice that it's a TypeScript comment wrapped in
            braces, so that React knows it should be interpreted as TypeScript */}
      {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
            into a single unit, which makes it easier for screenreaders to navigate. */}
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={handleSubmit}>Submitted {count} times!</button>
    </div>
  );
}
