import FuzzyGranularity, {
  FuzzyGranularitySequence,
  StandardGranularitySequence
} from 'listlab-api/FuzzyGranularity';

const instanceCache: {[key: string]: FuzzyTime} = {};

const buildCacheKey = (time: FuzzyTime) => {
  return time.getTime().getTime() + ',' + time.getGranularity().getKey();
};

export const buildFuzzyTime = (time: Date, granularity: FuzzyGranularity): FuzzyTime => {
  const newInstance = new FuzzyTime(time, granularity);
  const key = buildCacheKey(newInstance);
  const cachedInstance = instanceCache[key];
  if (!cachedInstance) {

    instanceCache[key] = newInstance;
    return newInstance;
  }
  return cachedInstance;
};

export default class FuzzyTime {

  private time: Date;

  private readonly granularity: FuzzyGranularity;

  constructor(time: Date, granularity: FuzzyGranularity) {
    this.time = new Date(time.getTime());
    this.granularity = granularity;
    this.stripInsignificantFigures();
  }

  public toString() {
    return this.time.toString() + this.granularity.getKey();
  }

  public static fromString(str: string) {
    const time = new Date(str.substr(0, str.length - 1));
    const granularity = FuzzyGranularity.fromKey(Number(str.substr(str.length - 1, str.length)));
    return buildFuzzyTime(time, granularity);
  }

  public withGranularity(granularity: FuzzyGranularity) {
    if (granularity === this.granularity) {
      return this;
    }
    return buildFuzzyTime(this.time, granularity);
  }

  public getGranularity(): FuzzyGranularity {
    return this.granularity;
  }

  public getTime(): Date {
    return new Date(this.time.getTime());
  }

  public static getCurrent(granularity: FuzzyGranularity): FuzzyTime {
    return buildFuzzyTime(new Date(unoffsetNow()), granularity);
  }

  public static getForever(): FuzzyTime {
    return FuzzyTime.getCurrent(FuzzyGranularity.FOREVER);
  }

  public getParent(nullableGranularity?: FuzzyGranularity) {
    const granularity = (
      nullableGranularity ||
      this.granularity.getNext(StandardGranularitySequence)
    );
    const parent = this.withGranularity(granularity);
    return parent;
  }

  public getParents(granularity?: FuzzyGranularity) {
    const forever = FuzzyTime.getForever();
    const parents: FuzzyTime[] = [];
    let lastParent: FuzzyTime = this;
    while (!lastParent.equals(forever)) {
      const parent = lastParent.getParent();
      parents.push(parent);
      lastParent = parent;
    }
    parents.push(forever);
    return parents;
  }

  public isParentOf(time: FuzzyTime) {
    return this.equals(time.getParent(this.granularity));
  }

  public contains(other: FuzzyTime) {
    if (this.getGranularity() === FuzzyGranularity.FOREVER) {
      return true;
    } else if (other.getGranularity() === FuzzyGranularity.FOREVER) {
      return false;
    }
    const start = this.time;
    const otherStart = other.time;
    const end = this.getNext().time;
    const otherEnd = other.getNext().time;
    return start <= otherStart && end >= otherEnd;
  }

  public overlaps(other: FuzzyTime) {
    if (
      other.getGranularity() === FuzzyGranularity.FOREVER ||
      this.getGranularity() === FuzzyGranularity.FOREVER
    ) {
      return true;
    }
    const start = this.time;
    const end = this.getNext().time;
    const otherStart = other.time;
    const otherEnd = other.getNext().time;
    return (
      // this before and overlapping other
      (start <= otherStart && end > otherStart) ||
      // other before and overlapping this
      (end >= otherEnd && start < otherEnd) ||
      // this contains other
      (start <= otherStart && end >= otherEnd) ||
      // other contains this
      (end <= otherEnd && start >= otherStart)
    );
  }

