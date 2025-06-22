/**
 * AQAssembly Runtime
 * 
 * This module contains the Implementation class, which provides static methods for each AQAssembly instruction,
 * and the instructionMap and runInstruction function for dispatching and executing instructions.
 * 
 * Responsibilities:
 * - Defines the behavior of each supported instruction (LDR, STR, MOV, ADD, SUB, etc.).
 * - Provides a dispatch table (instructionMap) for opcode-to-implementation lookup.
 * - Exposes runInstruction to execute a single instruction in the context of a Process.
 */

import type { Process } from "./process"
import type { Instruction } from "./types"
import { OperandHelper, OperandTypeENUM } from "./types"

/**
 * Implementation class
 * 
 * Contains static methods for each AQAssembly instruction.
 * Each method receives an Instruction and a Process, performs the operation,
 * and updates the process state as needed.
 */
export class Implementation {
    /**
     * Load Register: Loads a value from memory into a register.
     */
    static LDR(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let src = process.readMemory(OperandHelper.getData(instruction, 1))
        process.writeRegister(dest, src)
    }

    /**
     * Store Register: Stores a register value into memory.
     */
    static STR(instruction: Instruction, process: Process) {
        let src = process.readRegister(OperandHelper.getData(instruction, 0))
        let dest = OperandHelper.getData(instruction, 1)
        process.writeMemory(dest, src)
    }

    /**
     * Move: Moves a value (immediate or register) into a register.
     */
    static MOV(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let src
        if (OperandHelper.getType(instruction, 1) === OperandTypeENUM.IMMEDIATE) {
            src = OperandHelper.getData(instruction, 1)
        } else {
            src = process.readRegister(OperandHelper.getData(instruction, 0))
        }
        process.writeRegister(dest, src)
    }

    /**
     * Add: Adds two values (register or immediate) and stores the result in a register.
     */
    static ADD(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let val1, val2, res
        val1 = process.readRegister(OperandHelper.getData(instruction, 1))
        if (OperandHelper.getType(instruction, 2) === OperandTypeENUM.IMMEDIATE) {
            val2 = OperandHelper.getData(instruction, 2)
        } else {
            val2 = process.readRegister(OperandHelper.getData(instruction, 2))
        }
        res = val1 + val2
        process.writeRegister(dest, res)
    }

    /**
     * Subtract: Subtracts two values (register or immediate) and stores the result in a register.
     */
    static SUB(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let val1, val2, res
        val1 = process.readRegister(OperandHelper.getData(instruction, 1))
        if (OperandHelper.getType(instruction, 2) === OperandTypeENUM.IMMEDIATE) {
            val2 = OperandHelper.getData(instruction, 2)
        } else {
            val2 = process.readRegister(OperandHelper.getData(instruction, 2))
        }
        res = val1 - val2
        process.writeRegister(dest, res)
    }

    /**
     * Compare: Compares two values and sets branch flags accordingly.
     */
    static CMP(instruction: Instruction, process: Process) {
        let val1 = process.readRegister(OperandHelper.getData(instruction, 0))
        let val2
        if (OperandHelper.getType(instruction, 1) === OperandTypeENUM.IMMEDIATE) {
            val2 = OperandHelper.getData(instruction, 1)
        } else {
            val2 = process.readRegister(OperandHelper.getData(instruction, 1))
        }

        process.clearBranchFlags()

        if (val1 === val2) {
            process.setBranchFlag("EQ")
        } else {
            process.setBranchFlag("NE")
            if (val1 < val2) {
                process.setBranchFlag("LT")
            }
            else if (val1 > val2) {
                process.setBranchFlag("GT")
            }
        }
    }

    /**
     * Branch: Jumps to a line number if the branch flag is set.
     */
    static B(instruction: Instruction, process: Process) {
        if (((!instruction.branchFlag === undefined) && process.flagIsSet(instruction.branchFlag))) {
            let lineNumber = OperandHelper.getData(instruction, 0)
            // Jump one instruction behind so the jumped-to instruction gets executed
            process.jump(lineNumber - 1)
        }
    }

    /**
     * Bitwise AND: Performs bitwise AND on two values and stores the result in a register.
     */
    static AND(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let val1, val2, res
        val1 = process.readRegister(OperandHelper.getData(instruction, 1))
        if (OperandHelper.getType(instruction, 2) === OperandTypeENUM.IMMEDIATE) {
            val2 = OperandHelper.getData(instruction, 2)
        } else {
            val2 = process.readRegister(OperandHelper.getData(instruction, 2))
        }
        res = val1 & val2
        process.writeRegister(dest, res)
    }

    /**
     * Bitwise OR: Performs bitwise OR on two values and stores the result in a register.
     */
    static ORR(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let val1, val2, res
        val1 = process.readRegister(OperandHelper.getData(instruction, 1))
        if (OperandHelper.getType(instruction, 2) === OperandTypeENUM.IMMEDIATE) {
            val2 = OperandHelper.getData(instruction, 2)
        } else {
            val2 = process.readRegister(OperandHelper.getData(instruction, 2))
        }
        res = val1 | val2
        process.writeRegister(dest, res)
    }

