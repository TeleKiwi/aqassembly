import { expect, test } from "bun:test"
import { Process } from "../src/process"
import * as Runtime from "../src/runtime"
import type { Instruction } from "../src/types"
import { newBlankInstruction, OperandTypeENUM } from "../src/types"
import { Random } from "../src/lib/rand"
import { mod } from "../src/lib/mod"
import { loadFile, runFile } from "../src/file"
import { parse } from "../src/parser"

const process = new Process()

test('LDR', () => {
    process.reset()
    const num = Random.nextInclusive(1, 10)
    process.writeMemory(0, num)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.MEMORYADDR }
    ]
    Runtime.Implementation.LDR(instruction, process)
    let res = process.readRegister(0)
    expect(res).toBe(num)
})

test('STR', () => {
    process.reset()
    const num = Random.nextInclusive(1, 10)
    process.writeRegister(0, num)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.MEMORYADDR }
    ]
    Runtime.Implementation.STR(instruction, process)
    let res = process.readMemory(0)
    expect(res).toBe(num)
})

test('MOV imm -> reg', () => {
    process.reset()
    const num = Random.nextInclusive(1, 10)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: num.toString(), type: OperandTypeENUM.IMMEDIATE }
    ]
    Runtime.Implementation.MOV(instruction, process)
    let res = process.readRegister(0)
    expect(res).toBe(num)
})

test('MOV reg -> reg', () => {
    process.reset()
    const num = Random.nextInclusive(1, 10)
    process.writeRegister(1, num)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.MOV(instruction, process)
    let res = process.readRegister(0)
    expect(res).toBe(num)
})

test('ADD reg + reg', () => {
    process.reset()
    const num1 = Random.nextInclusive(1, 10)
    const num2 = Random.nextInclusive(1, 10)
    process.writeRegister(0, num1)
    process.writeRegister(1, num2)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.ADD(instruction, process)
    let res = process.readRegister(0)
    expect(res).toBe(num1 + num2)
})

test('ADD reg + imm', () => {
    process.reset()
    const num1 = Random.nextInclusive(1, 10)
    const num2 = Random.nextInclusive(1, 10)
    process.writeRegister(0, num1)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: num2.toString(), type: OperandTypeENUM.IMMEDIATE }
    ]
    Runtime.Implementation.ADD(instruction, process)
    let res = process.readRegister(0)
    expect(res).toBe(num1 + num2)
})

test('SUB reg - reg', () => {
    process.reset()
    const num1 = Random.nextInclusive(1, 10)
    const num2 = Random.nextInclusive(1, 10)
    process.writeRegister(0, num1)
    process.writeRegister(1, num2)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.SUB(instruction, process)
    let res = process.readRegister(0)
    expect(res).toBe(mod(num1 - num2, 256))
})

test('SUB reg - imm', () => {
    process.reset()
    const num1 = Random.nextInclusive(1, 10)
    const num2 = Random.nextInclusive(1, 10)
    process.writeRegister(0, num1)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: num2.toString(), type: OperandTypeENUM.IMMEDIATE }
    ]
    Runtime.Implementation.SUB(instruction, process)
    let res = process.readRegister(0)
    expect(res).toBe(mod(num1 - num2, 256))
})

test('CMP eq', () => {
    process.reset()
    const num1 = Random.nextInclusive(1, 10)
    process.writeRegister(0, num1)
    process.writeRegister(1, num1)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.CMP(instruction, process)
    expect(process.flagIsSet("EQ")).toBe(true)
})

test('CMP ne', () => {
    process.reset()
    const num1 = Random.nextInclusive(1, 10)
    process.writeRegister(0, num1)
    process.writeRegister(1, num1 + 1)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.CMP(instruction, process)
    expect(process.flagIsSet("NE")).toBe(true)
})

test('CMP gt', () => {
    process.reset()
    const num1 = Random.nextInclusive(1, 10)
    process.writeRegister(0, num1)
    process.writeRegister(1, num1 - 1)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.CMP(instruction, process)
    expect(process.flagIsSet("GT")).toBe(true)
})

test('CMP lt', () => {
    process.reset()
    const num1 = Random.nextInclusive(1, 10)
    process.writeRegister(0, num1)
    process.writeRegister(1, num1 + 1)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.CMP(instruction, process)
    expect(process.flagIsSet("NE")).toBe(true)
})

test('B unconditional', async () => {
    const file = await loadFile("test/asm/PROCESS_b.asm")


    const instructions: Instruction[] = []
    let line = ""
    for (let i = 0; i <= file.length - 1; i++) {
        line = file[i]
        instructions.push(parse(line))
    }

    const process: Process = new Process()
    while (!process.halt) {
        Runtime.runInstruction(instructions[process.getLineNumber()], process)
    }

    expect(process.getLineNumber()).toBe(4)
})

test('B gt', async () => {
    const file = await loadFile("test/asm/PROCESS_bgt.asm")


    const instructions: Instruction[] = []
    let line = ""
    for (let i = 0; i <= file.length - 1; i++) {
        line = file[i]
        instructions.push(parse(line))
    }

    const process: Process = new Process()
    while (!process.halt) {
        Runtime.runInstruction(instructions[process.getLineNumber()], process)
    }

    expect(process.getLineNumber()).toBe(7)
})

test('B ne', async () => {
    const file = await loadFile("test/asm/PROCESS_bne.asm")


    const instructions: Instruction[] = []
    let line = ""
    for (let i = 0; i <= file.length - 1; i++) {
        line = file[i]
        instructions.push(parse(line))
    }

    const process: Process = new Process()
    while (!process.halt) {
        Runtime.runInstruction(instructions[process.getLineNumber()], process)
    }

    expect(process.getLineNumber()).toBe(7)
})

