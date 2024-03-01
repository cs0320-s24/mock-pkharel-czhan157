# Project Details

Mock

Caroline Zhang (czhan157) - Joint Effort
Prasoon Kharel (pkharel) - Joint Effort

Total time:

https://github.com/cs0320-s24/mock-pkharel-czhan157

# Design Choices

- We decided to store the search history data in a hashmpa. By utilizing a hashmap, we ensure fast access to historical commands and their respective outputs. This choice not only enhances the efficiency of command retrieval but also simplifies the implementation of features like verbose mode, where displaying both commands and outputs is required. Additionally, the hashmap's key-value pairs provide a natural association between commands and outputs, facilitating seamless organization and retrieval.

- We added additional commands, such as check_mode, clear, and help. These commands were made for testing and for user experience as well.
  help and check_mode also adhere to verbose mode, but clear simply clears the history map.

- To ensure that each key in the hashmap was unique, we gave each key its timestamp as well, by adding to the key string with a ~,
  which we filtered out in the REPLHistory class to ensure that verbose mode wasn't printing a long string of numbers. We also included
  a specific string "<br>" at every point we wanted a line break in the output, and had the REPLHistory class deal with this too.

- We coded the CSV functionality in the REPLFunction class. The functions here are separated from REPLInput because this allowed us
  to code user story 6 easier and it also allowed for better code organization.

# Errors/Bugs

- Having the search history be represented as a hashmap (key: command, value: output) caused repeating commands to override keys
  and interfere with search history. We fixed this by including the timestamp of each addtion to the hashmap, and filtered it
  out of being printed out by slicing the string based on some arbitrary key we felt would not be important to the search
  functionality (~).

- There were frequent bugs with misuisng props. When trying to extract out and make our code cleaner by separating functions, connecting
  the classes through props was very tedious. Most of these were small and easy fixes, though, and were caused by re-instantiating
  the prop as a variable or forgetting to include "props." before the variable name.

-

# Tests

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
