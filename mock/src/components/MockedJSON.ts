import React, { useState, useEffect } from "react";
import { ControlledInput } from "./ControlledInput";
export function REPLInput() {


  const validCommands: string[] = [
    "mode",
    "load_file",
    "view",
    "search",
    "help",
    "clear",
    "check_mode",
  ];

  const mockedFiles: Record<string, string[][]> = {
    "example.csv": [
      ["header1", "header2"],
      ["data1", "data2"],
      ["data3", "data4"],
    ],


    "cats.csv": [
      ["name", "age"],
      ["frenchie", "5"],
      ["fry", "5"],
      ["french fry", "3"],
      ["belgian fry", "2"],
      ["the french one", "1"],
      ["fry", "0"],
    ],

    "fruits.csv": [
      ["name", "color"],
      ["lemon", "yellow"],
      ["apple", "red or green"],
      ["orange", "orange"],
      ["lime", "green"],
      ["avocado", "green"],
    ],
  };

  const validSearch: Record<string, string[]> = {
    "example.csv": [
    ],

    "cats.csv":["frenchie","5"],

    "fruits.csv": ["yellow", ""],
  };
}