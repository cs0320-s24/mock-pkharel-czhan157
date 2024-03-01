import { Dispatch } from "react";
import "../styles/main.css";

interface REPLHistoryProps {
  history: { [key: string]: any };
  mode: number;
}

export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {Object.keys(props.history).map((key, i) => {
        const command = key.split("_")[0]; // Extracting command before the underscore
        let output = props.history[key];
        console.log(output);
        if (props.mode === 0) {
          // 'brief' mode: display only the output
          const outputLines = output
            .split("<br>")
            .map((line, index) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: line }}></div>
            ));
          return (
            <div className="output-wrapper" id={command} key={i}>
              
              <div className="output-table">{outputLines}</div>
            </div>
          );
        } else {
          // 'verbose' mode: display command and output
          const outputLines = output.split("<br>").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ));
          return (
            <div key={i}>
              <p>
                <strong>Command:</strong> {command}
              </p>
              <div className="output-table">
                <p>
                  <strong>Output:</strong> {outputLines}
                </p>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
