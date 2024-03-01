import React, { useState, useEffect } from "react";
import { ControlledInput } from "./ControlledInput";

/**
 * Mocked data class. Used to simulate the data that would be returned from the server.
 */
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
    ["belgian fry", "3"],
    ["belgian fry", "4"],
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

  "fruitsNoHeader.csv": [
    ["mango", "orange"],
    ["strawberry", "red"],
    ["clementine", "orange"],
    ["naval orange", "orange"],
    ["lime", "green"],
  ],
};

/**
 * Example queries and results.
 */
export const searchQueries: SearchQuery[] = [
  {
    query: "data1,0",
    results: [{ file: "example.csv", data: [["data1", "data2"]] }],
  },

  {
    query: "0,data1",
    results: [{ file: "example.csv", data: [["data1", "data2"]] }],
  },

  {
    query: "name,fry",
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
    query: "0,french fry",
    results: [{ file: "cats.csv", data: [["french fry", "3"]] }],
  },
  {
    query: "0,belgian fry",
    results: [
      {
        file: "cats.csv",
        data: [
          ["belgian fry", "2"],
          ["belgian fry", "3"],
          ["belgian fry", "4"],
        ],
      },
    ],
  },
  {
    query: "name,belgian fry",
    results: [
      {
        file: "cats.csv",
        data: [
          ["belgian fry", "2"],
          ["belgian fry", "3"],
          ["belgian fry", "4"],
        ],
      },
    ],
  },
  { query: "1,french fry", results: [] },

  {
    query: "0,fry",
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
    query: "1,green",
    results: [
      {
        file: "fruits.csv",
        data: [
          ["lime", "green"],
          ["avocado", "green"],
        ],
      },
      { file: "fruitsNoHeader.csv", data: [["lime", "green"]] },
    ],
  },
];
