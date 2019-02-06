import FuzzyGranularity from './FuzzyGranularity';
import FuzzyTime from './FuzzyTime';

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

  public equals(otherRange: FuzzyTimeRange): boolean {
    return this.start.equals(otherRange.getStart()) && this.end.equals(otherRange.getEnd());
  }

  public expandToInclude(time: FuzzyTime): FuzzyTimeRange {
    if (this.start && this.start.compareTo(time) < 0) {
      return this.setStart(time);
    } else if (this.end && this.end.compareTo(time) > 0) {
      return this.setEnd(time);
    }
    return this;
  }

  public contains(time: FuzzyTime): boolean {
    if (
      this.start.getGranularity() === FuzzyGranularity.FOREVER &&
      this.end.getGranularity() === FuzzyGranularity.FOREVER
    ) {
      return true;
    } else if (this.start.getGranularity() === FuzzyGranularity.FOREVER) {
      return this.end.compareTo(time) < 1;
    } else if (this.start.getGranularity() === FuzzyGranularity.FOREVER) {
      return this.start.compareTo(time) > 1;
    } else {
      return (
        (this.start.compareTo(time) > 1 && this.end.compareTo(time) < 1) ||
        this.start.contains(time) ||
        this.end.contains(time)
      );
    }
  }
}
