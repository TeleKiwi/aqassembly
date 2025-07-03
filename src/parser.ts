/**
 * AQAssembly Parser
 * 
 * This module provides functions to parse lines of AQAssembly source code into
 * structured Instruction objects. It handles labels, opcodes, branch flags, and
 * operand type detection.
 */

import type { Instruction } from "./types"
import { OperandTypeENUM, OpcodeENUM, newBlankInstruction } from "./types"

/**
 * Splits a line into opcode and operands, ensuring commas are present between operands.
 * Exits the process if a comma is missing.
 * @param line The raw instruction line.
 * @returns Array of opcode and operand strings.
 */
function checkAndRemoveCommas(line: string): string[] {
    // If the line is a single word (likely just an opcode), return as array
    if (line.split(" ").length === 1) return [line]

    // Split the line into opcode and operand parts
    const operandParts = line.split(" ").slice(1)
    if (operandParts.length === 0) {
        return [line]
    } else if (operandParts.length === 1) {
        return line.split(" ")
    }

    // Check for commas between operands
    for (let i = 0; i <= operandParts.length - 2; i++) {
        let operand = operandParts[i]
        if (operand[operand.length - 1] === ",") {
            operandParts[i] = operand.slice(0, -1)
        } else {
            console.error(`Comma missing; ${line}`)
            process.exit(1)
        }
    }

    // Prepend the opcode to the operands array
    operandParts.unshift(line.split(" ")[0])
    return operandParts
}

/**
 * Parses a label definition line into an Instruction object.
 * @param label The label string (ending with ':').
 * @returns An Instruction object representing the label.
 */
function tryParseLabel(label: string): Instruction {
    label = label.split(":")[0]
    return {
        opcode: "LABEL",
        branchFlag: undefined,
        operands: [{
            data: label,
            type: OperandTypeENUM.LABEL
        }]
    }
}

/**
 * Parses a single line of AQAssembly code into an Instruction object.
 * Handles labels, branch instructions, and regular instructions.
 * Validates opcodes and operand formats.
 * @param line The raw line of assembly code.
 * @returns The parsed Instruction object.
 */
export function parse(line: string): Instruction {
    line = line.trim()
    if (line[line.length - 1] === ":") {
        return tryParseLabel(line)
    }
    let parsedLine: Instruction = newBlankInstruction()
    let lineSegments: string[] = []

    lineSegments = checkAndRemoveCommas(line)
    let opcodeString: string = lineSegments[0]

    // Handle branch instructions (e.g., B, BGT, BLT, BEQ, BNE)
    if (opcodeString[0] === OpcodeENUM.B) {
        parsedLine.opcode = OpcodeENUM.B
        
        switch (opcodeString.substring(1, 3)) {
            case "GT":
                parsedLine.branchFlag = "GT"
                break;
            case "LT":
                parsedLine.branchFlag = "LT"
                break;
            case "EQ":
                parsedLine.branchFlag = "EQ"
                break;
            case "NE":
                parsedLine.branchFlag = "NE"
                break;
            case "":
                parsedLine.branchFlag = "UN"
                break;
            default:
                console.error(`Invalid branch flag ${opcodeString[0].substring(1, 3)}.`)
                process.exit(1);
        }
        // operands will be set below if present
    } else {
        // Validate opcode
        if (!(opcodeString in OpcodeENUM)) {
            console.error(`Invalid opcode ${opcodeString}.`)
            process.exit(1);
        } else {
            //@ts-ignore
            parsedLine.opcode = opcodeString
        }
    }

    /**
     * Determines the operand type and value from a raw operand string.
     * @param rawData The raw operand string.
     * @returns Operand object with type and data.
     */
    function determineOperands(rawData: string) {
        if (rawData === OpcodeENUM.B) {
            return {
                data: rawData,
                type: OperandTypeENUM.LABEL
            }
        }
        else {
            let operandType: OperandTypeENUM
            switch (rawData[0]) {
                case "R":
                    operandType = OperandTypeENUM.REGISTER
                    rawData = rawData.slice(1)
                    break;
                case "#":
                    operandType = OperandTypeENUM.IMMEDIATE
                    rawData = rawData.slice(1)
                    break;
                default:
                    operandType = OperandTypeENUM.MEMORYADDR;
                    break;
            }
            return {
                data: rawData,
                type: operandType
            }
        }
    }

    // Parse operands if present
    if (lineSegments.length > 1) {
        lineSegments.shift()
        parsedLine.operands = lineSegments.map((e) => determineOperands(e))
    }

    return parsedLine
}