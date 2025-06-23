export class Random {

    static nextExclusive(min = 0, max = 10) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    static nextInclusive(min = 0, max = 10) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

}