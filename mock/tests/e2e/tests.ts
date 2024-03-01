const { Browser, chromium, Page } = require("playwright");


describe("REPLInput Component", () => {
  let browser = Browser;
  let page = Page;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://localhost:3000"); // Replace with your URL
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should run command when button is clicked", async () => {
    const input = await page.$(".repl-input input");
    await input.type("help");
    const button = await page.$(".repl-input button");
    await button.click();
    await page.waitForSelector(".repl-history div"); // Wait for history to update
    const commandText = await page.textContent(
      ".repl-history div p:nth-child(1)"
    );
    expect(commandText).toContain("help");
  });

  // Add more tests as needed...
});
