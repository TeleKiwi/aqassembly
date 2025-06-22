import type { Process } from "./process"
import type { Instruction } from "./types"
import { OperandHelper, OperandTypeENUM } from "./types"

export class Implementation {
    static LDR(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let src = process.readMemory(OperandHelper.getData(instruction, 1))
        process.writeRegister(dest, src)
    }

    static STR(instruction: Instruction, process: Process) {
        let src = process.readRegister(OperandHelper.getData(instruction, 0))
        let dest = OperandHelper.getData(instruction, 1)
        process.writeMemory(dest, src)
    }

    static MOV(instruction: Instruction, process: Process) {
        let dest = OperandHelper.getData(instruction, 0)
        let src
        if (OperandHelper.getType(instruction, 1) === OperandTypeENUM.IMMEDIATE) {
            src = OperandHelper.getData(instruction, 1)     
        } else {
            src = process.readRegister(OperandHelper.getData(instruction, 1))
        }
        process.writeRegister(dest, src)
        
    }

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

    static B(instruction: Instruction, process: Process) {
        if (((!instruction.branchFlag === undefined) && process.flagIsSet(instruction.branchFlag))) {
            let lineNumber = OperandHelper.getData(instruction, 0)
            // Jump one instruction behind so the jumped-to instruction gets executed
            process.jump(lineNumber - 1)
        }
    }

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

    static HALT(process: Process) {
        process.halt = true
    }

    static LABEL(instruction: Instruction, process: Process) {
        let label = instruction.operands![0].data
        process.addLabel({
            name: label,
            lineNumber: process.getLineNumber()
        })
    }

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