  public equals(other: FuzzyTime): boolean {
    if (other == null && this.getGranularity() === FuzzyGranularity.FOREVER) {
      return true;
    }
    return (
      this === other || (
        this &&
        other &&
        this.getGranularity() === other.getGranularity() &&
        this.time.getTime() === other.time.getTime()
      )
    );
  }

  public compareTo(other: FuzzyTime) {
    if (!other) {
      return 1;
    }
    if (this.granularity === FuzzyGranularity.FOREVER && other.getGranularity() === FuzzyGranularity.FOREVER) {
      return 0;
    } else if (other.getGranularity() === FuzzyGranularity.FOREVER) {
      return 1;
    } else if (this.granularity === FuzzyGranularity.FOREVER) {
      return -1;
    } else if (this.time < other.getTime()) {
      return -1;
    } else if (this.time > other.getTime()) {
      return 1;
    } else {
      return this.granularity.compareTo(other.getGranularity());
    }
  }

  private stripInsignificantFigures() {
    switch (this.granularity) {
      case FuzzyGranularity.MINUTE:
        this.time.setUTCSeconds(0, 0);
        break;
      case FuzzyGranularity.HOUR:
        this.time.setUTCMinutes(0, 0, 0);
        break;
      case FuzzyGranularity.DAY:
        this.time.setUTCHours(0, 0, 0, 0);
        break;
      case FuzzyGranularity.WEEK:
        this.time.setUTCHours(0, 0, 0, 0);
        this.time.setUTCDate(this.time.getUTCDate() - this.time.getUTCDay());
        break;
      case FuzzyGranularity.MONTH:
        this.time.setUTCHours(0, 0, 0, 0);
        this.time.setUTCDate(1);
        break;
      case FuzzyGranularity.YEAR:
        this.time.setUTCHours(0, 0, 0, 0);
        this.time.setUTCMonth(0, 1);
        break;
      case FuzzyGranularity.FOREVER:
        this.time = new Date(0);
        break;
      default:
        throw 'granularity not recognized';
    }
  }

  public offset(i: number): FuzzyTime {
    const offsetTime = this.getTime();

    switch (this.granularity) {
      case FuzzyGranularity.HOUR:
        offsetTime.setUTCHours(this.time.getUTCHours() + i);
        break;

      case FuzzyGranularity.DAY:
        offsetTime.setUTCDate(this.time.getUTCDate() + i);
        break;

      case FuzzyGranularity.WEEK:
        offsetTime.setUTCDate(this.time.getUTCDate() + 7 * i);
        break;

      case FuzzyGranularity.MONTH:
        offsetTime.setUTCMonth(this.time.getUTCMonth() + i);
        break;

      case FuzzyGranularity.YEAR:
        offsetTime.setUTCFullYear(this.time.getUTCFullYear() + i);
        break;

      default:
        throw 'granularity not recognized';
    }

    return buildFuzzyTime(offsetTime, this.getGranularity());
  }

  private next: FuzzyTime = null;
  public getNext(): FuzzyTime {
    if (!this.next) {
      this.next = this.offset(1);
    }
    return this.next;
  }

  private prev: FuzzyTime = null;
  public getPrev(): FuzzyTime {
    if (!this.prev) {
      this.prev = this.offset(-1);
    }
    return this.prev;
  }

  private deepNext: FuzzyTime = null;
  public getDeepNext(): FuzzyTime {
    if (!this.deepNext) {
      this.deepNext = FuzzyTime.generateDeepSpread(
        FuzzyGranularity.DAY,
        this,
        // If granularity is not DAY, .getNext Should be enough to produce
        // the necessary range. But if DAY, we need two days since deep spread
        // is start inclusive, end exclusive.
        this.getNext().getNext(),
        StandardGranularitySequence,
        2
      )[1];
    }
    return this.deepNext;
  }

