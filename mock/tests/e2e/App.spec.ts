import { expect, test } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

// If you needed to do something before every test case...

const mockedProps = {
  history: {},
  setHistory: jest.fn(),
  mode: 0,
  setMode: jest.fn(),
  currCommand: "",
  setCurrCommand: jest.fn(),
  currFile: "",
  setCurrFile: jest.fn(),
  mockedFiles: {
    "example.csv": [
      ["header1", "header2"],
      ["data1", "data2"],
    ],
  },
  mockedSearch: [],
};

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
});

/**
 * Don't worry about the "async" yet. We'll cover it in more detail
 * for the next sprint. For now, just think about "await" as something
 * you put before parts of your test that might take time to run,
 * like any interaction with the page.
//  */
// test("on page load, i see a login button", async ({ page }) => {
//   // Notice: http, not https! Our front-end is not set up for HTTPs.
//   await page.goto("http://localhost:8000/");
//   await expect(page.getByLabel("Login")).toBeVisible();
// });

// test("on page load, i dont see the input box until login", async ({ page }) => {
//   // Notice: http, not https! Our front-end is not set up for HTTPs.
//   await page.goto("http://localhost:8000/");
//   await expect(page.getByLabel("Sign Out")).not.toBeVisible();
//   await expect(page.getByLabel("Command input")).not.toBeVisible();

//   // click the login button
//   await page.getByLabel("Login").click();
//   await expect(page.getByLabel("Sign Out")).toBeVisible();
//   await expect(page.getByLabel("Command input")).toBeVisible();
// });

// test("after I type into the input box, its text changes", async ({ page }) => {
//   // Step 1: Navigate to a URL
//   await page.goto("http://localhost:8000/");
//   await page.getByLabel("Login").click();

//   // Step 2: Interact with the page
//   // Locate the element you are looking for
//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("Awesome command");

//   // Step 3: Assert something about the page
//   // Assertions are done by using the expect() function
//   const mock_input = `Awesome command`;
//   await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
// });

// test("on page load, i see a button", async ({ page }) => {
//   // TODO WITH TA: Fill this in!
// });

// test("after I click the button, its label increments", async ({ page }) => {
//   await page.goto("http://localhost:8000/");
//   await page.getByLabel("Login").click();

//   await expect(
//     page.getByRole("button", { name: "Submitted 0 times!" })
//   ).toBeVisible();

//   await page.getByRole("button", { name: "Submitted 0 times!" }).click();

//   await expect(
//     page.getByRole("button", { name: "Submitted 1 times!" })
//   ).toBeVisible();
// });

test("i can load a CSV successfully", async ({ page }) => {
  await page.getByLabel("Command input").fill("load_file example.csv");
  await page.getByLabel("Run Command!").click();

  await page.waitForTimeout(5000); // Adjust the wait time as needed

  //await page.waitForSelector(".repl-history > div:last-child");
  // Extract the text content of the response element
  const responseText = await page.evaluate(() => {
    //page.on('console', document => console.log(document));
    const responseElement = document.querySelector(".repl-history > div > div");
    console.log(responseElement); // Replace "#responseElementSelector"
    if (responseElement !== null) {
      return responseElement.textContent; //.trim();
    }
  });

  // Step 3: Assert something about the response text
  // Assertions are done by using the expect() function
  const expectedResponseText = "File successfully loaded";
  expect(responseText).toBe(expectedResponseText);
});

test("i cannot load a csv that doesn't exist", async ({ page }) => {
  await page.getByLabel("Command input").fill("load_file examplesekdfjh.csv");
  await page.getByLabel("Run Command!").click();

  await page.waitForTimeout(5000); // Adjust the wait time as needed

  const responseText = await page.evaluate(() => {
    //page.on('console', document => console.log(document));
    const responseElement = document.querySelector(".repl-history > div > div");
    console.log(responseElement); // Replace "#responseElementSelector"
    if (responseElement !== null) {
      return responseElement.textContent; //.trim();
    }
  });

  const expectedResponseText = "File not found!";
  expect(responseText).toBe(expectedResponseText);
});

test("i cannot load a csv with malformed inputs", async ({ page }) => {
  await page
    .getByLabel("Command input")
    .fill("load_file load_file example.csv");
  await page.getByLabel("Run Command!").click();

  await page.waitForTimeout(5000);

  //await page.waitForSelector(".repl-history > div:last-child");
  // Extract the text content of the response element
  const responseText = await page.evaluate(() => {
    //page.on('console', document => console.log(document));
    const responseElement = document.querySelector(".repl-history > div > div");
    console.log(responseElement); // Replace "#responseElementSelector"
    if (responseElement !== null) {
      return responseElement.textContent; //.trim();
    }
  });

  const expectedResponseText =
    "File did not load! Ensure correct syntax by using the help command!";
  expect(responseText).toBe(expectedResponseText);
});

test("i cannot view a csv without loading it first", async ({ page }) => {
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Run Command!").click();

  await page.waitForTimeout(5000);

  const responseText = await page.evaluate(() => {
    const responseElement = document.querySelector(".repl-history > div > div");
    console.log(responseElement);
    if (responseElement !== null) {
      return responseElement.textContent; //.trim();
    }
  });

  const expectedResponseText = "No CSV data loaded!";
  expect(responseText).toBe(expectedResponseText);
});

test("multiple loading works", async ({ page }) => {
  // Array of file names to load
  const filesToLoad = ["example.csv", "cats.csv", "fruits.csv"];

  // Loop through each file name and load it
  for (const file of filesToLoad) {
    await page.getByLabel("Command input").fill(`load_file ${file}`);
    await page.getByLabel("Run Command!").click();
    // Wait for a brief moment before loading the next file
    await page.waitForTimeout(2000);
  }

  // Wait for a bit longer to ensure all files are loaded
  await page.waitForTimeout(5000);

  // Extract the text content of the last response element
  const updatedText = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.textContent;
    }
  });

  const expectedText = "File successfully loaded"; // Expected response text

  // Assert that the last loaded file response matches the expected text
  expect(updatedText).toBe(expectedText);
});

test("view command displays CSV data as HTML table", async ({ page }) => {
  // Load the CSV data
  await page.getByLabel("Command input").fill("load_file fruitsNoHeader.csv");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // View the loaded CSV data
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the view command to execute

  // Extract the HTML content of the response element
  const responseHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  // Expected HTML table generated from the CSV data
  const expectedHTML = `
    <div><table><tbody><tr><th>mango</th><th>orange</th></tr><tr><th>strawberry</th>
    <th>red</th></tr><tr><th>clementine</th><th>orange</th></tr><tr><th>navalorange</th>
    <th>orange</th></tr><tr><th>lime</th><th>green</th></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(responseHTML.replace(/\s+/g, "")).toBe(expectedHTML);
});


