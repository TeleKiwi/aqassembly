export class Reader {
    private async* generator() {
        for await(const line of console) {
            yield line;
        }
    }

    nextVal;

    constructor() {
        this.nextVal = this.generator();
    }

    async next(query = "") {
        console.write(query)
        let val = await this.nextVal.next()
        return val.value
    }
}