test('B lt', async () => {
    const file = await loadFile("test/asm/PROCESS_blt.asm")


    const instructions: Instruction[] = []
    let line = ""
    for (let i = 0; i <= file.length - 1; i++) {
        line = file[i]
        instructions.push(parse(line))
    }

    const process: Process = new Process()
    while (!process.halt) {
        Runtime.runInstruction(instructions[process.getLineNumber()], process)
    }

    expect(process.getLineNumber()).toBe(7)
})

test('B eq', async () => {
    const file = await loadFile("test/asm/PROCESS_beq.asm")


    const instructions: Instruction[] = []
    let line = ""
    for (let i = 0; i <= file.length - 1; i++) {
        line = file[i]
        instructions.push(parse(line))
    }

    const process: Process = new Process()
    while (!process.halt) {
        Runtime.runInstruction(instructions[process.getLineNumber()], process)
    }

    expect(process.getLineNumber()).toBe(7)
})

test('AND reg & reg', () => {
    process.reset()
    process.writeRegister(0, 0b1100)
    process.writeRegister(1, 0b1010)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "2", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.AND(instruction, process)
    expect(process.readRegister(2)).toBe(0b1000)
})

test('AND reg & imm', () => {
    process.reset()
    process.writeRegister(0, 0b1100)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "1", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "10", type: OperandTypeENUM.IMMEDIATE }
    ]
    Runtime.Implementation.AND(instruction, process)
    expect(process.readRegister(1)).toBe(0b1000)
})

test('ORR reg | reg', () => {
    process.reset()
    process.writeRegister(0, 0b1100)
    process.writeRegister(1, 0b1010)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "2", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.ORR(instruction, process)
    expect(process.readRegister(2)).toBe(0b1110)
})

test('ORR reg | imm', () => {
    process.reset()
    process.writeRegister(0, 0b1100)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "1", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "10", type: OperandTypeENUM.IMMEDIATE }
    ]
    Runtime.Implementation.ORR(instruction, process)
    expect(process.readRegister(1)).toBe(0b1110)
})

test('XOR reg ^ reg', () => {
    process.reset()
    process.writeRegister(0, 0b1100)
    process.writeRegister(1, 0b1010)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "2", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.XOR(instruction, process)
    expect(process.readRegister(2)).toBe(0b0110)
})

test('XOR reg ^ imm', () => {
    process.reset()
    process.writeRegister(0, 0b1100)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "1", type: OperandTypeENUM.REGISTER },
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "10", type: OperandTypeENUM.IMMEDIATE }
    ]
    Runtime.Implementation.XOR(instruction, process)
    expect(process.readRegister(1)).toBe(0b1100 ^ 10)
})

test('MVN reg', () => {
    process.reset()
    process.writeRegister(1, 0b10101010)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.MVN(instruction, process)
    expect(process.readRegister(0)).toBe(mod(~0b10101010, 256))
})

test('MVN imm', () => {
    process.reset()
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "170", type: OperandTypeENUM.IMMEDIATE }
    ]
    Runtime.Implementation.MVN(instruction, process)
    expect(process.readRegister(0)).toBe(mod(~170,256))
})

test('LSL reg << reg', () => {
    process.reset()
    process.writeRegister(1, 2)
    process.writeRegister(2, 3)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER },
        { data: "2", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.LSL(instruction, process)
    expect(process.readRegister(0)).toBe(2 << 3)
})

test('LSL reg << imm', () => {
    process.reset()
    process.writeRegister(1, 2)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER },
        { data: "3", type: OperandTypeENUM.IMMEDIATE }
    ]
    Runtime.Implementation.LSL(instruction, process)
    expect(process.readRegister(0)).toBe(2 << 3)
})

test('LSR reg >> reg', () => {
    process.reset()
    process.writeRegister(1, 16)
    process.writeRegister(2, 2)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER },
        { data: "2", type: OperandTypeENUM.REGISTER }
    ]
    Runtime.Implementation.LSR(instruction, process)
    expect(process.readRegister(0)).toBe(16 >> 2)
})

test('LSR reg >> imm', () => {
    process.reset()
    process.writeRegister(1, 16)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "0", type: OperandTypeENUM.REGISTER },
        { data: "1", type: OperandTypeENUM.REGISTER },
        { data: "2", type: OperandTypeENUM.IMMEDIATE }
    ]
    Runtime.Implementation.LSR(instruction, process)
    expect(process.readRegister(0)).toBe(16 >> 2)
})

test('HALT (sets correct flag)', () => {
    process.reset()
    Runtime.Implementation.HALT(process)
    expect(process.halt).toBe(true)
})

test('OUT register', () => {
    process.reset()
    process.writeRegister(1, 123)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "1", type: OperandTypeENUM.REGISTER }
    ]
    let output = Runtime.Implementation.OUT(instruction, process)
    expect(output).toBe(123)
})

test('OUT immediate', () => {
    process.reset()
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "42", type: OperandTypeENUM.IMMEDIATE }
    ]
    let output = Runtime.Implementation.OUT(instruction, process)
    expect(output).toBe(42)
})

test('OUT memory', () => {
    process.reset()
    process.writeMemory(5, 77)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        { data: "5", type: OperandTypeENUM.MEMORYADDR }
    ]
    let output = Runtime.Implementation.OUT(instruction, process)
    expect(output).toBe(77)
})