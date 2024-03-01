import { expect, test } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

// If you needed to do something before every test case...
test.beforeEach(() => {
  // ... you'd put it here.
  // TODO: Is there something we need to do before every test case to avoid repeating code?
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
  // TODO: Fill this in to test your button push functionality!
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file example.csv");
  await page.getByLabel("Run Command!").click();

  // Wait for some time to let the page update with the response
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
  // TODO: Fill this in to test your button push functionality!
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file examplesekdfjh.csv");
  await page.getByLabel("Run Command!").click();

  // Wait for some time to let the page update with the response
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
  const expectedResponseText = "File not found!";
  expect(responseText).toBe(expectedResponseText);
});

test("i cannot load a csv with malformed inputs", async ({ page }) => {
  // TODO: Fill this in to test your button push functionality!
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file load_file example.csv");
  await page.getByLabel("Run Command!").click();

  // Wait for some time to let the page update with the response
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
  const expectedResponseText =
    "File did not load! Ensure correct syntax by using the help command!";
  expect(responseText).toBe(expectedResponseText);
});

// test("i cannot load a CSV that isn't mocked", async ({ page }) => {
//   // TODO: Fill this in to test your button push functionality!
//   await page.goto("http://localhost:8000/");
//   await page.getByLabel("Login").click();

//   await page.getByLabel("Command input").click();
//   await page.getByLabel("Command input").fill("load_file fakedata.csv");

//   // Step 3: Assert something about the page
//   // Assertions are done by using the expect() function
//   const mock_input = `File not found!`;
//   await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
// });

// test("i cannot load a CSV if my input isn't well formed", async ({ page }) => {
//   // TODO: Fill this in to test your button push functionality!
//   await page.goto("http://localhost:8000/");
//   await page.getByLabel("Login").click();

//   await page.getByLabel("Command input").click();
//   await page
//     .getByLabel("Command input")
//     .fill("load_file load_file fakedata.csv");

//   // Step 3: Assert something about the page
//   // Assertions are done by using the expect() function
//   const mock_input = `File did not load! Ensure correct syntax by using the help command!`;
//   await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
// });
