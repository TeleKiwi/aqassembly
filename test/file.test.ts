import {expect, test} from 'bun:test'
import * as file from '../src/file'



test('import file that exists', async () => {
    const fileThatExists = 'test/asm/FILE_exists.asm'
    const expected = ["A"]
    const result = await file.loadFile(fileThatExists)
    
    expect(result).toEqual(expected)
})

test('reject file that doesn\'t exist', async () => {
    const fileThatExists = 'test/asm/FILE_exists.asm'
    const expected = ["A"]
    const result = await file.loadFile(fileThatExists)
    
    expect(result).toThrowError()
})