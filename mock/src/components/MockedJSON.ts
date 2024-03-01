import React, { useState, useEffect } from "react";
import { ControlledInput } from "./ControlledInput";


interface MockedFile {
  [fileName: string]: string[][];
}

interface SearchResult {
  file: string;
  data: string[][];
}

export interface SearchQuery {
  query: string;
  results: SearchResult[];
}

interface MockedFiles {
  mocked_data: MockedFile;
  search_queries: SearchQuery[];
}

export const mockedData: Record<string, string[][]> = {
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

export const searchQueries: SearchQuery[] = [
  {
    query: "fry",
    results: [
      {
        file: "cats.csv",
        data: [
          ["fry", "5"],
          ["fry", "0"],
        ],
      },
     
    ],
  },
  {
    query: "green",
    results: [
      {
        file: "fruits.csv",
        data: [
          ["lime", "green"],
          ["avocado", "green"],
        ],
      },
      
    ],
  },
  {
    query: "data1",
    results: [{ file: "example.csv", data: [["data1", "data2"]] }],
    
  },
 
];