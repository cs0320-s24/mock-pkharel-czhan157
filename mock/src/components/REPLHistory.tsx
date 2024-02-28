import { Dispatch } from "react";
import "../styles/main.css";

interface REPLHistoryProps {
  history: { [key: string]: string };
  mode: number;
}

export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {Object.keys(props.history).map((key, i) => {
        const output = props.history[key];
        if (props.mode === 0) {
          // 'brief' mode: display only the output
          return <p key={i}>{output}</p>;
        } else {
          // 'verbose' mode: display command and output
          return (
            <div key={i}>
              <p>
                <strong>Command:</strong> {key}
              </p>
              <p>
                <strong>Output:</strong>{" "}
                <span dangerouslySetInnerHTML={{ __html: output }} />
              </p>
            </div>
          );
        }
      })}
    </div>
  );
}
