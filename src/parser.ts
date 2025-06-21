import type { Instruction } from "./types"
import {OperandTypeENUM, OpcodeENUM, newBlankInstruction} from "./types"

function checkAndRemoveCommas(line: string) {
    if (line.split(" ").length === 1) return [line]
    let lineSplit = line.split(" ").slice(1)
    if (lineSplit.length === 0) {
        return [line]
    }
    else if (lineSplit.length === 1) {
        return line.split(" ")
    }
    let word = ""
    for (let i = 0; i <= lineSplit.length - 2; i++) {
        word = lineSplit[i]
        if (word[word.length - 1] === ",") {
            word = `${word.split(",")[0]}`
            lineSplit[i] = word

        } else {
            console.error(`Comma missing; ${line}`)
            process.exit(1)
        }
    }
    lineSplit.unshift(`${line.split(" ")[0]}`)
    return lineSplit

}

function tryParseLabel(label: string): Instruction {
    label = label.split(":")[0]
    return {
        opcode: "LABEL",
        branchFlag: undefined,
        operands: [{
            data: label,
            type: OperandTypeENUM.LABEL
        }
        ]

    }
}

export function parse(line: string): Instruction {
    line = line.trim()
    if (line[line.length - 1] === ":") {
        return tryParseLabel(line)
    }
    let parsedLine: Instruction = newBlankInstruction()
    let lineSegments: string[] = []

    lineSegments = checkAndRemoveCommas(line)
    let opcodeString: string = lineSegments[0]
    if (opcodeString[0] === OpcodeENUM.B) {
        parsedLine.opcode = OpcodeENUM.B
        
        switch (opcodeString.substring(1, 3)) {
            case "GT":
                
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

        parsedLine.operands

    } else {
        if (!(opcodeString in OpcodeENUM)) {
            console.error(`Invalid opcode ${opcodeString}.`)
            process.exit(1);
        } else {
            //@ts-ignore
            parsedLine.opcode = opcodeString
        }
    }


    function determineOperands(rawData: string[0]) {
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
    if (lineSegments.length > 1) {

        lineSegments.shift()

        parsedLine.operands = lineSegments.map((e) => determineOperands(e))
    }

    return parsedLine
}