import { expect, test } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
});

test("on page load, i see a login button", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Login")).toBeVisible();
});

test("on page load, i dont see the input box until login", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();

  await page.getByLabel("Login").click();
  await expect(page.getByLabel("Sign Out")).toBeVisible();
  await expect(page.getByLabel("Command input")).toBeVisible();
});

test("after I type into the input box, its text changes", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Locate the element you are looking for
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  // Assertions are done by using the expect() function
  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

test("i can load a CSV successfully", async ({ page }) => {
  await page.getByLabel("Command input").fill("load_file example.csv");
  await page.getByLabel("Run Command!").click();

  await page.waitForTimeout(5000); // Adjust the wait time as needed

  const responseText = await page.evaluate(() => {
    const responseElement = document.querySelector(".repl-history > div > div");
    console.log(responseElement);
    if (responseElement !== null) {
      return responseElement.textContent;
    }
  });

  const expectedResponseText = "File successfully loaded";
  expect(responseText).toBe(expectedResponseText);
});

test("i cannot load a csv that doesn't exist", async ({ page }) => {
  await page.getByLabel("Command input").fill("load_file examplesekdfjh.csv");
  await page.getByLabel("Run Command!").click();

  await page.waitForTimeout(5000);

  const responseText = await page.evaluate(() => {
    const responseElement = document.querySelector(".repl-history > div > div");
    console.log(responseElement);
    if (responseElement !== null) {
      return responseElement.textContent;
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

  // Extract the text content of the response element
  const responseText = await page.evaluate(() => {
    const responseElement = document.querySelector(".repl-history > div > div");
    console.log(responseElement);
    if (responseElement !== null) {
      return responseElement.textContent;
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
      return responseElement.textContent;
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

test("multiple loading and viewing works", async ({ page }) => {
  // Load the CSV data
  await page.getByLabel("Command input").fill("load_file fruits.csv");
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
   <div><table><tbody><tr><th>name</th><th>color</th></tr><tr><th>lemon</th><th>
   yellow</th></tr><tr><th>apple</th><th>redorgreen</th></tr><tr><th>orange</th>
   <th>orange</th></tr><tr><th>lime</th><th>green</th></tr><tr><th>avocado</th><th>
   green</th></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(responseHTML.replace(/\s+/g, "")).toBe(expectedHTML);

  await page.getByLabel("Command input").fill("load_file fruitsNoHeader.csv");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // View the loaded CSV data
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the view command to execute

  // Extract the HTML content of the response element
  const noHeaderHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  // Expected HTML table generated from the CSV data
  const expectedNoHeaderHTML = `
   <div><table><tbody><tr><th>mango</th><th>orange</th></tr>
   <tr><th>strawberry</th><th>red</th></tr><tr><th>clementine</th>
   <th>orange</th></tr><tr><th>navalorange</th><th>orange</th></tr>
   <tr><th>lime</th><th>green</th></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(noHeaderHTML.replace(/\s+/g, "")).toBe(expectedNoHeaderHTML);
});

test("multiple loading and searching and viewing works", async ({ page }) => {
  // Load the CSV data
  await page.getByLabel("Command input").fill("load_file fruits.csv");
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
   <div><table><tbody><tr><th>name</th><th>color</th></tr><tr><th>lemon</th><th>
   yellow</th></tr><tr><th>apple</th><th>redorgreen</th></tr><tr><th>orange</th>
   <th>orange</th></tr><tr><th>lime</th><th>green</th></tr><tr><th>avocado</th><th>
   green</th></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(responseHTML.replace(/\s+/g, "")).toBe(expectedHTML);

  await page.getByLabel("Command input").fill("load_file fruitsNoHeader.csv");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // View the loaded CSV data
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the view command to execute

  // Extract the HTML content of the response element
  const noHeaderHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  // Expected HTML table generated from the CSV data
  const expectedNoHeaderHTML = `
   <div><table><tbody><tr><th>mango</th><th>orange</th></tr>
   <tr><th>strawberry</th><th>red</th></tr><tr><th>clementine</th>
   <th>orange</th></tr><tr><th>navalorange</th><th>orange</th></tr>
   <tr><th>lime</th><th>green</th></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(noHeaderHTML.replace(/\s+/g, "")).toBe(expectedNoHeaderHTML);

  await page.getByLabel("Command input").fill("search 1 green");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000);

  // Extract the HTML content of the response element
  const fruitSearchHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  const expectedFruitHTML = `
   <div><table><tbody><tr><td>lime</td><td>green</td></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(fruitSearchHTML.replace(/\s+/g, "")).toBe(expectedFruitHTML);
});

test("basic search works", async ({ page }) => {
  // Load the CSV data

  await page.getByLabel("Command input").fill("load_file fruitsNoHeader.csv");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // View the loaded CSV data
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the view command to execute

  await page.getByLabel("Command input").fill("search 1 green");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000);

  // Extract the HTML content of the response element
  const fruitSearchHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  const expectedFruitHTML = `
   <div><table><tbody><tr><td>lime</td><td>green</td></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(fruitSearchHTML.replace(/\s+/g, "")).toBe(expectedFruitHTML);
});

test("basic search in a row works", async ({ page }) => {
  // Load the CSV data

  await page.getByLabel("Command input").fill("load_file fruitsNoHeader.csv");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // View the loaded CSV data
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the view command to execute

  await page.getByLabel("Command input").fill("search 1 green");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000);

  // Extract the HTML content of the response element
  const fruitSearchHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  const expectedFruitHTML = `
   <div><table><tbody><tr><td>lime</td><td>green</td></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(fruitSearchHTML.replace(/\s+/g, "")).toBe(expectedFruitHTML);

  await page
    .getByLabel("Command input")
    .fill("search 1 skdjfhsdjkfhskdjfhskjdfhskjdfh");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000);

  // Extract the HTML content of the response element
  const noSearchHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  const unfortunateHTML = `
   <div>Noresultsfound!</div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(noSearchHTML.replace(/\s+/g, "")).toBe(unfortunateHTML);
});

test("basic search with space works", async ({ page }) => {
  // Load the CSV data

  await page.getByLabel("Command input").fill("load_file cats.csv");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // View the loaded CSV data
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the view command to execute

  await page.getByLabel("Command input").fill("search name belgian fry");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000);

  // Extract the HTML content of the response element
  const fruitSearchHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  const expectedFruitHTML = `
   <div><table><tbody><tr><td>belgianfry</td><td>2</td></tr><tr><td>belgianfry</td><td>3</td>
   </tr><tr><td>belgianfry</td><td>4</td></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(fruitSearchHTML.replace(/\s+/g, "")).toBe(expectedFruitHTML);

  await page.getByLabel("Command input").fill("search 0 belgian fry");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000);

  // Extract the HTML content of the response element
  const noSearchHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  const unfortunateHTML = `
   <div><table><tbody><tr><td>belgianfry</td><td>2</td></tr><tr><td>belgianfry</td><td>3</td>
   </tr><tr><td>belgianfry</td><td>4</td></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(noSearchHTML.replace(/\s+/g, "")).toBe(unfortunateHTML);
});

test("informative message with help", async ({ page }) => {
  // Load the CSV data

  await page.getByLabel("Command input").fill("help");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // Extract the HTML content of the response element
  const helpHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  const expectedHelp = `
   <div>Syntaxguide:Allthecommandsshouldbelowercase,andtheargumentsshouldbeseparatedbyaspace.Makesurecommandsaregiventhecorrectamountofarguments.Makesuretherearen'tanyunnecessaryspaces.Herearethecommandsyoucanuse:</div><div></div><div>mode[brief/verbose]:changesthemodeofdisplayingresultsoftheprogram.Arguments:2.</div><div>load_file[filename]:loadsafileintotheprogram.Youwillneedtorunthisbeforerunningvieworsearch.Arguments:2.</div><div>view[filename]:displaysthecontentsofthefile.Arguments:1.</div><div>search[value][column]:searchesthefileandreturnstherowsoftheCSVwhere<value>ispresentin<column>.Arguments:3.</column></value></div><div>help:displaysthishelpfulmessage!Arguments:1.</div><div>check_mode:checksthecurrentmode.Arguments:1.</div><div>clear:clearssearchhistory.Willnotdisplayverboseoutput,willsimplyridthescreenofpastoutput.Arguments:1.</div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(helpHTML.replace(/\s+/g, "")).toBe(expectedHelp);
});

test("clear works", async ({ page }) => {
  // Load the CSV data

  await page.getByLabel("Command input").fill("load_file cats.csv");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // View the loaded CSV data
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the view command to execute

  await page.getByLabel("Command input").fill("clear");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // Extract the HTML content of the response element
  const helpHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  const expectedHelp = `
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(helpHTML).toBeUndefined;
});

test("mode works", async ({ page }) => {
  // Load the CSV data

  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // Extract the HTML content of the response element
  const helpHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  const expectedHelp =
    `<p><strong>Output:</strong></p><divclass=\"output-table\"><div>Success!Nowinverbosemode!</div></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(helpHTML.replace(/\s+/g, "")).toBe(expectedHelp);
});

test("check mode works", async ({ page }) => {
  // Load the CSV data

  await page.getByLabel("Command input").fill("check_mode");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // Extract the HTML content of the response element
  const helpHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });

  const expectedHelp = `<div>Currentlyinbriefmode!</div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(helpHTML.replace(/\s+/g, "")).toBe(expectedHelp);
});

test("view command with different mode", async ({ page }) => {
  // Load the CSV data
  await page.getByLabel("Command input").fill("load_file fruitsNoHeader.csv");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the file to load

  // View the loaded CSV data
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000);

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

  const expectedHTML =
    '<p><strong>Output:</strong></p><divclass="output-table"><div><table><tbody><tr><th>mango</th><th>orange</th></tr><tr><th>strawberry</th><th>red</th></tr><tr><th>clementine</th><th>orange</th></tr><tr><th>navalorange</th><th>orange</th></tr><tr><th>lime</th><th>green</th></tr></tbody></table></div></div>';
  const afterHTML = `
    <div><table><tbody><tr><th>mango</th><th>orange</th></tr><tr><th>strawberry</th>
    <th>red</th></tr><tr><th>clementine</th><th>orange</th></tr><tr><th>navalorange</th>
    <th>orange</th></tr><tr><th>lime</th><th>green</th></tr></tbody></table></div>
  `.replace(/\s+/g, ""); // Remove whitespace for accurate comparison

  // Assert that the response HTML matches the expected HTML
  expect(responseHTML.replace(/\s+/g, "")).toBe(expectedHTML);

  await page.getByLabel("Command input").fill("mode brief");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000);

  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Run Command!").click();
  await page.waitForTimeout(2000); // Wait for the view command to execute

  const briefHTML = await page.evaluate(() => {
    const responseElement = document.querySelector(
      ".repl-history > div:last-child > div"
    );
    if (responseElement !== null) {
      return responseElement.innerHTML;
    }
  });
  expect(briefHTML.replace(/\s+/g, "")).toBe(afterHTML);
});
