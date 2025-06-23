/**
 * Process class for AQAssembly
 * 
 * This class represents the execution context for an AQAssembly program.
 * It manages registers, memory, branch flags, labels, and the current line number.
 * Provides methods for reading/writing registers and memory, managing branch flags,
 * handling labels, and controlling program flow.
 */

import type { BranchFlags, Opcode, Label } from "./types";

export class Process {
    private memory: Uint8Array;         // Simulated memory space
    private registers: Uint8Array;      // CPU registers
    private branchFlags: BranchFlags[]; // Active branch flags
    private lineNumber: number;         // Current instruction line number
    private labelMap: Label[];          // List of labels and their line numbers
    halt: boolean;                      // Halt flag for program termination

    constructor() {
        this.memory = new Uint8Array(255);      // 255 bytes of memory
        this.registers = new Uint8Array(13);    // 13 general-purpose registers
        this.branchFlags = [];
        this.labelMap = [];
        this.lineNumber = 0;
        this.halt = false;
    }

    /**
     * Reads the value from the specified register.
     * @param index Register index.
     * @returns Value stored in the register.
     */
    readRegister(index: number) {
        return this.registers[index];
    }

    /**
     * Reads the value from the specified memory address.
     * @param index Memory address.
     * @returns Value stored at the memory address.
     */
    readMemory(index: number) {
        return this.memory[index];
    }

    /**
     * Writes a value to the specified register.
     * @param index Register index.
     * @param data Value to write.
     */
    writeRegister(index: number, data: number) {
        this.registers[index] = data;
    }

    /**
     * Writes a value to the specified memory address.
     * @param index Memory address.
     * @param data Value to write.
     */
    writeMemory(index: number, data: number) {
        this.memory[index] = data;
    }

    /**
     * Sets a branch flag.
     * @param flag Branch flag to set.
     */
    setBranchFlag(flag: BranchFlags) {
        this.branchFlags.push(flag);
    }

    /**
     * Checks if a branch flag is set.
     * @param flag Branch flag to check.
     * @returns True if the flag is set, false otherwise.
     */
    flagIsSet(flag: BranchFlags) {
        return this.branchFlags.includes(flag);
    }

    /**
     * Clears all branch flags.
     */
    clearBranchFlags() {
        this.branchFlags = [];
    }

    /**
     * Adds a label to the label map.
     * @param label Label object containing name and line number.
     */
    addLabel(label: Label) {
        this.labelMap.push(label);
    }

    /**
     * Jumps to a specific line number in the program.
     * @param newLine Line number to jump to.
     */
    jump(newLine: number) {
        this.lineNumber = newLine;
    }
    /**
     * Finds the line number associated with a label.
     * @param labelName Name of the label to find.
     * @returns Line number if found, null otherwise.
     */

    findLabel(labelName: string): number | null {
        const label = this.labelMap.find(label => label.name === labelName);
        return label ? label.lineNumber : null;
    }

    /**
     * Gets the current line number.
     * @returns Current line number.
     */
    getLineNumber() {
        return this.lineNumber;
    }

    /**
     * Increments the current line number by one.
     */
    incrementLineNumber() {
        this.lineNumber++;
    }


}
