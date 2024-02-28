import { Dispatch } from "react";
import "../styles/main.css";

interface REPLHistoryProps {
  history: string[];
  mode: number;
}
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {props.history.map((elem, i) => (
        <p key={i}>{elem}</p>
      ))}
    </div>
  );
}
