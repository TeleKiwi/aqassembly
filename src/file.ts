/**
 * AQAssembly File Utilities
 * 
 * This module provides functions for loading and running AQAssembly source files.
 * It handles reading files, parsing lines into instructions, and executing them in a Process context.
 */

import { Process } from "./process"
import type { Instruction } from "./types"
import { runInstruction } from "./runtime"
import { parse } from "./parser"

/**
 * Runs an array of AQAssembly source lines.
 * Parses each line into an Instruction, then executes instructions sequentially
 * in a new Process until a HALT instruction is encountered.
 * 
 * @param file Array of source lines (strings) representing the AQAssembly program.
 */
export function runFile(file: string[]) {
    const instructions: Instruction[] = []
    let line = ""
    for (let i = 0; i <= file.length - 1; i++) {
        line = file[i]
        instructions.push(parse(line))
    }

    const process: Process = new Process()
    while (!process.halt) {
        runInstruction(instructions[process.getLineNumber()], process)
    }
}

/**
 * Loads a file from the given path and returns its contents as an array of lines.
 * Uses Bun's file API for reading files asynchronously.
 * Exits the process if the file does not exist.
 * 
 * @param filePath Path to the AQAssembly source file.
 * @returns Promise resolving to an array of lines (strings).
 */
export async function loadFile(filePath: string) {
    let path = filePath ?? ""
    let file

    try {
        file = Bun.file(path)
    } catch {
        console.error(`File ${path} does not exist.`)
        process.exit(1)
    }

    const fileAsLines: string[] = (await file.text()).split("\n")
    return fileAsLines
}