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

export enum OperandTypeENUM {
    REGISTER,
    IMMEDIATE,
    MEMORYADDR,
    LABEL
}

export type Opcode = "LDR" | "STR" | "MOV" | "ADD" | "SUB" | "CMP" | "B" | "AND" | "ORR" | "XOR" | "MVN" | "LSL" | "LSR" | "HALT" | "NOP" | "LABEL" | "OUT"

export type BranchFlags = "EQ" | "NE" | "LT" | "GT" | "UN" | undefined

export type Instruction = {
    opcode: Opcode
    branchFlag: BranchFlags
    operands: Operand[] | undefined
}

export function newBlankInstruction(): Instruction {
    return {
        opcode: OpcodeENUM.NOP,
        branchFlag: undefined,
        operands: undefined
    }
}

type Operand = {
    data: string,
    type: OperandTypeENUM
}

export type Label = {
    name: string,
    lineNumber: number
}

export class OperandHelper {
    static getData(instruction: Instruction, index: number) {
        return Number.parseInt(instruction.operands![index].data)
    }

    static getType(instruction: Instruction, index: number) {
        return instruction.operands![index].type
    }
}