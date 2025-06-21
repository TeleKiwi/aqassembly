import { Process } from "./process"
import type { Instruction } from "./types"
import { runInstruction } from "./runtime"
import { parse } from "./parser"

export function runFile(file: string[]) {
    const instructions: Instruction[] = []
    let line = ""
    for (let i = 0; i <= file.length - 1; i++) {
        line = file[i]
        instructions.push(parse(line))
    }

    const process: Process = new Process()
    instructions.forEach(instruction => {
        runInstruction(instruction, process)
    })
}

export async function loadFile(filePath: string) {
    let path = filePath ?? ""
    let file

    try {
        file = Bun.file(path)
    } catch {
        console.error(`File ${path} does not exist.`)
        process.exit(1)
    }

    const fileAsLines: string[] = (await file.text()).split("\n")
    return fileAsLines
}