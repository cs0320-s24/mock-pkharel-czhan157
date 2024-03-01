import { Dispatch, Key } from "react";
import "../styles/main.css";

interface REPLHistoryProps {
  history: { [key: string]: any };
  mode: number;
}

export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {Object.keys(props.history).map((key, i) => {
        const command = key.split("~")[0]; // Extracting command before the underscore
        let output = props.history[key];
        console.log(output);
        if (props.mode === 0) {
          // 'brief' mode: display only the output
          const outputLines = output
            .split("<br>")
            .map((line: any, index: Key | null | undefined) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: line }}></div>
            ));
          return (
            <div className="output-wrapper" id={command} key={i}>
              <div className="output-table">{outputLines}</div>
            </div>
          );
        } else {
          // 'verbose' mode: display command and output
          // const outputLines = output.split("<br>").map((line, index) => (
          //   <span key={index}>
          //     {line}
          //     <br />
          //   </span>
          // ));
          const outputLines = output
            .split("<br>")
            .map((line: any, index: Key | null | undefined) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: line }}></div>
            ));
          return (
            <div key={i}>
              <p>
                <strong>Command:</strong> {command}
              </p>
              <div className="output-wrapper">
                <p>
                  <strong>Output:</strong>
                </p>
                <div className="output-table">{outputLines}</div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
