import CRDTOrderDoc from 'listlab-api/CRDTOrderDoc';
import FuzzyTime from 'listlab-api/fuzzyTime/FuzzyTime';

export default interface TaskDueOrderTuple {
  userId: number;
  due: FuzzyTime;
  doc: CRDTOrderDoc<number>;
}
