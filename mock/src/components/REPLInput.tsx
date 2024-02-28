import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;

  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
}
// You can use a custom interface or explicit fields or both! An alternative to the current function header might be:
// REPLInput(history: string[], setHistory: Dispatch<SetStateAction<string[]>>)
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
  ];

  // TODO: Once it increments, try to make it push commands... Note that you can use the `...` spread syntax to copy what was there before
  // add to it with new commands.
  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */

  const handleSubmit = () => {
    setCount(count + 1);
    if (validCommands.includes(commandString)) {
      props.setHistory([...props.history, commandString]);
    } else {
      props.setHistory([
        "Not a valid command! Use 'help' to see a list of valid commands!",
      ]);
    }
    setCommandString("");
  };

  const checkValidCommand = () => {
    if (validCommands.includes(commandString)) {
      return true;
    }
    return false;
  };

  const handleCommands = () => {
    const command = commandString;
    if (checkValidCommand()) {
      if (command === "mode") {
        handleMode(command);
      } else if (command === "load_file") {
        handleLoadFile(command);
      } else if (command === "view") {
        handleView(command);
      } else if (command === "search") {
        handleSearch(command);
      } else if (command == "help") {
        handleHelp(command);
      }
    }
  };

  const handleMode = (command: string) => {};

  const handleLoadFile = (command: string) => {};

  const handleView = (command: string) => {};

  const handleSearch = (command: string) => {};

  const handleHelp = (command: string) => {};

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
      {/* TODO WITH TA: Build a handleSubmit function that increments count and displays the text in the button */}
      {/* TODO: Currently this button just counts up, can we make it push the contents of the input box to the history?*/}
      <button onClick={handleSubmit}>Submitted {count} times!</button>
    </div>
  );
}
