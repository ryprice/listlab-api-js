import CRDTOrderDoc from 'listlab-api/CRDTOrderDoc';

export default interface TaskDueOrderTuple {
  taskId: number;
  doc: CRDTOrderDoc<number>;
}
