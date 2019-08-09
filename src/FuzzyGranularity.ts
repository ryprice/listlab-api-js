import {VgtSequence} from 'ququmber-api/FuzzyTime';

export default class FuzzyGranularity {
  private readonly name: string;
  private readonly key: number;

  constructor(name: string, key: number) {
    this.name = name;
    this.key = key;
  }

  public getName(): string {
    return this.name;
  }

  public getKey(): number {
    return this.key;
  }

  public static MINUTE = new FuzzyGranularity('Minute', 1);
  public static HOUR = new FuzzyGranularity('Hour', 2);
  public static DAY = new FuzzyGranularity('Day', 3);
  public static WEEK = new FuzzyGranularity('Week', 4);
  public static MONTH = new FuzzyGranularity('Month', 5);
  public static YEAR = new FuzzyGranularity('Year', 6);
  public static FOREVER = new FuzzyGranularity('Forever', 7);

  private static readonly sizeStack: FuzzyGranularity[] = [
    FuzzyGranularity.MINUTE,
    FuzzyGranularity.HOUR,
    FuzzyGranularity.DAY,
    FuzzyGranularity.WEEK,
    FuzzyGranularity.MONTH,
    FuzzyGranularity.YEAR,
    FuzzyGranularity.FOREVER
  ];

  // Returns true if this granularity fits squarely inside of the given granularity.
  // Eg a week doesn't fit into a month, but a day fits into a week squarely.
  public fitsSquarelyIn(granularity: FuzzyGranularity): boolean {
    if (this === granularity || granularity === FuzzyGranularity.FOREVER) {
      return true;
    }
    if (this.compareTo(granularity) > 1) {
      return false;
    }
    return granularity !== FuzzyGranularity.WEEK;
  }

  // Determine which granularity is a larger unit of time
  public compareTo(other: FuzzyGranularity): number {
    const thisSize = FuzzyGranularity.sizeStack.indexOf(this);
    const otherSize = FuzzyGranularity.sizeStack.indexOf(other);

    if (thisSize < otherSize) {
      return 1;
    } else if (thisSize > otherSize) {
      return -1;
    }
    return 0;
  }

  public getNext(sequence: VgtSequence) {
    const idx = sequence.indexOf(this) + 1;
    if (sequence.length > idx) {
      return sequence[idx];
    }
    return FuzzyGranularity.FOREVER;
  }

  public getPrev(sequence: VgtSequence) {
    const idx = sequence.indexOf(this) - 1;
    if (sequence.length >= 0) {
      return sequence[idx];
    }
  }
}
