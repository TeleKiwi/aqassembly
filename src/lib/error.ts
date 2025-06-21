export class Error {
    //! TERMINATING ERRORS
    //* Errors that wll end the process.

UnknownOpcode(operand: string) {
        console.error(`Operand ${operand} unknown.`)
        process.exit(1)
    }
    
    UnknownOperand(operand: string) {
        console.error(`Operand ${operand} unknown.`)
        process.exit(1)
    }
}