/**
 * AQAssembly Types and Enums
 * 
 * This module defines the core types, enums, and helpers used throughout the AQAssembly
 * runtime, parser, and process modules. It provides type safety and utility functions
 * for working with instructions, operands, opcodes, and labels.
 */

/**
 * OpcodeENUM
 * 
 * Enum representing all supported AQAssembly opcodes.
 */
export enum OpcodeENUM {
    LDR = "LDR",
    STR = "STR",
    MOV = "MOV",
    ADD = "ADD",
    SUB = "SUB",
    CMP = "CMP",
    B = "B",
    AND = "AND",
    ORR = "ORR",
    XOR = "XOR",
    MVN = "MVN",
    LSL = "LSL",
    LSR = "LSR",
    HALT = "HALT",
    NOP = "NOP",
    LABEL = "LABEL",
    OUT = "OUT"
}

/**
 * OperandTypeENUM
 * 
 * Enum representing the type of an operand in an instruction.
 * - REGISTER: Register operand (e.g., R1)
 * - IMMEDIATE: Immediate value (e.g., #5)
 * - MEMORYADDR: Memory address operand
 * - LABEL: Label operand
 */
export enum OperandTypeENUM {
    REGISTER,
    IMMEDIATE,
    MEMORYADDR,
    LABEL
}

/**
 * Opcode
 * 
 * Union type of all valid opcode string literals.
 */
export type Opcode =
    | "LDR" | "STR" | "MOV" | "ADD" | "SUB" | "CMP" | "B"
    | "AND" | "ORR" | "XOR" | "MVN" | "LSL" | "LSR"
    | "HALT" | "NOP" | "LABEL" | "OUT"

/**
 * BranchFlags
 * 
 * Union type for all supported branch flag strings.
 */
export type BranchFlags = "EQ" | "NE" | "LT" | "GT" | "UN" | undefined

/**
 * Instruction
 * 
 * Represents a parsed AQAssembly instruction.
 * - opcode: The operation code (e.g., "ADD", "MOV").
 * - branchFlag: Optional branch flag for branch instructions.
 * - operands: Array of operands or undefined.
 */
export type Instruction = {
    opcode: Opcode
    branchFlag: BranchFlags
    operands: Operand[] | undefined
}

/**
 * newBlankInstruction
 * 
 * Utility function to create a blank (NOP) instruction.
 * @returns An Instruction object with NOP opcode and no operands.
 */
export function newBlankInstruction(): Instruction {
    return {
        opcode: OpcodeENUM.NOP,
        branchFlag: undefined,
        operands: undefined
    }
}

/**
 * Operand
 * 
 * Represents a single operand in an instruction.
 * - data: The operand value as a string (register number, immediate value, etc.).
 * - type: The type of operand (REGISTER, IMMEDIATE, MEMORYADDR, LABEL).
 */
type Operand = {
    data: string,
    type: OperandTypeENUM
}

/**
 * Label
 * 
 * Represents a label in the assembly code.
 * - name: The label's name.
 * - lineNumber: The line number where the label is defined.
 */
export type Label = {
    name: string,
    lineNumber: number
}

/**
 * OperandHelper
 * 
 * Utility class for extracting operand data and type from an instruction.
 */
export class OperandHelper {
    /**
     * Gets the numeric value of an operand at the specified index.
     * @param instruction The instruction object.
     * @param index The operand index.
     * @returns The operand value as a number.
     */
    static getData(instruction: Instruction, index: number) {
        return Number.parseInt(instruction.operands![index].data)
    }

    /**
     * Gets the type of an operand at the specified index.
     * @param instruction The instruction object.
     * @param index The operand index.
     * @returns The operand type (OperandTypeENUM).
     */
    static getType(instruction: Instruction, index: number) {
        return instruction.operands![index].type
    }
}