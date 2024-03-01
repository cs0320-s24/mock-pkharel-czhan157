> **GETTING STARTED:** You should likely start with the `/mock` folder from your solution code for the mock gearup.

# Project Details

Mock

Caroline Zhang (czhan157) - Joint Effort
Prasoon Kharel (pkharel) - Joint Effort

Total time: 15

https://github.com/cs0320-s24/mock-pkharel-czhan157

# Design Choices

- Our project consists several components. Our highest level component is App, which contains the outermost information determining whether or not the user is loggined in. Then, we have our LoginButton component which the user can click to become signed in. We have REPL which combines other subcomponents such as REPLInput and REPLHistory, wrapping them in div to be displayed.
  The REPLInput component receives properties representing the REPL state such as command history, mode, current command, files, and search queries. It validates entered commands against a predefined list, executes commands by invoking corresponding functions, and updates the command history with feedback messages.

- The REPLHistory component manages the display of commands, their corresponding output, and previous commands. It takes in properties representing the command history and the current mode of the REPL. The component iterates through the command history and formats each command along with its output based on the specified mode. In "brief" mode, it displays only the output. In "verbose" mode, it shows both the command and its output.

- The REPLFunction module defines a set of properties required for executing REPL functions within the REPL environment. These properties include arguments, command history, mode, current command, current file, mocked files, and mocked search queries. It also provides default custom commands to load, search, and view the mocked CSVs. The module exports a set of default custom commands to easily use those as a "default" set of commands.

# Errors/Bugs

- No bugs

# Tests

To run the tests, you can then run npx playwright test (while also CDed into the mock directory). We did end to end testing with Playwright. We tested that our login button worked, that our interface for the user to type into worked, and that various load, search, and view commands viewed as expected. We also tested for malformed inputs: both for commands that didn't exist, and also for bad inputs into commands like load/view/search. We also tested to make sure that the user could easily and accurately switch between modes, and clear the display if necessary. We also tested that the user would receive informative error messages upon entering in a bad input, and that they would receive another helpful message if they typed in "help". We also tested the interaction between load/view/search functionality, making sure that if you loaded in another CSV after loading/viewing another the search/view results would be different.

# How to

Navigate to the mock directory in the project file in your terminal.

- Run npm install to install dependencies.
- Run npm start to start the application.
- Access the application in your web browser at the provided URL.
- Click the "Login" button to open the input field.

Using the REPL:

- Enter commands in the input field provided.
- Press the "Run Command!" button to execute the command.
- View the output displayed in the history section.

Available Commands:

- mode [brief/verbose]: Changes the mode of displaying results (arguments: 2).
- load_file [filename]: Loads a file into the program (arguments: 2).
- view [filename]: Displays the contents of the file (arguments: 1).
- search [value] [column]: Searches the file and returns the rows of the CSV where value is present in column (arguments: 3).
- help: Displays a helpful message about available commands (arguments: 1).
- check_mode: Checks the current mode (arguments: 1).
- clear: Clears search history (arguments: 1).

# Collaboration

N/A