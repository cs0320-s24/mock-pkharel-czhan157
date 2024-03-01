import { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";
import { mockedData } from "./MockedJSON";
import { searchQueries } from "./MockedJSON";
import { REPLFunction, defaultCustomCommands } from "./REPLFunction";

/**
 * Top level component that extends props to various subcomponents.
 * History is a dictionary that stores the command and its output.
 * Mode is a number that determines which of the two modes to run the output in.
 * CurrCommand keeps track of the current command being used.
 * currFile keeps track of the current file being used.
 */
export default function REPL() {
  const [history, setHistory] = useState<{ [key: string]: any }>({});
  const [mode, setMode] = useState<number>(0);
  const [currCommand, setCurrCommand] = useState<string>("");
  const [currFile, setCurrFile] = useState<string>("");

  return (
    <div className="repl">
      <REPLHistory mode={mode} history={history} />
      <REPLInput
        currCommand={currCommand}
        setCurrCommand={setCurrCommand}
        mode={mode}
        setMode={setMode}
        history={history}
        setHistory={setHistory}
        setCurrFile={setCurrFile}
        currFile={currFile}
        mockedFiles={mockedData}
        mockedSearch={searchQueries}
        customCommands={defaultCustomCommands}
      />
    </div>
  );
}
