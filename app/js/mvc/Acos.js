const delta = 0.001;
const keyFactor = 1000;

export default class Acos {
    constructor() {
        this.values = [];

        for (let x = 0; x <= 1; x += delta) {
            this.values[this.getKey(x)] = Math.acos(x);
        }

        this.values[this.getKey(1)] = Math.acos(1);

        for (let x = 0; x >= -1; x -= delta) {
            this.values[this.getKey(x)] = Math.acos(x);
        }

        this.values[this.getKey(-1)] = Math.acos(-1);

    }

    getKey(x) {
        if (x < 0) {
            return keyFactor + Math.round(x * -keyFactor);
        }

        return Math.round(x * keyFactor);
    }

    evaluate(x) {
        return this.values[this.getKey(x)];
    }
}