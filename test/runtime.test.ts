import {expect, test} from "bun:test"
import { Process } from "../src/process"
import * as Runtime from "../src/runtime"
import type { Instruction } from "../src/types"
import { newBlankInstruction, OperandTypeENUM } from "../src/types"
import { Random } from "../src/lib/rand"
import { mod } from "../src/lib/mod"

const process = new Process()

test('LDR', () => {
    process.reset() 
    const num = Random.nextInclusive(1, 10)
    process.writeMemory(0, num)
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "0",
            type: OperandTypeENUM.MEMORYADDR
        }
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
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "0",
            type: OperandTypeENUM.MEMORYADDR
        }
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
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: num.toString(),
            type: OperandTypeENUM.IMMEDIATE
        }
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
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "1",
            type: OperandTypeENUM.REGISTER
        }
    ]
    Runtime.Implementation.MOV(instruction, process)
    let res = process.readRegister(0)
    expect(res).toBe(num)
})


test('ADD reg + reg', () => {
    process.reset() 

    const num1 = Random.nextInclusive(1, 10)
    const num2 = Random.nextInclusive(1, 10) // register
    process.writeRegister(0, num1)
    process.writeRegister(1, num2)


    // register, register
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "1",
            type: OperandTypeENUM.REGISTER
        }
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
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: num2.toString(),
            type: OperandTypeENUM.IMMEDIATE
        }
    ]
    Runtime.Implementation.ADD(instruction, process)
    let res = process.readRegister(0)
    expect(res).toBe(num1 + num2)

    
})

test('SUB reg + reg', () => {
    process.reset() 

    const num1 = Random.nextInclusive(1, 10)
    const num2 = Random.nextInclusive(1, 10) // register
    process.writeRegister(0, num1)
    process.writeRegister(1, num2)


    // register, register
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "1",
            type: OperandTypeENUM.REGISTER
        }
    ]
    Runtime.Implementation.SUB(instruction, process)
    let res = process.readRegister(0)
    expect(res).toBe(mod(num1 - num2, 256))
})

test('SUB reg + imm', () => {
    process.reset() 

    const num1 = Random.nextInclusive(1, 10)
    const num2 = Random.nextInclusive(1, 10) 
    process.writeRegister(0, num1)
    
    let instruction: Instruction = newBlankInstruction()
    instruction.operands = [
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: num2.toString(),
            type: OperandTypeENUM.IMMEDIATE
        }
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
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "1",
            type: OperandTypeENUM.REGISTER
        }
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
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "1",
            type: OperandTypeENUM.REGISTER
        }
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
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "1",
            type: OperandTypeENUM.REGISTER
        }
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
        {
            data: "0",
            type: OperandTypeENUM.REGISTER
        },
        {
            data: "1",
            type: OperandTypeENUM.REGISTER
        }
    ]
    Runtime.Implementation.CMP(instruction, process)
    expect(process.flagIsSet("NE")).toBe(true)

})