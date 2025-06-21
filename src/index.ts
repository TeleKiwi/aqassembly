import {loadFile, runFile} from "./file"

async function main() {
    const file = await loadFile()
    runFile(file)
}

main();