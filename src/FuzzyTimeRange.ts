import FuzzyTime from "./FuzzyTime";

export default class FuzzyTimeRange {

    private start: FuzzyTime;

    private end: FuzzyTime;

    constructor(start: FuzzyTime, end: FuzzyTime) {
        if (start && end && start.compareTo(end) > 0) {
            this.start = end;
            this.end = start;
        } else {
            this.start = start;
            this.end = end;
        }
    }

    public getStart() {
        return this.start;
    }

    public getEnd() {
        return this.end;
    }

    public setStart(start: FuzzyTime) {
        return new FuzzyTimeRange(start, this.end);
    }

    public setEnd(end: FuzzyTime) {
        return new FuzzyTimeRange(this.start, end);
    }
}
