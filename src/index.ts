import {loadFile, runFile} from "./file"

async function main() {
    const filePath = process.argv.slice(2)[0]
    const file = await loadFile(filePath)
    runFile(file)
}

main();