  static generateSpread(start: FuzzyTime, endTime: Date, sequence: FuzzyGranularitySequence): FuzzyTime[] {
    let currentGranularity = start.getGranularity();
    let spread = new Array<FuzzyTime>();
    let last = start;
    while (currentGranularity !== FuzzyGranularity.FOREVER && last.getTime() < endTime) {
      const nextGranularity = FuzzyTime.getNextGranularity(currentGranularity, sequence);
      spread = spread.concat(this.generateSpreadForOneGranularity(
        last.getTime(),
        currentGranularity,
        nextGranularity,
        endTime
      ));
      last = spread[spread.length - 1].getNext().withGranularity(nextGranularity);
      currentGranularity = nextGranularity;
    }

    return spread;
  }

  /**
   * Generates an ordered  spread of all fuzzy dates at any level from
   * startTime (inclusive) to endTime (exclusive)
   */
  static generateDeepSpread(
    granularity: FuzzyGranularity,
    startTime: FuzzyTime,
    endTime: FuzzyTime,
    sequence: FuzzyGranularitySequence,
    limit: number
  ): FuzzyTime[] {
    let currentGranularity = granularity;
    const spread = new Array<FuzzyTime>();
    while (currentGranularity !== FuzzyGranularity.FOREVER) {
      let current = startTime.withGranularity(currentGranularity);
      // Ignoring limit until a better optimization is created. 500 for safety because 365+52+12 < 500
      while (current.compareTo(endTime) < 0 && spread.length < 400) {
        if (current.compareTo(startTime) >= 0) {
          spread.push(current);
        }
        current = current.getNext();
      }
      currentGranularity = FuzzyTime.getNextGranularity(currentGranularity, sequence);
    }
    spread.sort((a, b) => a.compareTo(b)).filter((_, i) => i < limit);
    return spread;
  }

  static generateSpreadForOneGranularity(
    startTime: Date,
    granularity: FuzzyGranularity,
    nextGranularity: FuzzyGranularity,
    endTime: Date
  ): FuzzyTime[] {
    let current = buildFuzzyTime(new Date(startTime.getTime()), granularity);
    // Always add at least one unit for the given granularity
    const result = new Array<FuzzyTime>(current);
    let next: Date;
    if (nextGranularity === FuzzyGranularity.FOREVER) {
      next = endTime;
    } else {
      next = (buildFuzzyTime(new Date(current.getTime().getTime()), nextGranularity)).getNext().getTime();
    }
    current = current.getNext();
    while (current.getTime() < next && current.getTime() < endTime) {
      result.push(current);
      current = current.getNext();
    }
    return result;
  }

  public static getNextGranularity(
    granularity: FuzzyGranularity,
    sequence: FuzzyGranularitySequence
  ): FuzzyGranularity {
    const currentIndex = sequence.indexOf(granularity);
    if (currentIndex < 0) {
      throw 'Given granularity not found in this sequence';
    } else if (currentIndex === sequence.length - 1) {
      return FuzzyGranularity.FOREVER;
    }

    return sequence[currentIndex + 1];
  }

  public getFirstChild() {
    if (this.getGranularity() === FuzzyGranularity.DAY) {
      throw 'Cannot get children of days';
    }
    return this.withGranularity(this.getGranularity().getPrev(StandardGranularitySequence));
  }
}


const timezoneOffset = new Date().getTimezoneOffset();

export const unoffsetNow = () => {
  // Pretend there are no timezones :)
  return Date.now() - (timezoneOffset * 60 * 1000);
};

export const fuzzyTimeNullableEquals = (a: FuzzyTime, b: FuzzyTime) => {
  if (a == null && b == null) {
    return true;
  } else if (a == null) {
    return b.equals(a);
  } else {
    return a.equals(b);
  }
};

export const fuzzyTimeNullableCompareTo = (a: FuzzyTime, b: FuzzyTime) => {
  if (a == null && b == null) {
    return 0;
  } else if (a == null) {
    return -1 * b.compareTo(a);
  } else {
    return a.compareTo(b);
  }
};