    /**
     * Bitwise XOR: Performs bitwise XOR on two values and stores the result in a register.
     */
    static XOR(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let val1, val2, res
        val1 = process.readRegister(OperandHelper.getData(instruction, 1))
        if (OperandHelper.getType(instruction, 2) === OperandTypeENUM.IMMEDIATE) {
            val2 = OperandHelper.getData(instruction, 2)
        } else {
            val2 = process.readRegister(OperandHelper.getData(instruction, 2))
        }
        res = val1 ^ val2
        process.writeRegister(dest, res)
    }

    /**
     * Bitwise NOT: Bitwise NOT of a value, stored in a register.
     */
    static MVN(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let val, res
        if (OperandHelper.getType(instruction, 1) === OperandTypeENUM.IMMEDIATE) {
            val = OperandHelper.getData(instruction, 1)
        } else {
            val = process.readRegister(OperandHelper.getData(instruction, 1))
        }
        res = ~val
        process.writeRegister(dest, res)
    }

    /**
     * Logical Shift Left: Shifts a register value left by a given amount.
     */
    static LSL(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let val1, val2, res
        val1 = process.readRegister(OperandHelper.getData(instruction, 1))
        if (OperandHelper.getType(instruction, 2) === OperandTypeENUM.IMMEDIATE) {
            val2 = OperandHelper.getData(instruction, 2)
        } else {
            val2 = process.readRegister(OperandHelper.getData(instruction, 2))
        }
        res = val1 << val2
        process.writeRegister(dest, res)
    }

    /**
     * Logical Shift Right: Shifts a register value right by a given amount.
     */
    static LSR(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let val1, val2, res
        val1 = process.readRegister(OperandHelper.getData(instruction, 1))
        if (OperandHelper.getType(instruction, 2) === OperandTypeENUM.IMMEDIATE) {
            val2 = OperandHelper.getData(instruction, 2)
        } else {
            val2 = process.readRegister(OperandHelper.getData(instruction, 2))
        }
        res = val1 >> val2
        process.writeRegister(dest, res)
    }

    /**
     * Halt: Sets the process halt flag to true, terminating execution.
     */
    static HALT(process: Process) {
        process.halt = true
    }

    /**
     * Label: Adds a label to the process label map.
     */
    static LABEL(instruction: Instruction, process: Process) {
        let label = instruction.operands![0].data
        process.addLabel({
            name: label,
            lineNumber: process.getLineNumber()
        })
    }

    /**
     * Output: Prints the value of a register, memory address, or immediate to the console.
     */
    static OUT(instruction: Instruction, process: Process) {
        let src
        let type = OperandHelper.getType(instruction, 0)
        if (type === OperandTypeENUM.REGISTER) {
            src = process.readRegister(OperandHelper.getData(instruction, 0))
        } else if (type = OperandTypeENUM.MEMORYADDR) {
            src = process.readMemory(OperandHelper.getData(instruction, 0))
        }
        else {
            src = OperandHelper.getData(instruction, 2)
        }
        console.log(src)
    }
}

/**
 * instructionMap
 * 
 * Maps opcode strings to their corresponding Implementation methods.
 * Used for dispatching instructions in runInstruction.
 */
const instructionMap: { 
    [key: string]: (instruction: Instruction, process: Process) => void 
} = {
    "LDR": Implementation.LDR,
    "STR": Implementation.STR,
    "MOV": Implementation.MOV,
    "ADD": Implementation.ADD,
    "SUB": Implementation.SUB,
    "CMP": Implementation.CMP,
    "B": Implementation.B,
    "AND": Implementation.AND,
    "ORR": Implementation.ORR,
    "XOR": Implementation.XOR,
    "MVN": Implementation.MVN,
    "LSL": Implementation.LSL,
    "LSR": Implementation.LSR,
    "OUT": Implementation.OUT,
    // "HALT" handled separately below
    // "NOP" handled separately below
};

/**
 * Executes a single instruction on the given process.
 * Handles HALT and NOP separately, otherwise dispatches using instructionMap.
 * Increments the process line number after execution.
 * 
 * @param instruction The instruction to execute.
 * @param process The process context.
 */
export function runInstruction(instruction: Instruction, process: Process) {
    if (instruction.opcode === "HALT") {
        Implementation.HALT(process);
    } else if (instruction.opcode === "NOP") {
        // Do nothing
    } else {
        const fn = instructionMap[instruction.opcode];
        if (fn) {
            fn(instruction, process);
        } else {
            try {
                Implementation.LABEL(instruction, process);
            } catch (err) {
                console.error("Not an instruction or label definition.");
            }
        }
    }
    process.incrementLineNumber();
}