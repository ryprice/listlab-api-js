import FuzzyGranularity from 'ququmber-api/FuzzyGranularity';
import FuzzyTime from 'ququmber-api/FuzzyTime';

export default class RecurrenceSchedule {
  from: FuzzyTime;
  to: FuzzyTime;
  period: FuzzyGranularity;
  selected: number[] = [];

  public clone = () => {
    const recurrenceSchedule = new RecurrenceSchedule();
    recurrenceSchedule.from = this.from;
    recurrenceSchedule.to = this.to;
    recurrenceSchedule.period = this.period;
    recurrenceSchedule.selected = this.selected.slice(0);
    return recurrenceSchedule;
  }
}
