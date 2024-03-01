import React, { useState, useEffect } from "react";

export interface REPLFunction {
  (args: string[]): string | string[][];
}

class Command {
  constructor(public name: string, public func: REPLFunction) {}
}

class CommandProcessor {
  private commands: Command[] = [];

  // Register a new command
  registerCommand(name: string, func: REPLFunction): void {
    this.commands.push(new Command(name, func));
  }

  // Process the input command
  processCommand(input: string): string | string[][] {
    const [commandName, ...args] = input.split(" ");
    const command = this.commands.find((cmd) => cmd.name === commandName);
    if (command) {
      return command.func(args);
    } else {
      return "Command not found";
    }
  }
}

// Example usage:
const processor = new CommandProcessor();

// Registering a new command
processor.registerCommand("greet", (args: string[]) => {
  const name = args[0] || "World";
  return `Hello, ${name}!`;
});

// Registering another command
processor.registerCommand("add", (args: string[]) => {
  const nums = args.map(Number);
  const sum = nums.reduce((acc, curr) => acc + curr, 0);
  return sum.toString();
});

// Example input
console.log(processor.processCommand("greet")); // Output: Hello, World!
console.log(processor.processCommand("greet Alice")); // Output: Hello, Alice!
console.log(processor.processCommand("add 5 10")); // Output: 15
