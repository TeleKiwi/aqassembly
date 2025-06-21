import type { BranchFlags, Opcode, Label } from "./types";
import { OpcodeENUM } from "./types";

export class Process {
    private memory: Uint8Array;
    private registers: Uint8Array;
    private branchFlags: BranchFlags[];
    private lineNumber: number;
    private labelMap: Label[];
    halt: boolean;

    constructor() {
        this.memory = new Uint8Array(255);
        this.registers = new Uint8Array(13);
        this.branchFlags = [];
        this.labelMap = [];
        this.lineNumber = 0;
        this.halt = false;
    }

    readRegister(index: number) {
        return this.registers[index];
    }

    readMemory(index: number) {
        return this.memory[index];
    }

    writeRegister(index: number, data: number) {
        this.registers[index] = data;
    }

    writeMemory(index: number, data: number) {
        this.memory[index] = data;
    }

    setBranchFlag(flag: BranchFlags) {
        this.branchFlags.push(flag);
    }

    flagIsSet(flag: BranchFlags) {
        return this.branchFlags.includes(flag);

    }

    clearBranchFlags() {
        this.branchFlags = [];
    }

    addLabel(label: Label) {
        this.labelMap.push(label);
    }

    jump(newLine: number) {
        this.lineNumber = newLine;
    }

    getLineNumber() {
        return this.lineNumber;
    }

    incrementLineNumber() {
        this.lineNumber++;
    }


}
