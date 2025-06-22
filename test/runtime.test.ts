import {expect, test} from "bun:test"
import { Process } from "../src/process"
import * as Runtime from "../src/runtime"
import type { Instruction } from "../src/types"
import { newBlankInstruction, OperandTypeENUM } from "../src/types"
import { Random } from "../src/lib/rand"
import { moveEmitHelpers } from "typescript"

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


// test('ADD reg + reg', () => {
//     process.reset() 

//     const num1 = Random.nextInclusive(1, 10)
//     const num2 = Random.nextInclusive(1, 10) // register
//     process.writeRegister(0, num1)
//     process.writeRegister(1, num2)


//     // register, register
//     let instruction: Instruction = newBlankInstruction()
//     instruction.operands = [
//         {
//             data: "0",
//             type: OperandTypeENUM.REGISTER
//         },
//         {
//             data: "0",
//             type: OperandTypeENUM.REGISTER
//         },
//         {
//             data: "1",
//             type: OperandTypeENUM.REGISTER
//         }
//     ]
//     Runtime.Implementation.ADD(instruction, process)
//     let res = process.readRegister(0)
//     expect(res).toBe(num1 + num2)
// })

// test('ADD reg + mem', () => {
//     process.reset() 

//     const num1 = Random.nextInclusive(1, 10)
//     const num2 = Random.nextInclusive(1, 10) 
//     process.writeRegister(0, num1)
//     process.writeMemory(0, num2)
    
//     let instruction: Instruction = newBlankInstruction()
//     instruction.operands = [
//         {
//             data: "0",
//             type: OperandTypeENUM.REGISTER
//         },
//         {
//             data: "0",
//             type: OperandTypeENUM.REGISTER
//         },
//         {
//             data: "0",
//             type: OperandTypeENUM.MEMORYADDR
//         }
//     ]
//     Runtime.Implementation.ADD(instruction, process)
//     let res = process.readRegister(0)
//     expect(res).toBe(num1 + num2)

    
// })