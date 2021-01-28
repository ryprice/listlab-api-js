import {StandardGranularitySequence} from 'listlab-api/fuzzyTime/FuzzyGranularity';
import RecurrenceSchedule from 'listlab-api/RecurrenceSchedule';
import Task from 'listlab-api/Task';

export default class Recurrence {
  public recurrenceId: number;
  public schedule: RecurrenceSchedule;
  public baseTaskId: number;
  public tasks: number[];

  public asTasks(baseTask: Task) {
    const {from, to, selected, period} = this.schedule;
    let cur = from.withGranularity(period);
    const tasks: Task[] = [];
    while(cur.compareTo(to) < 1) {
      selected.map((i) => {
        const task = baseTask.clone();
        task.taskId = null;
        task.recurrenceId = this.recurrenceId;
        task.due = cur.withGranularity(cur.getGranularity().getPrev(StandardGranularitySequence)).offset(i);
        tasks.push(task);
      });
      cur = cur.getNext();
    }
    return tasks;
  }

  public clone() {
    const recurrence = new Recurrence();
    recurrence.recurrenceId = this.recurrenceId;
    recurrence.baseTaskId = this.baseTaskId;
    recurrence.schedule = this.schedule.clone();
    recurrence.tasks = this.tasks;
    return recurrence;
  }
}
