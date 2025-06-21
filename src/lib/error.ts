export class Error {
    //* NON-TERMINATING ERRORS
    //* Errors that warn but continue the process.




    //! TERMINATING ERRORS
    //! Errors that wll end the process.

    FileNotFound(filePath: string) {
        throw `The file could not be found. (path: ${filePath})`
    }

    InvalidExtension(filePath: string) {
        const extension = filePath.split(".")[1]
        throw `Bad extension ${extension}. ASM files should have the extension \'.asm\'. (path: ${filePath})`
    }

    UnknownOpcode(opcode: string) {
        throw `Opcode ${opcode} is unknown.`
    }
    
    UnknownOperand(operand: string) {
        throw `Operand ${operand} is unknown.`
    }
}